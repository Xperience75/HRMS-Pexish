"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/admin/employees/new') {
    return (
      <nav className="mb-6 text-sm">
        <Link href="/admin/employees">Employee Master</Link> <span className="mx-2">&gt;</span> <span className="text-white">Add New</span>
      </nav>
    );
  }

  if (pathname === '/admin/roles/create') {
    return (
      <nav className="mb-6 text-sm">
        <Link href="/admin/settings">Settings</Link> <span className="mx-2">&gt;</span> <Link href="/admin/settings/security">Security</Link> <span className="mx-2">&gt;</span> <span className="text-white">Role Builder</span>
      </nav>
    );
  }

  if (pathname === '/admin/ats') {
    return (
      <nav className="mb-6 text-sm">
        <Link href="/admin/dashboard">Dashboard</Link> <span className="mx-2">&gt;</span> <span className="text-white">ATS & Recruitment</span>
      </nav>
    );
  }

  if (pathname === '/admin/advances') {
    return (
      <nav className="mb-6 text-sm">
        <Link href="/admin/payroll">Payroll Engine</Link> <span className="mx-2">&gt;</span> <span className="text-white">Manage Advances</span>
      </nav>
    );
  }

  // Fallback
  return null;
}
