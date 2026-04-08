"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ATSPipelineClient({ initialCandidates, requisitions, tenantId }: any) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [activeRoleFilter, setActiveRoleFilter] = useState("all");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (activeRoleFilter === "all") {
        alert("Please select an Active Requisition before uploading a CV.");
        event.target.value = "";
        return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenantId", tenantId);
      formData.append("jobId", activeRoleFilter);

      const res = await fetch("/api/ats/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        // TARGET 4 UI handling: Catch and display the "Blacklisted" 403 error toast
        if (res.status === 403) {
            alert(`[Security Block] CANDIDATE BLACKLISTED: ${data.error}`);
        } else {
            throw new Error(data.error || "File parsing failed");
        }
        return;
      }

      alert(`ATS Scanner Neural Parse Complete:\nScore: ${data.data?.matchScore}%\nExtracted Name: ${data.data?.fullName}\nAdded to ${data.data?.stage}`);
      
      // Refresh the page data
      router.refresh();
    } catch (e: any) {
      alert(`[Error] ${e.message}`);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const filteredCandidates = activeRoleFilter === "all" 
      ? initialCandidates 
      : initialCandidates.filter((c: any) => c.jobId === activeRoleFilter);

  const getCandidatesByStage = (stage: string) => {
      return filteredCandidates.filter((c: any) => c.stage === stage);
  };

  const CandidateCard = ({ c }: { c: any }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border-b-2 border-[#d1c5ad] hover:border-[#745b00] transition-colors cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-300 flex items-center justify-center font-bold text-slate-600 bg-[#efe8d7]">
            {c.fullName.substring(0, 2).toUpperCase()}
        </div>
        <div className="bg-[#efe8d7] px-2 py-1 rounded text-[10px] font-bold text-[#745b00]">
            {c.matchScore}% MATCH
        </div>
      </div>
      <h5 className="font-headline font-bold text-sm text-[#1e1b11] mb-0.5">{c.fullName}</h5>
      <p className="font-body text-[11px] text-[#4e4634] mb-3">{c.JobRequisition?.title || "Role"}</p>
      
      {c.stage === "SOURCED" && (
        <div className="flex items-center gap-2 text-[10px] text-[#4e4634] font-medium">
            <span className="material-symbols-outlined text-[14px]">schedule</span> 2h ago
        </div>
      )}
      
      {c.stage === "SCREENED" && (
        <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="h-1 bg-[#efe8d7] rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-[#006875]" style={{ width: `${c.matchScore}%` }}></div>
            </div>
            <div className="text-[9px] font-bold text-[#006875]">TECHNICAL FIT</div>
        </div>
      )}

      {c.stage === "INTERVIEWING" && (
        <div className="flex items-center gap-2 p-2 rounded bg-[#fbf3e2] border border-[#d1c5ad]/20">
            <span className="material-symbols-outlined text-[16px] text-[#745b00]">calendar_today</span>
            <span className="text-[10px] font-bold">Round {c.outreachSent ? "Scheduled" : "Pending"}</span>
        </div>
      )}

      {c.stage === "OFFERED" && (
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#006875]">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> Process Cleared
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner: Title & AI Dropzone */}
      <section className="flex flex-col md:flex-row justify-between items-start gap-6 w-full">
        {/* Left: Title & Controls */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-headline font-bold text-3xl text-[#1e1b11] tracking-tight">Omni-Channel ATS Pipeline</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
              <span className="font-label text-xs uppercase tracking-widest font-bold text-[#4e4634]">Active Requisition:</span>
              <select 
                value={activeRoleFilter}
                onChange={(e) => setActiveRoleFilter(e.target.value)}
                className="bg-[#f5eddc] border border-[#d1c5ad] text-[#1e1b11] text-sm font-bold rounded-lg focus:ring-[#745b00] focus:border-[#745b00] py-1.5 px-3"
              >
                <option value="all">View All Open Roles</option>
                {requisitions.map((req: any) => (
                    <option key={req.id} value={req.id}>{req.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#fff9ee] bg-slate-400"></div>
            <div className="w-8 h-8 rounded-full border-2 border-[#fff9ee] bg-slate-500"></div>
            <div className="w-8 h-8 rounded-full border-2 border-[#fff9ee] bg-[#e9e2d1] flex items-center justify-center text-[10px] font-bold text-[#4e4634]">+4</div>
          </div>
        </div>

        {/* Right: AI CV Upload Zone */}
        <div className="w-full md:max-w-md shrink-0">
          <div
            className={`relative group cursor-pointer border-2 border-dashed ${activeRoleFilter === "all" ? "border-red-300 bg-red-50" : "border-[#d1c5ad] bg-[#fbf3e2]"} rounded-xl p-6 flex flex-col items-center justify-center transition-all hover:bg-[#efe8d7] hover:border-[#745b00]`}
          >
            <input type="file" accept=".pdf,.jpeg,.jpg,.docx" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" onChange={handleFileUpload} disabled={uploading || activeRoleFilter === "all"} />
            <div className="bg-[#cca200]/20 p-3 rounded-full mb-3">
              <span className="material-symbols-outlined text-[#745b00] text-3xl">{uploading ? "sync" : "upload_file"}</span>
            </div>
            <h2 className="font-headline font-extrabold text-[#1e1b11] text-lg mb-1">{uploading ? "Parsing Document..." : "AI CV Upload & Parse"}</h2>
            <p className="font-body text-[#4e4634] text-xs">
                {activeRoleFilter === "all" ? "Select a Requisition first" : "Drop PDF/DOCX here for Domino-Execution"}
            </p>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#4e4634] bg-[#e9e2d1] px-2 py-1 rounded">Auto-Categorize</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#4e4634] bg-[#e9e2d1] px-2 py-1 rounded">Skill Extraction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Dashboard Kanban Area */}
      <section className="w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Column: Sourced */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-label text-xs font-bold uppercase tracking-widest text-[#4e4634] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7f7661]"></span> Sourced <span className="text-[10px] opacity-60">({getCandidatesByStage("SOURCED").length})</span>
              </h4>
              <span className="material-symbols-outlined text-sm text-[#4e4634]">more_horiz</span>
            </div>
            <div className="space-y-3">
              {getCandidatesByStage("SOURCED").map((c: any) => (
                  <CandidateCard key={c.id} c={c} />
              ))}
            </div>
          </div>

          {/* Column: AI Screened > 45% */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-label text-xs font-bold uppercase tracking-widest text-[#4e4634] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006875]"></span> AI Screened &gt; 45% <span className="text-[10px] opacity-60">({getCandidatesByStage("SCREENED").length})</span>
              </h4>
              <span className="material-symbols-outlined text-sm text-[#4e4634]">bolt</span>
            </div>
            <div className="space-y-3">
              {getCandidatesByStage("SCREENED").map((c: any) => (
                  <CandidateCard key={c.id} c={c} />
              ))}
            </div>
          </div>

          {/* Column: Interviewing */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-label text-xs font-bold uppercase tracking-widest text-[#4e4634] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#745b00]"></span> Interviewing <span className="text-[10px] opacity-60">({getCandidatesByStage("INTERVIEWING").length})</span>
              </h4>
              <span className="material-symbols-outlined text-sm text-[#4e4634]">videocam</span>
            </div>
            <div className="space-y-3">
              {getCandidatesByStage("INTERVIEWING").map((c: any) => (
                  <CandidateCard key={c.id} c={c} />
              ))}
            </div>
          </div>

          {/* Column: Offered */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-label text-xs font-bold uppercase tracking-widest text-[#4e4634] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#004f58]"></span> Offered <span className="text-[10px] opacity-60">({getCandidatesByStage("OFFERED").length})</span>
              </h4>
              <span className="material-symbols-outlined text-sm text-[#4e4634]">verified</span>
            </div>
            <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
              {getCandidatesByStage("OFFERED").map((c: any) => (
                  <CandidateCard key={c.id} c={c} />
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
