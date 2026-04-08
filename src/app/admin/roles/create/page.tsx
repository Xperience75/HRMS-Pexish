"use client";

import React, { useState } from "react";
import { createRole } from "../actions";

type PermissionActions = "create" | "read" | "update" | "delete" | "approve";
type PermissionsState = Record<string, Record<PermissionActions, boolean>>;

export default function CustomRoleBuilder() {
  const [roleName, setRoleName] = useState("Regional HR Specialist");
  const [roleDesc, setRoleDesc] = useState("Manages regional compliance, employee lifecycle events, and recruitment for EMEA territory.");
  
  // Security Policies
  const [dataMasking, setDataMasking] = useState(true);
  const [enforceMfa, setEnforceMfa] = useState(false);

  // Default Matrix
  const [matrix, setMatrix] = useState<PermissionsState>({
    employees: { create: true, read: true, update: true, delete: false, approve: false },
    payroll: { create: false, read: true, update: false, delete: false, approve: true },
    assets: { create: true, read: true, update: true, delete: true, approve: false },
    ats: { create: true, read: true, update: true, delete: false, approve: true },
    performance: { create: false, read: true, update: false, delete: false, approve: false },
  });

  const togglePermission = (module: string, action: PermissionActions) => {
    setMatrix(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action]
      }
    }));
  };

  const handlePublish = async () => {
    // 1. Compile the granular JSON permissions array based on UI state
    const compiledPermissions: string[] = [];

    // Map UI Checkboxes -> "module:action" payload
    Object.keys(matrix).forEach((mod) => {
      Object.entries(matrix[mod]).forEach(([action, isGranted]) => {
        if (isGranted) compiledPermissions.push(`${mod}:${action}`);
      });
    });

    // Wire: "Hide Financial/Salary Fields" explicitly pushes "finance:masked"
    if (dataMasking) {
      compiledPermissions.push("finance:masked");
    }
    if (enforceMfa) {
      compiledPermissions.push("auth:mfa_required");
    }

    alert(`Publishing role '${roleName}' with permissions:\n` + compiledPermissions.join("\n"));

    // 2. Trigger Next.js Server Action
    const result = await createRole({
      name: roleName,
      description: roleDesc,
      permissions: compiledPermissions,
      tenantId: "mock-tenant-id", // Hardcoded for Sprint 1 isolated testing
    });

    if (result.success) {
      alert("Role published and recorded efficiently in the Audit Log!");
    } else {
      alert("Error publishing role");
    }
  };

    return (
      <div className="w-full flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-headline font-extrabold tracking-tight">Custom Role Builder</h2>
              <p className="text-[#4e4634] mt-1 text-sm">Define granular permissions and data access layers for organizational cohorts.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-[#efe8d7] text-[#1e1b11] text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">Discard Draft</button>
              <button onClick={handlePublish} className="px-8 py-2.5 bg-[#745b00] text-white text-sm font-semibold rounded-lg hover:opacity-90 shadow-lg shadow-black/10">Publish Role</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span className="text-[#745b00]">🔹</span> Role Identity
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-2">Role Name</label>
                  <input value={roleName} onChange={e => setRoleName(e.target.value)} className="w-full bg-[#e9e2d1] border-none focus:border-[#745b00] focus:ring-0 rounded-lg p-4 font-headline font-bold" type="text" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-2">Role Description</label>
                  <textarea value={roleDesc} onChange={e => setRoleDesc(e.target.value)} className="w-full bg-[#e9e2d1] border-none focus:border-[#745b00] rounded-lg p-4 text-sm resize-none" rows={3}></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#745b00]/5">
              <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span className="text-[#745b00]">🛡️</span> Security Protocols
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#fbf3e2] rounded-lg cursor-pointer" onClick={() => setDataMasking(!dataMasking)}>
                  <div>
                    <p className="text-sm font-headline font-bold leading-tight">Data Masking</p>
                    <p className="text-[11px] text-[#4e4634] mt-1">Hide Financial/Salary Fields from this role.</p>
                  </div>
                  <input type="checkbox" checked={dataMasking} readOnly className="w-5 h-5 rounded text-[#745b00]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#fbf3e2] rounded-lg cursor-pointer" onClick={() => setEnforceMfa(!enforceMfa)}>
                  <div>
                    <p className="text-sm font-headline font-bold leading-tight">Enforce MFA</p>
                    <p className="text-[11px] text-[#4e4634] mt-1">Require 2FA for every login attempt.</p>
                  </div>
                  <input type="checkbox" checked={enforceMfa} readOnly className="w-5 h-5 rounded text-[#745b00]" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
              <div className="bg-[#fbf3e2] px-8 py-6 border-b border-black/5">
                <h3 className="font-headline font-bold text-lg">Resource Access Matrix</h3>
                <p className="text-[11px] uppercase tracking-widest text-[#4e4634] mt-1">Granular CRUD Operation Map</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#e9e2d1]/30">
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#4e4634]">Module / Resource</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-center text-[#4e4634]">Create</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-center text-[#4e4634]">Read</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-center text-[#4e4634]">Update</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-center text-[#4e4634]">Delete</th>
                      <th className="px-4 py-4 text-[10px] font-bold uppercase text-center text-[#4e4634]">Approve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 relative">
                    {Object.keys(matrix).map((mod) => (
                      <tr key={mod} className="hover:bg-[#fbf3e2]/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-headline font-bold capitalize">{mod}</p>
                        </td>
                        {(["create", "read", "update", "delete", "approve"] as PermissionActions[]).map(act => (
                          <td key={act} className="text-center px-4">
                            <input 
                              type="checkbox" 
                              checked={matrix[mod][act]} 
                              onChange={() => togglePermission(mod, act)}
                              className="w-5 h-5 rounded text-[#745b00] border-[#d1c5ad]" 
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
