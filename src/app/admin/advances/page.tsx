"use client";

import { useState } from 'react';

export default function AdvancesPage() {
  const employees = [
    { id: "1", name: "Aliyu Musa", gross: 350000, guarantorVerified: true },
    { id: "2", name: "Ngozi Okafor", gross: 250000, guarantorVerified: false },
    { id: "3", name: "Tunde Bakare", gross: 400000, guarantorVerified: true },
  ];

  const [advances, setAdvances] = useState([
    { id: "ADV-001", empName: "Aliyu Musa", date: "2026-03-05", amount: 50000, guarantorVerified: true, status: "PENDING" },
    { id: "ADV-002", empName: "Ngozi Okafor", date: "2026-03-10", amount: 120000, guarantorVerified: false, status: "REJECTED" },
    { id: "ADV-003", empName: "Tunde Bakare", date: "2026-03-25", amount: 100000, guarantorVerified: true, status: "APPROVED" },
  ]);

  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRequestSubmit = () => {
    setErrorMsg("");
    if (!selectedEmpId || !amount) {
      setErrorMsg("Please fill all fields");
      return;
    }

    const emp = employees.find(e => e.id === selectedEmpId);
    if (!emp) return;

    if (!emp.guarantorVerified) {
      setErrorMsg("Guarantor verification required");
      return;
    }

    const requestedAmount = parseFloat(amount || "0");
    const maxAllowed = emp.gross * 0.30;

    if (requestedAmount > maxAllowed) {
      setErrorMsg(`Maximum limit is 30% of Gross (Max: ₦${maxAllowed.toLocaleString()})`);
      return;
    }

    const newAdvance = {
      id: `ADV-00${advances.length + 1}`,
      empName: emp.name,
      date: new Date().toISOString().split('T')[0],
      amount: requestedAmount,
      guarantorVerified: emp.guarantorVerified,
      status: "PENDING"
    };
    
    setAdvances([newAdvance, ...advances]);
    setSelectedEmpId("");
    setAmount("");
    alert("Request processing verified and successfully appended.");
  };

  const totalRequested = advances.reduce((acc, a) => acc + a.amount, 0);
  const pendingDisbursal = advances.filter(a => a.status === 'APPROVED').reduce((acc, a) => acc + a.amount, 0);
  const highRiskCount = advances.filter(a => !a.guarantorVerified || a.amount > 100000).length;

  return (
    <div className="w-full flex flex-col gap-6 bg-[#FAFAFA] text-slate-900">
       <div className="mb-8 border-b border-slate-200 pb-4">
         <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Financial Liquidity Control</h1>
         <p className="text-slate-500 font-medium">Real-time salary advance monitoring & disbursement matrices.</p>
       </div>

       {/* Grid 3 Widgets */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-600">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Advances Requested</h3>
             <p className="text-3xl font-black text-slate-800">₦{totalRequested.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Pending Disbursal</h3>
             <p className="text-3xl font-black text-slate-800">₦{pendingDisbursal.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-red-600">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">High-Risk Limits</h3>
             <p className="text-3xl font-black text-slate-800 flex items-center gap-2">
                 {highRiskCount} <span className="text-sm font-semibold text-red-500 mt-2 tracking-normal uppercase">&gt; 30% Warnings</span>
             </p>
          </div>
       </div>

       {/* 75/25 Split Layout */}
       <div className="grid grid-cols-12 gap-8 items-start">
         
         {/* 75% Left Pane: The Matrix */}
         <div className="col-span-12 xl:col-span-9 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
               <h2 className="font-bold text-slate-800">Advance Requests Matrix</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase text-slate-400 tracking-wider border-b border-slate-100">
                    <th className="p-5 font-bold">Employee</th>
                    <th className="p-5 font-bold">Requested (₦)</th>
                    <th className="p-5 font-bold">Date</th>
                    <th className="p-5 font-bold text-center">Guarantor Status</th>
                    <th className="p-5 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {advances.map(adv => (
                    <tr key={adv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-bold text-sm text-slate-800">{adv.empName}</td>
                      <td className="p-5 font-black text-slate-700">₦{adv.amount.toLocaleString()}</td>
                      <td className="p-5 text-sm text-slate-500 font-medium">{adv.date}</td>
                      <td className="p-5 text-center">
                        {adv.guarantorVerified ? (
                           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                              ✓ VERIFIED
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-200">
                              ✕ FAILED
                           </span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                         <div className="flex justify-center gap-2">
                            <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold rounded text-xs transition border border-blue-200">Approve</button>
                            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded text-xs transition border border-slate-200">Reject</button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
         
         {/* 25% Right Pane: Sticky Initiation Module */}
         <div className="col-span-12 xl:col-span-3 sticky top-8">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
               <h2 className="text-lg font-extrabold text-slate-800 mb-6">Initiate Salary Advance</h2>
               
               {errorMsg && (
                 <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-md shadow-sm">
                   {errorMsg}
                 </div>
               )}

               <div className="mb-5">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Search Employee</label>
                 <select 
                   value={selectedEmpId} 
                   onChange={(e) => setSelectedEmpId(e.target.value)}
                   className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition"
                 >
                   <option value="">Select an employee...</option>
                   {employees.map(e => (
                     <option key={e.id} value={e.id}>{e.name} (Gross: ₦{e.gross.toLocaleString()})</option>
                   ))}
                 </select>
               </div>

               <div className="mb-6">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Amount (₦)</label>
                 <input 
                   type="number" 
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-black focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition placeholder-slate-400"
                   placeholder="0.00"
                 />
                 <div className="mt-2 text-xs font-bold text-amber-600 flex items-center gap-1.5 bg-amber-50 p-2 rounded border border-amber-200">
                    <span className="text-amber-500">⚠️</span> Locked Warning: Maximum limit 30% of Gross
                 </div>
               </div>

               <button 
                 onClick={handleRequestSubmit}
                 className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition shadow-md font-extrabold text-sm uppercase tracking-wider"
               >
                 Submit Entry
               </button>
            </div>
         </div>

       </div>
    </div>
  );
}
