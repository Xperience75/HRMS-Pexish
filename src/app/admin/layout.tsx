import React from "react";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import "../globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#fff9ee] text-[#1e1b11] flex min-h-screen font-body antialiased">
      {/* Global Sidebar Navigation (Sprint 1 Architecture) */}
      <aside className="fixed left-0 top-0 h-screen w-64 z-50 bg-slate-900 flex flex-col py-6 shadow-2xl">
        <div className="px-6 mb-10">
          <h1 className="text-lg font-headline font-extrabold text-white tracking-tight">The Ledger</h1>
          <p className="text-[10px] font-body font-medium uppercase tracking-widest text-slate-400 mt-1">Institutional HR</p>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
            { label: "Employee Master", href: "/admin/employees", icon: "group" },
            { label: "ATS/Recruitment", href: "/admin/ats", icon: "work" },
            { label: "Time & Leave", href: "/admin/attendance", icon: "calendar_today" },
            { label: "Payroll Engine", href: "/admin/payroll", icon: "payments" },
            { label: "Vault", href: "/admin/vault", icon: "lock" },
            { label: "Security Settings", href: "/admin/settings/security", icon: "shield" }
          ].map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex items-center px-6 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all duration-200 group focus:bg-slate-800/50 focus:text-amber-500 focus:border-l-4 focus:border-amber-500"
            >
              <span className="material-symbols-outlined mr-3 text-xl transition-transform group-hover:scale-110 flex-shrink-0">{item.icon}</span>
              <span className="font-body text-xs font-medium uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-6 mt-auto">
          <Link href="/auth/login" className="flex items-center py-3 text-slate-400 hover:text-slate-200 transition-all group">
            <span className="material-symbols-outlined mr-3 text-xl transition-transform group-hover:scale-110 flex-shrink-0">logout</span>
            <span className="font-body text-xs font-medium uppercase tracking-widest">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Injector */}
      <div className="flex-1 ml-64 relative h-screen flex flex-col overflow-hidden">
        {/* Global Top Navbar wrapper (optional) - specific pages will inject their headers natively into main container, but shell defines ml-64 spacing */}
        <header className="fixed top-0 right-0 left-64 z-40 h-16 bg-[#fff9ee]/90 backdrop-blur-md border-b border-black/5 flex justify-between items-center px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-headline font-bold text-xl text-slate-900 tracking-tight">Executive Layer</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-600 hover:bg-slate-100 transition-colors rounded">
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-slate-300"></div>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-16 overflow-y-auto">
          <div className="container mx-auto w-full px-4 md:px-8 py-6">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
