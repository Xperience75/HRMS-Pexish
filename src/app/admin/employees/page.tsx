import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EmployeeMasterPage() {
  const currentTenantId = "mock-tenant-id";

  // Database Query: Multi-Tenant Active Roster
  const employees = await prisma.employee.findMany({
    where: { tenantId: currentTenantId },
    include: {
      User: {
        include: {
          Role: true,
          Branch: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Target 1 Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Manrope'] font-extrabold text-[#1e1b11] text-3xl tracking-tight">Employee Master</h1>
          <p className="font-body text-[#4e4634] text-sm mt-1">Institutional workforce repository and active roster</p>
        </div>
        <Link 
          href="/admin/employees/new" 
          className="bg-[#006875] hover:bg-[#004f58] text-white px-6 py-3 rounded-lg font-headline font-bold text-sm tracking-widest shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
          NEW EMPLOYEE
        </Link>
      </div>

      {/* Target 1 Search & Filter Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-[#d1c5ad]/30 p-4 flex gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-3 text-[#7f7661]">search</span>
          <input 
            type="text" 
            placeholder="Search by Employee ID, Name, or NIN..." 
            className="w-full bg-[#fbf3e2] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg pl-12 pr-4 py-3 text-sm text-[#1e1b11] font-medium"
          />
        </div>
        <div className="w-64 relative">
          <span className="material-symbols-outlined absolute left-4 top-3 text-[#7f7661]">domain</span>
          <select className="w-full bg-[#fbf3e2] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg pl-12 pr-4 py-3 text-sm text-[#1e1b11] font-medium appearance-none">
            <option value="">Filter by Branch</option>
            <option value="hq">Headquarters (Lagos)</option>
            <option value="abuja">Abuja Branch</option>
            <option value="remote">Remote</option>
          </select>
        </div>
        <button className="bg-[#efe8d7] hover:bg-[#e9e2d1] text-[#745b00] px-6 py-3 rounded-lg font-bold font-headline text-sm border border-[#d1c5ad] transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">filter_alt</span>
          Filters
        </button>
      </div>

      {/* Target 1 Enterprise Data Table */}
      <div className="bg-white shadow-sm border border-[#d1c5ad]/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f5eddc] border-b border-[#d1c5ad]">
              <th className="py-4 px-6 font-label text-[10px] font-black uppercase text-[#4e4634] tracking-wider">Employee ID</th>
              <th className="py-4 px-6 font-label text-[10px] font-black uppercase text-[#4e4634] tracking-wider">Full Name</th>
              <th className="py-4 px-6 font-label text-[10px] font-black uppercase text-[#4e4634] tracking-wider">Designation / Role</th>
              <th className="py-4 px-6 font-label text-[10px] font-black uppercase text-[#4e4634] tracking-wider">Branch / Location</th>
              <th className="py-4 px-6 font-label text-[10px] font-black uppercase text-[#4e4634] tracking-wider text-center">Status</th>
              <th className="py-4 px-6 font-label text-[10px] font-black uppercase text-[#4e4634] tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d1c5ad]/30 bg-white">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#7f7661] font-medium text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-4xl opacity-50">group_off</span>
                    No personnel records found in root database.
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                // Determine mock role/branch status based on relations
                const designation = emp.User?.Role?.name || "Unassigned";
                const location = emp.User?.Branch?.name || "Corporate HQ";
                const isSuspended = emp.guarantorVerified === false; // Example hook
                
                return (
                  <tr key={emp.id} className="hover:bg-[#fbf3e2] transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold text-[#745b00]">
                        EMP-{emp.id.substring(0,6).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#006875] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-headline font-bold text-sm text-[#1e1b11]">{emp.firstName} {emp.lastName}</p>
                          <p className="font-body text-[10px] text-[#4e4634] truncate max-w-[150px]">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[#1e1b11] font-semibold">{designation}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-sm text-[#4e4634]">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {location}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1 bg-[#fff3cd] text-[#856404] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#ffeeba]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#856404]"></div>
                          VETTING PENDING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-[#d4edda] text-[#155724] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#c3e6cb]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#155724]"></div>
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link 
                        href={`/admin/employees/${emp.id}`}
                        className="inline-flex items-center gap-1.5 bg-[#efe8d7] hover:bg-[#e9e2d1] text-[#745b00] px-3 py-1.5 rounded-md font-bold text-xs transition-colors border border-[#d1c5ad]"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        View Profile
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center w-full mt-4 p-4 border-t border-slate-800 text-slate-400 text-sm">
        <div>Rows per page: 50</div>
        <div>&lt; Prev 1 of 42 Next &gt;</div>
      </div>

    </div>
  );
}
