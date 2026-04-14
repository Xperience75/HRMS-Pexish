import { prisma } from "@/lib/prisma";
import { calculatePayroll } from "@/lib/payroll/engine";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function PayrollPage() {
  const defaultTenant = await prisma.tenant.findFirst();
  let payrollData: any[] = [];
  
  if (defaultTenant) {
    payrollData = await calculatePayroll(defaultTenant.id, new Date());
  }

  // fallback data if DB empty
  if (payrollData.length === 0) {
    payrollData = [
      {
        employeeId: "EMP-001",
        employeeName: "Aliyu Musa",
        metrics: { dailyRate: 15909.09, unauthorizedAbsenceCount: 0 },
        payout: { grossSalary: 350000, absentDeductions: 0, payeTax: 24500.50, advancesRepaid: 50000, finalNetPay: 275499.50 }
      },
      {
        employeeId: "EMP-002",
        employeeName: "Ngozi Okafor",
        metrics: { dailyRate: 11363.63, unauthorizedAbsenceCount: 1 },
        payout: { grossSalary: 250000, absentDeductions: 11363.63, payeTax: 12400.00, advancesRepaid: 0, finalNetPay: 226236.37 }
      }
    ];
  }

  const totalDisbursement = payrollData.reduce((acc, r) => acc + r.payout.finalNetPay, 0);
  const activeHeadcount = payrollData.length;
  const totalTax = payrollData.reduce((acc, r) => acc + r.payout.payeTax, 0);
  const pendingDeductions = payrollData.reduce((acc, r) => acc + r.payout.absentDeductions, 0);

  return (
    <div className="w-full container mx-auto p-8 text-slate-900 bg-[#FAFAFA] min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
         <div>
           <div className="text-xs font-semibold text-slate-400 tracking-wider mb-1">ADMIN &gt; PAYROLL</div>
           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Master Payroll Disbursement</h1>
         </div>
         <div className="flex gap-4">
           {/* Select Month / Branch - Visual placeholders */}
           <select className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
             <option>March 2026</option>
           </select>
           <select className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
             <option>All Branches</option>
           </select>
           
           <Link href="/admin/advances" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm font-medium flex items-center gap-2">
             <span>💸</span> Manage Salary Advances
           </Link>
           <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition shadow-sm font-medium flex items-center gap-2">
             <span>🔒</span> EXPORT FINANCE LEDGER
           </button>
           <button className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-amber-300 rounded-lg transition shadow-md font-bold flex items-center gap-2 border border-blue-600">
             <span>▶</span> RUN PAYROLL CYCLE
           </button>
         </div>
      </div>

      {/* Grid 4 Widgets */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Disbursement</h3>
           <p className="text-3xl font-black text-slate-800">₦{totalDisbursement.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Active Headcount</h3>
           <p className="text-3xl font-black text-slate-800">{activeHeadcount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Tax Liability</h3>
           <p className="text-3xl font-black text-slate-800">₦{totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Deductions</h3>
           <p className="text-3xl font-black text-red-600">₦{pendingDeductions.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Table */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider border-b border-slate-200">
              <th className="p-5 font-bold">EMPLOYEE NAME & ID</th>
              <th className="p-5 font-bold text-right">GROSS (₦)</th>
              <th className="p-5 font-bold text-right">DAILY RATE (₦)</th>
              <th className="p-5 font-bold text-center">ABSENT DAYS</th>
              <th className="p-5 font-bold text-right">DEDUCTIONS (₦)</th>
              <th className="p-5 font-bold text-right">PAYE TAX (₦)</th>
              <th className="p-5 font-bold text-right">ADV. RECOVERY (₦)</th>
              <th className="p-5 font-bold text-right">NET PAY (₦)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {payrollData.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-slate-800 text-sm mb-0.5">{r.employeeName}</div>
                    <div className="text-xs text-slate-400 font-mono">{String(r.employeeId).substring(0, 8).toUpperCase()}</div>
                  </td>
                  <td className="p-5 text-right font-semibold text-slate-700">{r.payout.grossSalary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="p-5 text-right text-slate-500 text-sm md:font-mono">{r.metrics.dailyRate.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="p-5 text-center text-slate-600 font-semibold">{r.metrics.unauthorizedAbsenceCount}</td>
                  <td className="p-5 text-right text-red-500 font-bold">{r.payout.absentDeductions > 0 ? `-${r.payout.absentDeductions.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "0.00"}</td>
                  <td className="p-5 text-right text-slate-600 font-medium">{r.payout.payeTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="p-5 text-right text-amber-500 font-bold">{r.payout.advancesRepaid > 0 ? `-${r.payout.advancesRepaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "0.00"}</td>
                  <td className="p-5 text-right font-black text-green-600 text-lg tracking-tight">{r.payout.finalNetPay.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
             ))}
          </tbody>
        </table>
       </div>
    </div>
  );
}
