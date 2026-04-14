import React from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";
export default async function SuperAdminDashboard() {
  const tenantId = "mock-tenant-id";

  // TARGET 1: The Queries - Five distinct Prisma aggregations
  const totalHeadcount = await prisma.employee.count({
    where: { tenantId }
  });

  const activeBranches = await prisma.branch.count({
    where: { tenantId }
  });

  const pendingAdvances = await prisma.advanceRequest.count({
    where: { tenantId, status: "PENDING" }
  });

  const unauthAbsences = await prisma.attendanceRecord.count({
    where: { tenantId, status: "ABSENT_UNAUTHORIZED" }
  });

  const auditFeed = await prisma.auditLog.findMany({
    where: { tenantId },
    orderBy: { timestamp: 'desc' },
    take: 5,
    include: { User: true }
  });

  const branchesList = await prisma.branch.findMany({
    where: { tenantId },
    include: {
      _count: {
        select: { User: true }
      }
    }
  });

  return (
    <div className="w-full space-y-6">
      {/* 1. Global Command Palette & Filters */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-slate-900 tracking-tight">Super Admin Master Dashboard</h2>
          <p className="text-slate-500 font-body text-sm mt-1">Institutional Oversight & Real-time Resource Allocation</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-body text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-sm">file_download</span> Export Ledger
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary font-body text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">add</span> New Entry
          </button>
        </div>
      </div>

      {/* Top-Level Key Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Headcount */}
        <div className="bg-surface-container-lowest p-6 flex flex-col justify-between group cursor-default shadow-sm border-l-4 border-slate-900 transition-all hover:translate-y-[-2px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-slate-400">Total Headcount</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-900 transition-colors">groups</span>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-headline font-extrabold text-slate-900">{totalHeadcount.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-[10px] font-bold">Live Value</span>
            </div>
          </div>
        </div>
        {/* Branches */}
        <div className="bg-surface-container-lowest p-6 flex flex-col justify-between group cursor-default shadow-sm border-l-4 border-amber-600 transition-all hover:translate-y-[-2px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-slate-400">Active Branches</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-amber-600 transition-colors">domain</span>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-headline font-extrabold text-slate-900">{activeBranches.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-slate-500">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-[10px] font-bold">Tracked via Hub</span>
            </div>
          </div>
        </div>
        {/* Advances Pending */}
        <div className="bg-surface-container-lowest p-6 flex flex-col justify-between group cursor-default shadow-sm border-l-4 border-slate-900 transition-all hover:translate-y-[-2px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-slate-400">Advances Pending Approval</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-900 transition-colors">account_balance_wallet</span>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-headline font-extrabold text-slate-900">{pendingAdvances.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1 text-error">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="text-[10px] font-bold">Requires Attention</span>
            </div>
          </div>
        </div>
        {/* Warnings */}
        <div className="bg-surface-container-lowest p-6 flex flex-col justify-between group cursor-default shadow-sm border-l-4 border-slate-900 transition-all hover:translate-y-[-2px]">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-slate-400">Active Warnings</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-error transition-colors">warning</span>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-headline font-extrabold text-slate-900">{unauthAbsences.toString().padStart(2, '0')}</div>
            <div className="flex items-center gap-1 mt-1 text-slate-500">
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span className="text-[10px] font-bold">Unauthorized Absences</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ledger Section (Bento Layout) */}
      <div className="grid grid-cols-12 gap-8">
        {/* Domino-Execution Activity Feed */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-6 rounded-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline font-extrabold text-slate-900 text-sm uppercase tracking-widest">Domino-Execution</h3>
            <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-bold uppercase">Automated</span>
          </div>
          <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-300">
            {auditFeed.length > 0 ? (
                auditFeed.map((audit, index) => {
                    const bgColors = ["bg-tertiary-container", "bg-amber-500", "bg-slate-900", "bg-error"];
                    const icons = ["check", "sync", "lock", "priority_high"];
                    const colorClass = bgColors[index % bgColors.length];
                    const iconName = icons[index % icons.length];
                    
                    return (
                        <div key={audit.id} className="relative pl-8 group">
                            <div className={`absolute left-0 top-1 w-[22px] h-[22px] rounded-full flex items-center justify-center ring-4 ring-surface-container-low z-10 ${colorClass}`}>
                                <span className="material-symbols-outlined text-[12px] text-white">{iconName}</span>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-900 font-body leading-none">{audit.actionType}</p>
                                <p className="text-xs text-slate-600 mt-1 truncate">Operator: {audit.User?.email || "System"} — Target: {audit.targetEntityId.substring(0,8)}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="px-1.5 py-0.5 bg-surface-container-highest text-[9px] font-bold text-slate-500">{new Date(audit.timestamp).toLocaleTimeString()}</div>
                                    <span className="material-symbols-outlined text-[10px] text-slate-400">arrow_forward</span>
                                    <div className="px-1.5 py-0.5 bg-tertiary-fixed text-[9px] font-bold text-tertiary">Logged</div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="pl-8 pt-2">
                    <p className="text-xs text-slate-500 italic">No historical actions logged in vault.</p>
                </div>
            )}
          </div>
        </div>

        {/* High Density Data Table */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-headline font-extrabold text-slate-900 text-sm uppercase tracking-widest">Regional Branch Performance</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-surface-container-low text-[10px] font-bold text-slate-500">Period: Q4 2023</span>
              <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-900">filter_list</span>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Branch ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Headcount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {branchesList.map((branch, index) => (
                    <tr key={branch.id} className={index % 2 === 0 ? "hover:bg-slate-50/50 transition-colors" : "bg-surface-container-low/30 hover:bg-slate-50/50 transition-colors"}>
                        <td className="px-6 py-4 font-body text-xs font-bold text-slate-900">
                            {branch.id.includes('-') && branch.id.length > 10 ? `BR-${branch.id.split('-').pop()?.substring(0, 4).toUpperCase()}` : branch.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900">{branch.name}</span>
                            <span className="text-[10px] text-slate-400">{branch.location}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">{branch._count.User.toLocaleString()}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-sm bg-tertiary-container text-on-tertiary-fixed-variant text-[10px] font-bold">OPTIMAL</span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs font-bold text-tertiary">100.0%</td>
                    </tr>
                ))}
                {branchesList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-xs text-slate-500 italic">No branch data available within parameters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Viewing {branchesList.length} records</p>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined">chevron_left</span></button>
              <button className="w-8 h-8 flex items-center justify-center text-white bg-slate-900 font-bold text-xs rounded-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>

      {/* Contextual Analysis Layer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-sm text-white">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Capital Allocation</h4>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-headline font-extrabold">$24.8M</div>
            <div className="text-xs font-bold text-amber-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span> 12%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-slate-800">
            <div className="h-full bg-amber-500 w-[72%]"></div>
          </div>
          <p className="text-[10px] mt-2 text-slate-500">Threshold: $34.5M Max</p>
        </div>
        <div className="bg-surface-container-high p-6 rounded-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Compliance Score</h4>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-headline font-extrabold text-slate-900">99.4%</div>
            <div className="text-xs font-bold text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified_user</span> SECURED
            </div>
          </div>
          <div className="mt-4 flex gap-1">
            <div className="h-2 w-full bg-tertiary/20 rounded-full overflow-hidden">
              <div className="h-full bg-tertiary w-[99.4%]"></div>
            </div>
          </div>
          <p className="text-[10px] mt-2 text-slate-400">Audit Status: Passive Surveillance</p>
        </div>
        <div className="bg-surface-container-highest p-6 rounded-sm">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">System Integrity</h4>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-headline font-extrabold text-slate-900">OPERATIONAL</div>
            <div className="text-xs font-bold text-tertiary flex items-center gap-1">
              9ms latency
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 flex gap-1">
              <div className="h-4 w-1 bg-tertiary"></div>
              <div className="h-4 w-1 bg-tertiary"></div>
              <div className="h-4 w-1 bg-tertiary"></div>
              <div className="h-4 w-1 bg-tertiary"></div>
              <div className="h-4 w-1 bg-tertiary/20"></div>
              <div className="h-4 w-1 bg-tertiary"></div>
              <div className="h-4 w-1 bg-tertiary"></div>
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase">Load: 12%</span>
          </div>
          <p className="text-[10px] mt-2 text-slate-400">Node: Primary-DC-VA</p>
        </div>
      </div>
    </div>
  );
}
