"use client";

import React from 'react';
import Link from 'next/link';

export default function SecurityRoleManagementPage() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#1e1b11] font-headline">Role Management</h2>
          <p className="text-[#4e4634] max-w-xl">Configure access tiers, operational permissions, and visibility rules across the Architectural Ledger ecosystem.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/audit" className="px-5 py-2.5 bg-[#e2e2e2] text-[#646464] font-bold text-sm rounded-lg hover:bg-[#e9e2d1] transition-colors flex items-center gap-2 active:scale-95">
            <span className="material-symbols-outlined text-[18px]">history</span>
            Master Audit Log
          </Link>
          <Link href="/admin/roles/create" className="px-5 py-2.5 bg-[#745b00] text-white font-bold text-sm rounded-lg shadow-lg shadow-[#745b00]/20 hover:bg-[#cca200] transition-all flex items-center gap-2 active:scale-95">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create New Role
          </Link>
        </div>
      </div>

      {/* Dashboard Grid (Tonal Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-[#fbf3e2] p-6 rounded-xl border border-[#d1c5ad]/10">
          <p className="text-xs font-bold text-[#4e4634] uppercase tracking-widest mb-2">Total System Roles</p>
          <h3 className="text-3xl font-extrabold text-[#1e1b11]">12</h3>
          <div className="mt-4 flex items-center gap-2 text-[#006875] text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            +2 since last audit
          </div>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-[#fbf3e2] p-6 rounded-xl border border-[#d1c5ad]/10">
          <p className="text-xs font-bold text-[#4e4634] uppercase tracking-widest mb-2">Global Privileges</p>
          <h3 className="text-3xl font-extrabold text-[#1e1b11]">158</h3>
          <div className="mt-4 flex items-center gap-2 text-[#4e4634] text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            Fully synchronized
          </div>
        </div>
        {/* Quick Filter / Action */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl flex items-center justify-between overflow-hidden relative">
          <div className="z-10">
            <p className="text-xs font-bold text-amber-500/80 uppercase tracking-widest mb-2">Security Perimeter</p>
            <h3 className="text-xl font-bold text-white mb-2">MFA Enforcement: Active</h3>
            <p className="text-slate-400 text-sm">98% compliance across all active roles.</p>
          </div>
          <span className="material-symbols-outlined text-[120px] absolute -right-4 -bottom-4 opacity-10 text-white">lock</span>
          <button className="z-10 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">
            View Report
          </button>
        </div>
      </div>

      {/* Active System Roles Table */}
      <section className="bg-white rounded-xl shadow-sm border border-[#d1c5ad]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#efe8d7] flex items-center justify-between">
          <h3 className="font-bold text-[#1e1b11]">Active System Roles</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e4634] text-[18px]">search</span>
              <input className="pl-10 pr-4 py-1.5 text-sm bg-[#f5eddc] border-none rounded-lg focus:ring-2 focus:ring-[#cca200] w-64" placeholder="Search roles..." type="text" />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbf3e2]">
                <th className="px-6 py-4 text-xs font-bold text-[#4e4634] uppercase tracking-widest">Role Name</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4e4634] uppercase tracking-widest">Permission Summary</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4e4634] uppercase tracking-widest">Status &amp; Assignment</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4e4634] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe8d7]">
              {/* Row 1 */}
              <tr className="hover:bg-[#fbf3e2]/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#745b00]/10 flex items-center justify-center text-[#745b00] font-bold text-xs">AD</div>
                    <span className="font-bold text-[#1e1b11]">Admin</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-[#00b8cc] text-[#004f58] text-[10px] font-bold rounded uppercase">Full Access</span>
                    <span className="px-2 py-0.5 bg-[#f5eddc] text-[#4e4634] text-[10px] font-bold rounded uppercase">Root Config</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#006875]"></span>
                      <span className="text-sm font-medium text-[#1e1b11]">Active</span>
                    </div>
                    <span className="text-xs text-[#4e4634] font-medium">3 Users Assigned</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-[#4e4634] hover:text-[#745b00] hover:bg-[#745b00]/5 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="bg-[#fbf3e2]/30 hover:bg-[#fbf3e2]/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#e2e2e2] flex items-center justify-center text-[#646464] font-bold text-xs">HM</div>
                    <span className="font-bold text-[#1e1b11]">HR Manager</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-[#f5eddc] text-[#4e4634] text-[10px] font-bold rounded uppercase">Read-Only Payroll</span>
                    <span className="px-2 py-0.5 bg-[#f5eddc] text-[#4e4634] text-[10px] font-bold rounded uppercase">Write ATS</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#006875]"></span>
                      <span className="text-sm font-medium text-[#1e1b11]">Active</span>
                    </div>
                    <span className="text-xs text-[#4e4634] font-medium">12 Users Assigned</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-[#4e4634] hover:text-[#745b00] hover:bg-[#745b00]/5 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-[#fbf3e2]/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#e2e2e2] flex items-center justify-center text-[#646464] font-bold text-xs">SU</div>
                    <span className="font-bold text-[#1e1b11]">Standard User</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-[#f5eddc] text-[#4e4634] text-[10px] font-bold rounded uppercase">Self Service</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#006875]"></span>
                      <span className="text-sm font-medium text-[#1e1b11]">Active</span>
                    </div>
                    <span className="text-xs text-[#4e4634] font-medium">1,402 Users Assigned</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-[#4e4634] hover:text-[#745b00] hover:bg-[#745b00]/5 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="bg-[#fbf3e2]/30 hover:bg-[#fbf3e2]/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#e2e2e2] flex items-center justify-center text-[#646464] font-bold text-xs">AS</div>
                    <span className="font-bold text-[#1e1b11]">ATS Specialist</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-[#f5eddc] text-[#4e4634] text-[10px] font-bold rounded uppercase">Candidate Mgmt</span>
                    <span className="px-2 py-0.5 bg-[#f5eddc] text-[#4e4634] text-[10px] font-bold rounded uppercase">Interviews</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#5e5e5e]"></span>
                      <span className="text-sm font-medium text-[#4e4634]">Maintenance</span>
                    </div>
                    <span className="text-xs text-[#4e4634] font-medium">8 Users Assigned</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 text-[#4e4634] hover:text-[#745b00] hover:bg-[#745b00]/5 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-[#fbf3e2] flex items-center justify-between text-xs font-bold text-[#4e4634] uppercase tracking-widest">
          <span>Showing 4 of 12 system roles</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-[#745b00] flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">arrow_back</span> Prev</button>
            <button className="hover:text-[#745b00] flex items-center gap-1">Next <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
          </div>
        </div>
      </section>
    </div>
  );
}
