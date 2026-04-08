"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEmployeeForm({ roles, branches }: { roles: any[], branches: any[] }) {
  const router = useRouter();

  // Genesis Bio-Data State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [nin, setNin] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [guarantorVerified, setGuarantorVerified] = useState(false);
  
  // New HR Logic Fields
  const [designation, setDesignation] = useState("");
  const [employmentType, setEmploymentType] = useState("Permanent");
  const [assignedBranch, setAssignedBranch] = useState("");
  
  const [grossSalary, setGrossSalary] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenantId", "mock-tenant-id");
      formData.append("context", "employee_docs");

      const res = await fetch("/api/upload/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OCR Parsing failed");

      // Auto-fill state
      if (data.parsedMetrics) {
        setFirstName(data.parsedMetrics.firstName || "");
        setLastName(data.parsedMetrics.lastName || "");
        setEmail(data.parsedMetrics.email || "");
        setNin(data.parsedMetrics.nin || "");
      }
      alert(`OCR Mapping Successful from ${file.name}`);
    } catch (e: any) {
      setErrorMsg(`[OCR Block] ${e.message}`);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleFinalizeEnrollment = async () => {
    if (!firstName || !lastName || !email || !designation || !assignedBranch) {
      setErrorMsg("Critical identifiers and HR allocations are required.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/employees/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: "mock-tenant-id",
          firstName,
          lastName,
          email,
          nin,
          bloodGroup,
          guarantorVerified,
          designation, // this is roleId now
          employmentType,
          assignedBranch, // this is branchId now
          grossSalary: parseFloat(grossSalary) || 0,
          bankAccount
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to instantiate applicant");

      alert("Applicant Successfully Provisioned.\nVirtual ID Generated: " + json.virtualIdUrl);
      
      router.push("/admin/employees");
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      <div className="flex items-center gap-4 mb-4 text-[#1e1b11]">
        <span className="material-symbols-outlined text-[#745b00]">arrow_back</span>
        <h1 className="font-['Manrope'] font-extrabold text-[#1e1b11] text-3xl tracking-tight">Add New Employee</h1>
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: OCR & Warnings */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI OCR Parsing Section */}
          <section className="bg-white p-6 rounded-xl border border-[#d1c5ad]/20 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-xs uppercase tracking-widest text-[#4e4634]">Intelligent Ingest</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#745b00] bg-[#e9e2d1] px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                AI ENABLED
              </span>
            </div>
            
            <div className="relative group cursor-pointer">
              <input type="file" accept=".pdf,.jpeg,.jpg,.docx" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" onChange={handleFileUpload} disabled={uploading}/>
              <div className="w-full aspect-square md:aspect-[4/3] border-2 border-dashed border-[#d1c5ad] bg-[#fbf3e2] rounded-xl flex flex-col items-center justify-center p-6 transition-all hover:bg-[#efe8d7]">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#d1c5ad]/30">
                  <span className="material-symbols-outlined text-[#745b00] text-3xl">{uploading ? "sync" : "upload_file"}</span>
                </div>
                <p className="font-headline font-bold text-[#1e1b11] text-center">{uploading ? "Extracting Data..." : "Drop Bio-Data PDF/JPG"}</p>
                <p className="font-label text-xs text-[#4e4634] mt-1 text-center">Automatic field mapping via AI OCR</p>
              </div>
            </div>
          </section>

          {/* Critical Warning Banner */}
          <section className="bg-[#ffdad6] p-4 rounded-xl border-l-4 border-[#ba1a1a] flex gap-3 shadow-sm">
            <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div>
              <p className="text-[#93000a] font-bold text-sm">Critical Compliance Notice</p>
              <p className="text-[#93000a] text-xs mt-0.5 leading-relaxed">Failure to verify restricts salary advance access and portal self-service privileges.</p>
            </div>
          </section>

          {/* Error Feedback */}
          {errorMsg && (
            <div className="text-[#ba1a1a] font-bold text-sm bg-[#ffdad6] p-3 rounded">{errorMsg}</div>
          )}
        </div>

        {/* Right Column: Manual Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-[#d1c5ad]/20 shadow-sm space-y-8">
          {/* Precision Manual Entry */}
          <section className="space-y-5">
            <h2 className="font-headline font-extrabold text-xl tracking-tight text-[#1e1b11]">Personnel Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">First Name</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium" placeholder="e.g. Alexander" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">Last Name</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium" placeholder="e.g. Thorne" type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">Corporate Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium" placeholder="a.thorne@genesis.corp" type="email" />
            </div>

            {/* Smart Fetch Domino HR Group */}
            <div className="p-4 bg-[#fbf3e2] rounded-lg border border-[#d1c5ad]/40 space-y-5">
              <h3 className="font-bold text-sm text-[#745b00] flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                Organization Matrix Placement
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">Designation / Role</label>
                  <select value={designation} onChange={e => setDesignation(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium">
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">Employment Type</label>
                  <select value={employmentType} onChange={e => setEmploymentType(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium">
                    <option value="Permanent">Permanent</option>
                    <option value="Fixed-Term Contract">Fixed-Term Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">Assigned Branch</label>
                <select value={assignedBranch} onChange={e => setAssignedBranch(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium">
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Compensation Structure */}
            <div className="p-4 bg-[#fbf3e2] rounded-lg border border-[#d1c5ad]/40 space-y-5">
              <h3 className="font-bold text-sm text-[#745b00] flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                Compensation Structure
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">Gross Monthly Salary (₦)</label>
                  <input type="number" min="0" step="1000" value={grossSalary} onChange={e => setGrossSalary(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium" placeholder="0.00" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">Payment Bank Account</label>
                  <input type="text" maxLength={10} minLength={10} value={bankAccount} onChange={e => setBankAccount(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium" placeholder="10-digit account no." />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 relative">
                <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">National ID (NIN)</label>
                <div className="relative">
                  <input value={nin} onChange={e => setNin(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium" placeholder="0000 0000 000" type="text" />
                  <span className="material-symbols-outlined absolute right-4 top-3 text-[#7f7661] text-xl">fingerprint</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[10px] font-black uppercase text-[#4e4634] px-1">Blood Group</label>
                <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full bg-[#f5eddc] border-0 border-b-2 border-[#d1c5ad] focus:border-[#745b00] focus:ring-0 rounded-t-lg px-4 py-3 text-sm text-[#1e1b11] font-medium">
                  <option value="">Select Group</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Compliance & Eligibility */}
          <section className="bg-[#fbf3e2] p-6 rounded-xl border border-[#d1c5ad]/20 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#d1c5ad]/30 pb-4">
              <div>
                <h3 className="font-headline font-bold text-[#1e1b11] text-lg">Compliance Checklist</h3>
                <p className="text-[10px] text-[#4e4634] font-medium uppercase tracking-widest mt-1">Mandatory for Executive Clearance</p>
              </div>
              <span className="material-symbols-outlined text-[#006875] text-2xl">verified</span>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-[#d1c5ad]/30 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${guarantorVerified ? 'bg-[#006875]/10' : 'bg-[#ba1a1a]/10'}`}>
                  <span className={`material-symbols-outlined text-xl ${guarantorVerified ? 'text-[#006875]' : 'text-[#ba1a1a]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {guarantorVerified ? "shield" : "gavel"}
                  </span>
                </div>
                <div>
                  <span className="font-label text-sm font-extrabold text-[#1e1b11]">Guarantor Verified</span>
                  <p className="text-[10px] text-[#4e4634] font-medium mt-0.5">Toggle to authorize financial capabilities.</p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <div 
                className={`w-14 h-7 rounded-full relative flex items-center cursor-pointer transition-colors px-1 ${guarantorVerified ? 'bg-[#745b00]' : 'bg-[#d1c5ad]'}`}
                onClick={() => setGuarantorVerified(!guarantorVerified)}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${guarantorVerified ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </section>

          {/* Primary Action */}
          <button 
            onClick={handleFinalizeEnrollment}
            disabled={submitting}
            className="w-full bg-[#745b00] hover:bg-[#cca200] text-white py-4 rounded-xl font-headline font-extrabold text-sm tracking-widest shadow-lg shadow-[#745b00]/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? "EXECUTING..." : "FINALIZE ENROLLMENT"}
          </button>
        </div>
      </main>
    </div>
  );
}
