"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { updateTaxRelief } from "./actions";

export default function VaultClient({ employee }: { employee: any }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isPending, startTransition] = useTransition();

  const [pensionRelief, setPensionRelief] = useState(employee.applyPensionRelief ?? true);
  const [rentRelief, setRentRelief] = useState(employee.applyRentRelief ?? true);

  // Sync state if employee prop updates from server revalidation
  useEffect(() => {
    setPensionRelief(employee.applyPensionRelief ?? true);
    setRentRelief(employee.applyRentRelief ?? true);
  }, [employee]);

  const handleToggle = (type: 'pension' | 'rent') => {
    const nextPension = type === 'pension' ? !pensionRelief : pensionRelief;
    const nextRent = type === 'rent' ? !rentRelief : rentRelief;
    
    if (type === 'pension') setPensionRelief(nextPension);
    if (type === 'rent') setRentRelief(nextRent);

    startTransition(async () => {
      try {
        await updateTaxRelief(employee.id, nextPension, nextRent);
      } catch (err) {
        alert("Failed to sync tax controls to database.");
        // Revert UI conservatively
        setPensionRelief(pensionRelief);
        setRentRelief(rentRelief);
      }
    });
  };

  const tabs = [
    { id: "personal", label: "Personal & Contact", icon: "person" },
    { id: "history", label: "Qualifications & History", icon: "school" },
    { id: "medical", label: "Medical & Safety", icon: "health_and_safety" },
    { id: "financial", label: "Financial & Compliance", icon: "account_balance" },
    { id: "assets", label: "Assets & Contracts", icon: "computer" }
  ];

  return (
    <div className="w-full container mx-auto p-4 md:p-8 bg-[#FAFAFA] min-h-screen text-slate-900 font-sans">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Link href="/admin/employees" className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 transition shrink-0">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
        </Link>
        <div>
          <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">360° Employee Vault</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{employee.firstName} {employee.lastName}</h1>
        </div>
        <div className="md:ml-auto flex items-center gap-3">
          <button className="w-full md:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition shadow-md font-bold flex items-center justify-center gap-2">
            <span>🪪</span> Generate ID Card
          </button>
        </div>
      </div>

      {/* Main Grid: 75/25 Layout */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column (Main Content) */}
        <div className="col-span-12 xl:col-span-9 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <span className="material-symbols-outlined text-5xl text-slate-300">person</span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">{employee.firstName} {employee.lastName}</h2>
                <div className="inline-flex mx-auto md:mx-0 items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wider uppercase">
                  ACTIVE
                </div>
              </div>
              <p className="text-slate-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                <span className="material-symbols-outlined text-sm">work</span>
                {employee.user?.role?.name || employee.user?.department?.name || "Unassigned Designation"}
                <span className="mx-2 text-slate-300">|</span>
                <span className="material-symbols-outlined text-sm">domain</span>
                {employee.user?.branch?.name || "Global / HQ"}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                  <span className="material-symbols-outlined text-[16px]">mail</span> {employee.email}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                  <span className="material-symbols-outlined text-[16px]">fingerprint</span> NIN: {employee.nin || "Pending"}
                </div>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex flex-wrap md:flex-nowrap overflow-x-auto hide-scrollbar gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-md border border-slate-900"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Render Surface */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[400px]">
            {activeTab === "personal" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-extrabold text-slate-800 mb-6 pb-4 border-b border-slate-100">Bio-Data & Residency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DataRow label="Title" value={employee.title} />
                  <DataRow label="Maiden Name" value={employee.maidenName} />
                  <DataRow label="Place of Birth" value={employee.placeOfBirth} />
                  <DataRow label="Marital Status" value={employee.maritalStatus} />
                  <DataRow label="Nationality" value={employee.nationality} />
                  <DataRow label="State of Origin" value={employee.stateOfOrigin} />
                  <DataRow label="L.G.A" value={employee.lga} />
                  <DataRow label="Secondary Mobile" value={employee.mobile2} />
                  <DataRow label="Permanent Address" value={employee.permanentAddress} colSpan={2} />
                  
                  <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                     <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Emergency Contact (Next of Kin)</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <DataRow label="Full Name" value={employee.nokName} />
                       <DataRow label="Relationship" value={employee.nokRelationship} />
                       <DataRow label="Phone Number" value={employee.nokPhone} />
                       <DataRow label="Email Address" value={employee.nokEmail} />
                       <DataRow label="Residential Address" value={employee.nokAddress} colSpan={2} />
                     </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "history" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-extrabold text-slate-800 mb-6 pb-4 border-b border-slate-100">Professional History</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">school</span> Education History</h4>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap">{employee.educationHistory ? JSON.stringify(employee.educationHistory, null, 2) : "No educational records strictly verified."}</pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">work_history</span> Employment History</h4>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap">{employee.employmentHistory ? JSON.stringify(employee.employmentHistory, null, 2) : "No prior employment ledgers documented."}</pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">groups</span> Referees & Guarantors</h4>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap">{employee.referees ? JSON.stringify(employee.referees, null, 2) : "Guarantors pending physical institutional verification."}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "medical" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-extrabold text-slate-800 mb-6 pb-4 border-b border-slate-100">Health & Safety Declarations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DataRow label="Blood Group" value={employee.bloodGroup} />
                  <DataRow label="Genotype" value={employee.genotype} />
                  <DataRow label="HMO Provider Plan" value={employee.hmoPlan} />
                  <DataRow label="Stated Allergies" value={employee.allergies} customColor="text-red-600" />
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-extrabold text-slate-800 mb-6 pb-4 border-b border-slate-100">Fiscal Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DataRow label="Gross Monthly Emolument" value={`₦${(employee.grossSalary || 0).toLocaleString()}`} />
                  
                  <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-100">
                     <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Banking & Disbursement</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <DataRow label="Bank Name" value={employee.bankName} />
                       <DataRow label="Account Name" value={employee.accountName} />
                       <DataRow label="Account Number" value={employee.bankAccount} />
                       <DataRow label="Account Type" value={employee.accountType} />
                     </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-100">
                     <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Pension Registration</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <DataRow label="Pension Fund Administrator" value={employee.pfaName} />
                       <DataRow label="PFA Registration Number" value={employee.pfaNumber} />
                     </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-100">
                     <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Statutory Tax Identification</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <DataRow label="JTB TIN (Federal)" value={employee.jtbTin} />
                       <DataRow label="LIRS Payer ID (State)" value={employee.lirsPayerId} />
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "assets" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-extrabold text-slate-800 mb-6 pb-4 border-b border-slate-100">Assigned Corporate Assets</h3>
                <div className="p-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mb-4">
                     <span className="material-symbols-outlined text-slate-400 text-3xl">inventory_2</span>
                   </div>
                   <h4 className="font-bold text-slate-700">No Assets Assigned</h4>
                   <p className="text-sm text-slate-500 mt-2 max-w-sm">There are currently no active corporate laptops, devices, or access keys allocated to this employee's ledger.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar Controls) */}
        <div className="col-span-12 xl:col-span-3 space-y-6">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="bg-slate-900 border-b border-slate-800 p-5">
               <h3 className="font-extrabold text-white flex items-center gap-2">
                 <span className="material-symbols-outlined text-[18px] text-blue-400">admin_panel_settings</span>
                 Payroll & Tax Controls
               </h3>
               <p className="text-xs text-slate-400 mt-1">Tier-2 Financial Overrides</p>
             </div>
             <div className="p-6 space-y-6">
                
                {/* Toggle 1: Pension */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Apply Pension Relief</h4>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Statutory 8% PRA</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('pension')}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pensionRelief ? 'bg-blue-600' : 'bg-slate-200'} disabled:opacity-50`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pensionRelief ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full line"></div>

                {/* Toggle 2: Rent */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Apply Rent Relief</h4>
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">20% Tier-Two Act</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('rent')}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rentRelief ? 'bg-emerald-600' : 'bg-slate-200'} disabled:opacity-50`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rentRelief ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex items-start gap-3 mt-4">
                  <span className="material-symbols-outlined text-blue-500 text-[18px] mt-0.5">info</span>
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    Toggling reliefs immediately forces a recalculation globally across the Payroll Sync Engine.
                  </p>
                </div>

             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Data Layout
function DataRow({ label, value, colSpan = 1, customColor = 'text-slate-900' }: { label: string, value: string | null | undefined, colSpan?: number, customColor?: string }) {
  // Using custom generic CSS to handle dynamic col-span cleanly
  return (
    <div className={`col-span-1 md:col-span-${colSpan} flex flex-col gap-1.5`}>
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">{label}</label>
      <div className={`bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-semibold ${customColor}`}>
        {value || <span className="text-slate-400 italic font-normal">Not Provided</span>}
      </div>
    </div>
  );
}
