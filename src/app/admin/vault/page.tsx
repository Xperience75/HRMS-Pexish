import React from "react";
import UploadButtonAndModal from "./UploadButtonAndModal";
import { prisma } from "@/lib/prisma";

export default async function CentralTemplateVaultPage() {
  const tenantId = "mock-tenant-id";
  const uniqueRolesData = await prisma.role.findMany({
    where: { tenantId },
    select: { name: true },
    orderBy: { name: 'asc' }
  });

  const dynamicRoles = uniqueRolesData.map((r) => r.name);
  
  const templates = await prisma.templateDocument.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      type: true,
      storageUrl: true,
      parsedTags: true,
      createdAt: true
    }
  });

  const folders = [
    { id: 1, name: "Recruitment & ATS Master Files", count: "124 Files", size: "1.2GB", icon: "folder_shared", color: "bg-white", text: "text-slate-900", accent: "text-primary/60 hover:text-primary" },
    { id: 2, name: "Job Descriptions & Org Mapping", count: "86 Files", size: "450MB", icon: "account_tree", color: "bg-white", text: "text-slate-900", accent: "text-primary/60 hover:text-primary" },
    { id: 3, name: "Offer Letters & Contracts", count: "Active Workspace", size: "", icon: "history_edu", color: "bg-[#283044] border-t-4 border-[#cca200] transform -translate-y-2 shadow-2xl", text: "text-white", accent: "text-[#cca200]" },
    { id: 4, name: "Performance & Onboarding", count: "312 Files", size: "2.8GB", icon: "assignment_ind", color: "bg-white", text: "text-slate-900", accent: "text-primary/60 hover:text-primary" },
    { id: 5, name: "Disciplinary & Offboarding", count: "45 Files", size: "180MB", icon: "exit_to_app", color: "bg-white", text: "text-slate-900", accent: "text-primary/60 hover:text-primary" },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-1">Central Template Vault</h1>
          <div className="flex items-center gap-2 text-[#4e4634] font-medium text-sm mt-1">
            <span>Organization Assets</span>
            <span className="w-1 h-1 rounded-full bg-[#d1c5ad]"></span>
            <span className="text-[#745b00] font-bold">2,482 Files</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-[#d1c5ad] text-[#1e1b11] font-semibold text-sm rounded-lg hover:bg-[#fbf3e2] transition-colors">
            <span className="material-symbols-outlined text-[18px]">create_new_folder</span>
            New Folder
          </button>
          <UploadButtonAndModal dynamicRoles={dynamicRoles} />
        </div>
      </header>

      {/* Contextual Vault Navigation (As requested by User) */}
      <div className="flex items-center gap-6 border-b border-black/10 mb-8 pb-4">
        <button className="text-sm font-bold uppercase tracking-wider text-[#745b00] border-b-2 border-[#745b00] pb-2 px-2 flex items-center gap-2">
           <span className="material-symbols-outlined text-lg">folder_open</span> All Files
        </button>
        <button className="text-sm font-bold uppercase tracking-wider text-[#4e4634] pb-2 px-2 hover:text-[#1e1b11] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">group</span> Shared
        </button>
        <button className="text-sm font-bold uppercase tracking-wider text-[#4e4634] pb-2 px-2 hover:text-[#1e1b11] transition-colors flex items-center gap-2">
           <span className="material-symbols-outlined text-lg">description</span> Templates
        </button>
        <button className="text-sm font-bold uppercase tracking-wider text-[#4e4634] pb-2 px-2 hover:text-[#1e1b11] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">history_edu</span> Contracts
        </button>
        <button className="text-sm font-bold uppercase tracking-wider text-[#4e4634] pb-2 px-2 hover:text-[#1e1b11] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">inventory_2</span> Archive
        </button>
      </div>

      {/* Folder Structure Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {folders.map(folder => (
          <div key={folder.id} className={`group cursor-pointer p-5 rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 ${folder.color}`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`material-symbols-outlined text-4xl transition-colors ${folder.accent}`}>{folder.icon}</span>
              <span className="material-symbols-outlined text-[#4e4634] opacity-0 group-hover:opacity-100 transition-opacity">more_vert</span>
            </div>
            <h3 className={`text-sm font-headline font-bold leading-snug ${folder.text}`}>{folder.name}</h3>
            <p className={`text-[10px] font-medium uppercase tracking-wider mt-2 ${folder.id === 3 ? 'text-[#cca200]' : 'text-[#4e4634]'}`}>
              {folder.count} {folder.size ? `• ${folder.size}` : ''}
            </p>
          </div>
        ))}
      </section>

      {/* Main Data Table Container */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden mb-10 border border-black/5">
        <div className="px-6 py-4 bg-[#fbf3e2] border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-headline font-bold text-[#1e1b11]">Offer Letters & Contracts</h2>
            <span className="px-2 py-0.5 bg-[#e9e2d1] rounded text-[10px] font-bold text-[#4e4634] uppercase tracking-widest">Read Only Access</span>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-[#e9e2d1] rounded text-[#4e4634] transition-colors"><span className="material-symbols-outlined text-sm">filter_list</span></button>
            <button className="p-1.5 hover:bg-[#e9e2d1] rounded text-[#4e4634] transition-colors"><span className="material-symbols-outlined text-sm">sort</span></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#fbf3e2]/50">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black text-[#4e4634] uppercase tracking-[0.2em]">Name</th>
                <th className="px-6 py-3 text-[10px] font-black text-[#4e4634] uppercase tracking-[0.2em]">Type</th>
                <th className="px-6 py-3 text-[10px] font-black text-[#4e4634] uppercase tracking-[0.2em]">Tags</th>
                <th className="px-6 py-3 text-[10px] font-black text-[#4e4634] uppercase tracking-[0.2em]">Last Modified</th>
                <th className="px-6 py-3 text-[10px] font-black text-[#4e4634] uppercase tracking-[0.2em] text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {templates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#4e4634] font-medium">No templates vaulted yet.</td>
                </tr>
              )}
              {templates.map((template) => {
                const isPdf = template.name.toLowerCase().endsWith('.pdf') || template.storageUrl.toLowerCase().endsWith('.pdf');
                const tags = Array.isArray(template.parsedTags) ? (template.parsedTags as string[]) : [];
                
                return (
                  <tr key={template.id} className="hover:bg-[#fbf3e2]/30 transition-colors border-b border-black/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${isPdf ? 'text-red-600' : 'text-blue-600'}`}>
                          {isPdf ? 'picture_as_pdf' : 'description'}
                        </span>
                        <span className="font-bold text-[#1e1b11]">
                          {template.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-[#4e4634]">{template.type}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {tags.length > 0 ? tags.map((tag, i) => (
                           <span key={i} className="px-2 py-0.5 bg-[#e9e2d1] text-[#4e4634] text-[10px] font-bold rounded uppercase">{tag}</span>
                        )) : (
                           <span className="text-[#4e4634]/50 text-xs italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#4e4634] font-medium">
                      {new Date(template.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 hover:bg-[#e9e2d1] rounded-full text-[#4e4634] transition-colors"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Widgets Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#0047AB] to-[#131b2e] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          <div className="flex-1 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-4">
              <span className="material-symbols-outlined text-[#ffe08d] text-sm">auto_awesome</span>
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.15em]">AI-Powered</span>
            </div>
            <h2 className="text-2xl font-headline font-extrabold text-white mb-3">Smart Contract Generator</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-lg">
              Automate your offer letter creation using pre-defined templates and employee data fields. Reduce errors and ensure compliance across all regions.
            </p>
            <button className="bg-[#cca200] text-[#1e1b11] font-bold px-8 py-3 rounded-lg shadow-xl hover:bg-[#ffe08d] transition-all flex items-center gap-2">
              Launch Generator
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            </button>
          </div>
          <div className="hidden md:block w-48 h-48 relative">
            <span className="material-symbols-outlined text-[120px] text-white/20 absolute inset-0 flex items-center justify-center">history_edu</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[#1e1b11] font-headline font-bold text-lg">Storage Capacity</h3>
            <span className="material-symbols-outlined text-[#745b00]">cloud_upload</span>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-headline font-black text-[#1e1b11] tracking-tight">4.2 GB</p>
                <p className="text-[#4e4634] text-xs font-bold uppercase tracking-widest mt-1">/ 50 GB Used</p>
              </div>
              <span className="text-[#745b00] font-bold text-sm">8.4% Full</span>
            </div>
            <div className="relative w-full h-4 bg-[#efe8d7] rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-[8.4%] bg-[#745b00] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
