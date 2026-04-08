"use client";

import React, { useState } from "react";
import UploadTemplateModal from "./UploadTemplateModal";

export default function UploadButtonAndModal({ dynamicRoles }: { dynamicRoles: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#745b00] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <span className="material-symbols-outlined text-[18px]">upload_file</span>
        Upload Template
      </button>
      <UploadTemplateModal isOpen={isOpen} onClose={() => setIsOpen(false)} dynamicRoles={dynamicRoles} />
    </>
  );
}
