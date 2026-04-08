"use client";

import React, { useState } from "react";
import Link from "next/link";
import { publishGlobalSettings, uploadLogoToS3 } from "./actions";

export default function GlobalSettingsPage() {
  const [activeTab, setActiveTab] = useState("calendar"); // Setting to display the calendar view on load
  const [brandHex, setBrandHex] = useState("#745b00");
  const [advanceMaxPercentage, setAdvanceMaxPercentage] = useState<number>(40);
  const [advanceCutoffDay, setAdvanceCutoffDay] = useState<number>(28);
  const [enforceHardLock, setEnforceHardLock] = useState<boolean>(true); // Mapping to Guarantor verified or similar
  const [financeEmails, setFinanceEmails] = useState("finance.ops@enterprise-vault.com");

  const [activeWorkDays, setActiveWorkDays] = useState(["MON", "TUE", "WED", "THU", "FRI"]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const toggleWorkDay = (day: string) => {
    if (activeWorkDays.includes(day)) {
      setActiveWorkDays(activeWorkDays.filter(d => d !== day));
    } else {
      setActiveWorkDays([...activeWorkDays, day]);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      // Explicit AWS S3 mapping trigger
      const formData = new FormData();
      formData.append("logo", e.target.files[0]);
      const res = await uploadLogoToS3(formData);
      if (res.success) {
        alert("Logo successfully uploaded to Amazon S3: " + res.url);
      }
    }
  };

  const handlePublish = async () => {
    alert("Compiling Global Rules Database transaction...\nWorkweek Divisor: " + activeWorkDays.length);
    
    // Server Action Trigger
    const result = await publishGlobalSettings({
      tenantId: "mock-tenant-id",
      brandHex,
      activeWorkDays,
      advanceMaxPercentage,
      advanceCutoffDay,
      enforceHardLock,
      financeEmails,
    });

    if (result.success) {
      alert("Executive Audit Trail Updated.\nTenant Database Successfully Synced.");
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-headline font-extrabold tracking-tight mb-2">Configuration Hub</h1>
              <p className="text-[#4e4634]">Define institutional parameters and corporate branding standards.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-[#efe8d7] font-semibold text-sm rounded">Discard Changes</button>
              <button onClick={handlePublish} className="px-6 py-2 bg-[#745b00] text-white font-semibold text-sm rounded hover:opacity-90">Publish Global Rules</button>
            </div>
          </div>

          <div className="bg-[#fbf3e2] rounded-xl overflow-hidden shadow-sm border border-black/5">
            <div className="flex border-b border-black/10 bg-[#fbf3e2]">
              <button className={`px-8 py-4 text-sm font-semibold flex items-center gap-2 ${activeTab === 'branding' ? 'border-b-2 border-[#745b00] text-[#745b00]' : 'text-[#4e4634]'}`} onClick={() => setActiveTab('branding')}>Corporate Branding</button>
              <button className={`px-8 py-4 text-sm font-semibold flex items-center gap-2 ${activeTab === 'calendar' ? 'border-b-2 border-[#745b00] text-[#745b00]' : 'text-[#4e4634]'}`} onClick={() => setActiveTab('calendar')}>Payroll Calendar</button>
              <button className={`px-8 py-4 text-sm font-semibold flex items-center gap-2 ${activeTab === 'policy' ? 'border-b-2 border-[#745b00] text-[#745b00]' : 'text-[#4e4634]'}`} onClick={() => setActiveTab('policy')}>Policy Parameters</button>
              <button className={`px-8 py-4 text-sm font-semibold flex items-center gap-2 ${activeTab === 'finance' ? 'border-b-2 border-[#745b00] text-[#745b00]' : 'text-[#4e4634]'}`} onClick={() => setActiveTab('finance')}>Finance Gateway</button>
              <button className={`px-8 py-4 text-sm font-semibold flex items-center gap-2 ${activeTab === 'security' ? 'border-b-2 border-[#745b00] text-[#745b00]' : 'text-[#4e4634]'}`} onClick={() => setActiveTab('security')}>Security Architecture</button>
            </div>

            <div className="p-8 space-y-12 bg-white min-h-[400px]">
              {/* BRANDING TAB */}
              {activeTab === 'branding' && (
                <section>
                  <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-4">
                      <h3 className="text-lg font-bold mb-1">Visual Identity</h3>
                      <p className="text-sm text-[#4e4634] leading-relaxed">Customize how the Executive Layer is presented to your workforce across all modules.</p>
                    </div>
                    <div className="col-span-8 grid grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-lg border border-[#d1c5ad]">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-4">Institutional Logo</label>
                        <div className="flex items-center gap-6">
                          <label className="w-24 h-24 bg-[#e9e2d1] flex items-center justify-center rounded border-2 border-dashed border-[#d1c5ad] cursor-pointer">
                            <span className="text-2xl text-[#d1c5ad]">+</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </label>
                          <div className="flex-1">
                            <p className="text-xs text-[#4e4634] mb-3">{logoFile ? `Prepared: ${logoFile.name}` : "SVG or High-Res PNG. Recommended size 400x120px."}</p>
                            <label className="text-xs font-bold text-[#745b00] border border-[#745b00] px-4 py-2 cursor-pointer hover:bg-[#745b00]/5 rounded transition-all">
                              Upload New <input type="file" className="hidden" onChange={handleLogoUpload} />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-lg border border-[#d1c5ad]">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-4">Primary Brand Hex</label>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded shadow-inner border border-black/10" style={{ backgroundColor: brandHex }}></div>
                          <div className="flex-1 relative">
                            <input value={brandHex} onChange={e => setBrandHex(e.target.value)} className="w-full bg-[#e9e2d1] border-none py-3 px-4 font-mono text-sm rounded" type="text" />
                          </div>
                        </div>
                        <p className="text-[10px] mt-3 text-[#4e4634] italic">Applied to all primary buttons and active indicators.</p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* CALENDAR TAB */}
              {activeTab === 'calendar' && (
                <section>
                  <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-4">
                      <h3 className="text-lg font-bold mb-1">Payroll Calendar</h3>
                      <p className="text-sm text-[#4e4634] leading-relaxed">Establish working days per branch to dictate the strict `workweekDivisor` output for the payroll calculator.</p>
                      <p className="mt-4 font-bold text-lg text-[#745b00]">Divisor Output: {activeWorkDays.length} Days/Week</p>
                    </div>
                    <div className="col-span-8 bg-white p-6 rounded-lg border border-[#d1c5ad]">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-bold">Standard Work Week</h4>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                          <div key={day} onClick={() => toggleWorkDay(day)} className={`cursor-pointer border p-3 text-center rounded ${activeWorkDays.includes(day) ? 'bg-[#cca200]/20 border-[#cca200]/30' : 'bg-[#e9e2d1]/30 border-black/10'}`}>
                            <span className="block text-[10px] font-bold">{day}</span>
                            <span className="text-sm font-bold mt-1 text-[#745b00]">{activeWorkDays.includes(day) ? "√" : "×"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* POLICY TAB */}
              {activeTab === 'policy' && (
                <section>
                  <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-4">
                      <h3 className="text-lg font-bold mb-1">Policy Parameters</h3>
                      <p className="text-sm text-[#4e4634] leading-relaxed">Strict business rules for financial operations and advances.</p>
                    </div>
                    <div className="col-span-8 grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-2">Max Salary Advance %</label>
                          <input type="number" value={advanceMaxPercentage} onChange={e => setAdvanceMaxPercentage(Number(e.target.value))} className="w-full bg-[#e9e2d1] border-none py-3 px-4 text-sm font-semibold rounded" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#4e4634] mb-2">Monthly Cut-off Date</label>
                          <select value={advanceCutoffDay} onChange={e => setAdvanceCutoffDay(Number(e.target.value))} className="w-full bg-[#e9e2d1] border-none py-3 px-4 text-sm font-semibold rounded">
                            <option value={20}>20th of every month</option>
                            <option value={25}>25th of every month</option>
                            <option value={28}>28th of every month</option>
                          </select>
                        </div>
                      </div>
                      <div className="bg-[#fbf3e2] p-6 rounded-lg border-2 border-[#745b00]/10 cursor-pointer" onClick={() => setEnforceHardLock(!enforceHardLock)}>
                        <h5 className="text-xs font-bold text-[#745b00] mb-3">Dynamic Logic</h5>
                        <p className="text-xs text-[#4e4634] leading-relaxed mb-4">Setting the cut-off explicitly enforces locking attendance at 23:59 prior to the cut-off threshold. Require Guarantor is linked to this module.</p>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={enforceHardLock} readOnly className="w-5 h-5 text-[#745b00]" />
                          <span className="text-xs font-semibold">Enable Hard-Lock & Guarantor Verification</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* FINANCE TAB */}
              {activeTab === 'finance' && (
                <section>
                  <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-4">
                      <h3 className="text-lg font-bold mb-1">Finance Gateway</h3>
                      <p className="text-sm text-[#4e4634] leading-relaxed">Automated export protocols for encrypted payroll distributions. Inputs accept multiple valid emails via comma separation.</p>
                    </div>
                    <div className="col-span-8">
                      <div className="bg-[#343025] text-white p-6 rounded-lg shadow-xl mb-6">
                        <div className="flex items-start justify-between">
                          <div className="w-full">
                            <h4 className="text-lg font-bold mb-4">Encrypted Payroll Dump Accounts</h4>
                            <input value={financeEmails} onChange={e => setFinanceEmails(e.target.value)} className="w-full bg-slate-800 text-white font-mono p-4 border border-slate-700 rounded" type="text" />
                            <p className="text-[10px] text-slate-400 mt-2 uppercase">Separate multiple emails by commas</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* SECURITY ARCHITECTURE TAB */}
              {activeTab === 'security' && (
                <section>
                  <div className="grid grid-cols-12 gap-12">
                    <div className="col-span-4">
                      <h3 className="text-lg font-bold mb-1">Security Architecture</h3>
                      <p className="text-sm text-[#4e4634] leading-relaxed">Configure institutional access parameters and review deep-level system execution logs.</p>
                    </div>
                    <div className="col-span-8">
                      <div className="grid grid-cols-2 gap-6">
                        <Link href="/admin/roles/create" className="bg-white group p-6 rounded-lg border border-[#d1c5ad] shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]">
                          <div>
                            <span className="material-symbols-outlined text-[#745b00] text-3xl mb-3">admin_panel_settings</span>
                            <h4 className="font-headline font-bold text-lg text-[#1e1b11] mb-1">Configure New Role</h4>
                            <p className="text-xs text-[#4e4634]">Build matrix-based permission templates with surgical constraint mappings.</p>
                          </div>
                          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#745b00] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            Enter Builder <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </div>
                        </Link>
                        
                        <Link href="/admin/audit" className="bg-slate-900 group p-6 rounded-lg border border-slate-700 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between min-h-[160px]">
                          <div>
                            <span className="material-symbols-outlined text-white text-3xl mb-3">receipt_long</span>
                            <h4 className="font-headline font-bold text-lg text-white mb-1">Master Audit Log</h4>
                            <p className="text-xs text-slate-400">View immutable execution telemetry and operational footprint data.</p>
                          </div>
                          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-500 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            View Ledger <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
    </div>
  );
}
