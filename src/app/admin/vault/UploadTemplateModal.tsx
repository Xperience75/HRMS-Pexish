"use client";

import { useRouter } from "next/navigation";


import React, { useState } from "react";

interface UploadTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  dynamicRoles: string[];
}

export default function UploadTemplateModal({ isOpen, onClose, dynamicRoles }: UploadTemplateModalProps) {
  const router = useRouter();
  const [templateName, setTemplateName] = useState("");
  const [documentCategory, setDocumentCategory] = useState("");
  const [applicableRoles, setApplicableRoles] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRoleToggle = (role: string) => {
    setApplicableRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const showToast = (message: string, isError = false) => {
    const el = document.createElement('div');
    el.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-2xl z-[9999] transition-all transform flex items-center gap-3 font-bold text-sm ${isError ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#1e1b11] text-[#cca200]'}`;
    el.innerHTML = `<span class="material-symbols-outlined">${isError ? 'error' : 'check_circle'}</span> ${message}`;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300)
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !templateName || !documentCategory) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("templateName", templateName);
      formData.append("documentCategory", documentCategory);
      formData.append("file", file);
      formData.append("roles", JSON.stringify(applicableRoles));

      const res = await fetch("/api/vault/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      showToast("Template Securely Vaulted");
      router.refresh();
      onClose();
      
      // Reset state for next open
      setTemplateName("");
      setDocumentCategory("");
      setApplicableRoles([]);
      setFile(null);
    } catch (error: any) {
      showToast(error.message || "An error occurred during upload", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-black/10 flex justify-between items-center bg-[#fbf3e2]">
          <h2 className="text-xl font-headline font-bold text-[#1e1b11] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#745b00]">upload_file</span>
            Upload New Template
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full text-[#4e4634] transition">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="uploadForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-bold text-[#4e4634] mb-1.5">Template Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. Senior Staff Engineering Offer Letter" 
                className="w-full px-4 py-2.5 bg-white border border-[#d1c5ad] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#745b00] focus:border-[#745b00] transition outline-none text-[#1e1b11]" 
              />
            </div>

            {/* Document Category */}
            <div>
              <label className="block text-sm font-bold text-[#4e4634] mb-1.5">Document Category <span className="text-red-500">*</span></label>
              <select 
                required
                value={documentCategory}
                onChange={(e) => setDocumentCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#d1c5ad] rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#745b00] focus:border-[#745b00] transition outline-none text-[#1e1b11] appearance-none"
              >
                <option value="" disabled>Select a category...</option>
                <option value="OFFER_LETTER">Offer Letter</option>
                <option value="JOB_DESCRIPTION">Job Description</option>
                <option value="DISCIPLINARY">Disciplinary</option>
                <option value="POLICY_SOP">Policy / SOP</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Applicable Roles (Multi-select mock) */}
            <div>
              <label className="block text-sm font-bold text-[#4e4634] mb-1.5">Applicable Roles <span className="text-xs font-normal text-[#4e4634]/70">(Optional, leave blank for all)</span></label>
              <div className="p-4 border border-[#d1c5ad] rounded-lg bg-[#fbf3e2]/30 grid grid-cols-2 gap-3 max-h-40 overflow-y-auto custom-scrollbar">
                {dynamicRoles.length === 0 && (
                  <p className="text-sm text-gray-500 col-span-2 py-2">No roles found.</p>
                )}
                {dynamicRoles.map(role => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={applicableRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="w-4 h-4 text-[#745b00] bg-white border-[#d1c5ad] rounded focus:ring-[#745b00] focus:ring-2" 
                    />
                    <span className="text-sm font-medium text-[#4e4634] group-hover:text-[#1e1b11] transition">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* File Upload Dropzone */}
            <div>
              <label className="block text-sm font-bold text-[#4e4634] mb-1.5">File Upload <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-[#d1c5ad] rounded-xl p-8 hover:bg-[#fbf3e2] transition-colors relative flex flex-col items-center justify-center text-center cursor-pointer group">
                <input 
                  type="file" 
                  accept=".docx,.pdf"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className={`material-symbols-outlined text-4xl mb-3 ${file ? 'text-[#745b00]' : 'text-[#d1c5ad] group-hover:text-[#cca200]'}`}>
                  {file ? 'description' : 'cloud_upload'}
                </span>
                <p className="text-sm font-bold text-[#1e1b11] mb-1">
                  {file ? file.name : "Drag & drop your template file here"}
                </p>
                <p className="text-xs font-medium text-[#4e4634]">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : "Restricted to .docx and .pdf up to 10MB"}
                </p>
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-black/10 flex justify-end gap-3 bg-gray-50 mt-auto">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-[#4e4634] hover:bg-black/5 rounded-lg transition disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" form="uploadForm" disabled={isSubmitting} className="px-5 py-2 text-sm font-bold text-white bg-[#745b00] hover:bg-[#584400] rounded-lg shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">save</span>
            )}
            {isSubmitting ? "Uploading..." : "Save Template"}
          </button>
        </div>
      </div>
    </div>
  );
}
