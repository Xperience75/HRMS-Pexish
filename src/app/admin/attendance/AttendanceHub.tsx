"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AttendanceHub({ initialEmployees, branches }: { initialEmployees: any[], branches: any[] }) {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [branchId, setBranchId] = useState("");
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter employees
  const employees = initialEmployees.filter((emp: any) => 
    branchId ? emp.User?.branchId === branchId : true
  );

  const handleStatusChange = (employeeId: string, status: string) => {
    setStatuses(prev => ({ ...prev, [employeeId]: status }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const realPayload = employees.map((emp: any) => ({
        employeeId: emp.id,
        status: statuses[emp.id] || "PRESENT"
      }));

      const res = await fetch("/api/attendance/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: "mock-tenant-id",
          date: new Date(date).toISOString(),
          records: realPayload
        })
      });

      if (!res.ok) {
        let errStr = "Server Timeout or Connection Error";
        try {
          const errData = await res.json();
          if (errData.error) errStr = errData.error;
        } catch (_) {}
        throw new Error(errStr);
      }

      alert("Roster Locked Successfully - Payroll Engine Synced.");
      router.refresh();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = employees.length;
  // Compute counts based on realPayload logic
  let present = 0; let auth = 0; let unauth = 0;
  employees.forEach((emp: any) => {
    const s = statuses[emp.id] || "PRESENT";
    if (s === "PRESENT") present++;
    if (s === "ABSENT_AUTHORIZED") auth++;
    if (s === "ABSENT_UNAUTHORIZED") unauth++;
  });

  return (
    <div className="w-full flex flex-col gap-6 relative" style={{ height: 'calc(100vh - 120px)' }}> 
       {/* Context Bar */}
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
         <h1 className="font-['Manrope'] font-extrabold text-[#0f172a] text-2xl tracking-tight">Site Attendance & Time-Keeping</h1>
         <div className="flex items-center gap-4">
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="bg-slate-50 border border-slate-300 focus:border-[#0f172a] focus:ring-0 rounded-lg px-4 py-2 text-sm text-[#0f172a] font-medium transition-colors"
            />
            <select 
              value={branchId} 
              onChange={e => setBranchId(e.target.value)} 
              className="bg-slate-50 border border-slate-300 focus:border-[#0f172a] focus:ring-0 rounded-lg px-4 py-2 text-sm text-[#0f172a] font-medium transition-colors"
            >
              <option value="">All Branches</option>
              {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
         </div>
       </div>

       {/* Core Work Canvas (High-Density Table) */}
       <div className="flex-1 overflow-auto bg-white rounded-xl border border-slate-200 shadow-sm relative">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-slate-200 shadow-sm">
               <tr>
                 <th className="py-3 px-6 font-['Inter'] text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Employee ID</th>
                 <th className="py-3 px-6 font-['Inter'] text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Full Name</th>
                 <th className="py-3 px-6 font-['Inter'] text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Designation / Role</th>
                 <th className="py-3 px-6 font-['Inter'] text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Attendance Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm font-medium text-slate-400">No employees assigned to this location.</td>
                </tr>
              ) : null}
              {employees.map((emp: any, idx: number) => {
                const s = statuses[emp.id] || "PRESENT";
                return (
                  <tr key={emp.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-slate-100 transition-colors`}>
                    <td className="py-2.5 px-6 font-semibold text-xs text-slate-700 font-['Inter']">EMP-{emp.id.substring(0,6).toUpperCase()}</td>
                    <td className="py-2.5 px-6 text-sm text-[#0f172a] font-extrabold font-['Manrope']">{emp.firstName} {emp.lastName}</td>
                    <td className="py-2.5 px-6 text-xs text-slate-600 font-medium">{emp.User?.Role?.name || "Unassigned"}</td>
                    <td className="py-2.5 px-6">
                      <div className="flex gap-1.5 items-center">
                        <button onClick={() => handleStatusChange(emp.id, "PRESENT")} 
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${s === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 shadow-sm border border-emerald-200/50' : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
                          Present
                        </button>
                        <button onClick={() => handleStatusChange(emp.id, "ABSENT_AUTHORIZED")} 
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${s === 'ABSENT_AUTHORIZED' ? 'bg-slate-200 text-slate-800 shadow-sm border border-slate-300' : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
                          Absent - Auth
                        </button>
                        <button onClick={() => handleStatusChange(emp.id, "ABSENT_UNAUTHORIZED")} 
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${s === 'ABSENT_UNAUTHORIZED' ? 'bg-red-100 text-red-800 shadow-sm border border-red-200' : 'bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
                          Absent - Unauth
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
       </div>

       {/* Sticky Action Footer */}
       <div className="bg-[#0f172a] h-[72px] shrink-0 rounded-xl shadow-2xl flex items-center justify-between px-6 border border-slate-700/50 z-20">
          <div className="text-white font-['Inter'] text-xs font-bold flex items-center gap-5">
             <span className="opacity-90 tracking-wide uppercase">Total Employees: <span className="font-black text-sm ml-1">{total}</span></span>
             <div className="w-px h-4 bg-slate-600"></div>
             <span className="text-emerald-400 tracking-wide uppercase">Present: <span className="font-black text-sm ml-1">{present}</span></span>
             <div className="w-px h-4 bg-slate-600"></div>
             <span className="text-slate-300 tracking-wide uppercase">Absent (Auth): <span className="font-black text-sm ml-1">{auth}</span></span>
             <div className="w-px h-4 bg-slate-600"></div>
             <span className="text-red-400 tracking-wide uppercase">Absent (Unauth): <span className="font-black text-sm ml-1">{unauth}</span></span>
          </div>
          <button 
             onClick={handleSubmit} 
             disabled={isSubmitting}
             className="bg-[#36b37e] hover:bg-[#2e9c6d] text-white px-8 py-3 rounded-lg font-['Manrope'] font-extrabold text-sm tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            {isSubmitting ? "LOCKING ROSTER..." : "SUBMIT & LOCK ROSTER"}
          </button>
       </div>
    </div>
  )
}
