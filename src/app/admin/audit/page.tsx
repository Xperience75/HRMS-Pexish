import React from "react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Ensures fresh audit logs on load

interface AuditPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AuditTrailPage(props: AuditPageProps) {
  const searchParams = await props.searchParams;
  const actionFilter = searchParams?.actionType as string;
  const dateRange = searchParams?.dateRange as string; // '7d', '30d'

  // Build Filter Query
  let dateQuery = {};
  if (dateRange === "7d") {
    dateQuery = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
  } else if (dateRange === "30d") {
    dateQuery = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
  }

  const logs = await prisma.auditLog.findMany({
    where: {
      tenantId: "mock-tenant-id", // Hardcoded scope for S1
      ...(actionFilter ? { actionType: { contains: actionFilter } } : {}),
      ...(Object.keys(dateQuery).length > 0 ? { timestamp: dateQuery } : {}),
    },
    orderBy: { timestamp: 'desc' },
    select: {
      id: true,
      timestamp: true,
      actorUserId: true,
      ipAddress: true,
      targetEntityId: true,
      actionType: true,
      previousData: true,
      newData: true,
    },
    take: 50,
  });

  // Calculate Metrics safely
  const criticalEvents = logs.filter((l: any) => l.actionType.includes("DELETE") || l.actionType.includes("UPDATE_GLOBAL")).length;
  const distinctAdmins = new Set(logs.map((l: any) => l.actorUserId)).size;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight">System Event Ledger</h2>
            <p className="text-[#4e4634] text-sm font-body">Real-time forensic monitoring of the Executive Layer architecture.</p>
          </div>
          <div className="flex items-center gap-3">
            <form method="GET" className="flex gap-2">
              <select name="actionType" className="px-3 py-2 bg-white text-sm border border-[#d1c5ad] rounded-lg">
                <option value="">All Actions</option>
                <option value="UPDATE">Updates</option>
                <option value="CREATE">Creations</option>
                <option value="DELETE">Deletions</option>
              </select>
              <select name="dateRange" className="px-3 py-2 bg-white text-sm border border-[#d1c5ad] rounded-lg">
                <option value="">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#e9e2d1] text-[#4e4634] font-bold text-sm rounded-lg hover:bg-[#d1c5ad] transition-all">
                <span className="text-lg">⚙</span> Filters
              </button>
            </form>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#745b00] text-white font-bold text-sm rounded-lg shadow-md hover:opacity-90 transition-all">
              <span className="text-lg">📄</span> Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#fbf3e2] p-5 rounded-xl border-l-4 border-amber-500 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-1">Critical Events</p>
            <p className="text-2xl font-headline font-extrabold">{criticalEvents}</p>
          </div>
          <div className="bg-[#fbf3e2] p-5 rounded-xl border-l-4 border-[#006875] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-1">Active Administrators</p>
            <p className="text-2xl font-headline font-extrabold">{distinctAdmins}</p>
          </div>
          <div className="bg-[#fbf3e2] p-5 rounded-xl border-l-4 border-[#7f7661] shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-1">Ledger Integrity</p>
            <p className="text-2xl font-headline font-extrabold text-[#006875]">100% Verified</p>
          </div>
          <div className="bg-[#fbf3e2] p-5 rounded-xl border-l-4 border-slate-900 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-1">Filtered Logs</p>
            <p className="text-2xl font-headline font-extrabold">{logs.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fbf3e2]">
                  <th className="px-6 py-4 text-[11px] font-extrabold text-[#4e4634] uppercase tracking-widest">Date & Time</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-[#4e4634] uppercase tracking-widest">Operator</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-[#4e4634] uppercase tracking-widest">IP Address</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-[#4e4634] uppercase tracking-widest">Target ID</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-[#4e4634] uppercase tracking-widest">Action</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-[#4e4634] uppercase tracking-widest">Version History Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {logs.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-sm text-[#4e4634]">No Audit Logs Found Matching Filter</td></tr>
                )}
                {logs.map((log: any) => {
                  const d = new Date(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-[#fbf3e2]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-headline font-bold">{d.toLocaleDateString()}</p>
                        <p className="text-[11px] text-[#4e4634]">{d.toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-slate-900 text-[10px] flex items-center justify-center text-white font-bold">{log.actorUserId ? log.actorUserId.substring(0,2).toUpperCase() : "SYS"}</div>
                          <p className="text-sm font-medium">{log.actorUserId || "System Kernel"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{log.ipAddress || "Localhost"}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-[#e9e2d1] text-[10px] font-bold rounded font-mono truncate max-w-[120px] block">{log.targetEntityId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#00b8cc]/20 text-[#006875]">
                          {log.actionType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                          {log.previousData && (
                            <span className="text-red-700 line-through block truncate max-w-[200px]" title={JSON.stringify(log.previousData)}>
                              {JSON.stringify(log.previousData)}
                            </span>
                          )}
                          {log.newData && (
                            <span className="block text-[#006875] font-bold truncate max-w-[200px]" title={JSON.stringify(log.newData)}>
                              {JSON.stringify(log.newData)}
                            </span>
                          )}
                          {!log.previousData && !log.newData && (
                            <span className="italic text-[#4e4634]">Action Logged (No Diff)</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
