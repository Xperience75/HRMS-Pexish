"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock login for Sprint 1
      router.push("/admin/dashboard");
    }
  };

  return (
    <main className="w-full max-w-[1200px] mx-auto min-h-screen lg:min-h-0 lg:h-[80vh] lg:my-[10vh] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl rounded-xl bg-surface-container-lowest">
      {/* Left Side: Editorial Authority Section */}
      <section className="hidden lg:flex lg:col-span-7 executive-gradient p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg shadow-lg">
              <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
            </div>
            <span className="font-headline font-extrabold text-2xl text-white tracking-tighter">Executive Layer</span>
          </div>
          <div className="max-w-md">
            <h1 className="font-headline text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Precision Control for the Modern Enterprise.
            </h1>
            <p className="text-on-primary-container text-lg leading-relaxed font-light opacity-90">
              Access your global human resources ecosystem through our high-performance architectural ledger. Institutional security meets elite design.
            </p>
          </div>
        </div>
        
        <div className="relative z-10 mt-auto grid grid-cols-2 gap-8">
          <div>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary-fixed block mb-2 opacity-70">Active Nodes</span>
            <span className="font-headline text-3xl font-bold text-white tracking-tight">2,481</span>
          </div>
          <div>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary-fixed block mb-2 opacity-70">Security Protocol</span>
            <span className="font-headline text-3xl font-bold text-white tracking-tight">AES-256</span>
          </div>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none">
          <img 
            alt="Architectural corporate lobby interior" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm5xYljhTvWv8F7OoYhiCvL5SZbf-hUwVmZBO5zC2zr0hHB4ntBTXsUG6-hdNuuaQVUestY5lwqsaWRNHTO0r7bQ12VC2wvZEZS2vtn1qGLXTEfu9dIc-S2UU_VNsxwpc2mXffKUpk8cr13A6SqtGNY5q9Y9uebPmW6mo0-5pb3Vk_u9L5Wtpgiv0GZnTq0fjlwksUeccKyiwnJuE7ZxB5WUlhUOIKyVVhn0A_XVcbkxbYaXATLkSPcO8zVHHHncca5CoFIulVtYg"
          />
        </div>
      </section>

      {/* Right Side: Transactional Form Area */}
      <section className="col-span-1 lg:col-span-5 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-surface-container-lowest">
        <div className="mb-10 lg:hidden flex justify-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
            <span className="font-headline font-extrabold text-xl text-on-surface tracking-tighter">Executive Layer</span>
          </div>
        </div>
        
        <div className="max-w-sm mx-auto w-full">
          <header className="mb-10 text-center lg:text-left">
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2 tracking-tight">Institutional Login</h2>
            <p className="text-on-surface-variant font-medium text-sm">Secure access to your enterprise tenant.</p>
          </header>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="space-y-2">
              <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between" htmlFor="email">
                Email Address
                <span className="text-primary-container lowercase font-normal italic">enterprise.domain</span>
              </label>
              <div className="relative group">
                <input 
                  id="email" 
                  name="email" 
                  placeholder="name@company.com" 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-4 text-sm font-medium transition-all text-on-surface outline-none" 
                  required
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant" htmlFor="password">
                  Security Code
                </label>
                <a className="font-label text-[11px] uppercase tracking-wider text-primary font-bold hover:opacity-80 transition-opacity" href="#">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <input 
                  id="password" 
                  name="password" 
                  placeholder="••••••••••••" 
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-4 text-sm font-medium transition-all text-on-surface outline-none" 
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input 
                id="remember" 
                name="remember" 
                type="checkbox"
                className="w-4 h-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20 cursor-pointer" 
              />
              <label className="font-label text-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Trust this device for 30 days
              </label>
            </div>

            {/* Primary Action */}
            <button className="w-full executive-gradient text-on-primary py-4 rounded-lg font-headline font-bold text-sm tracking-wider uppercase shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all" type="submit">
              Login to Infrastructure
            </button>
          </form>

          {/* Divider */}
          <div className="my-10 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Secure Gateways</span>
            <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
          </div>

          {/* SSO Options */}
          <div className="grid grid-cols-1 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-outline-variant/50 rounded-lg bg-surface hover:bg-surface-container-low transition-colors group">
              <span className="material-symbols-outlined text-primary text-xl">vpn_key</span>
              <span className="font-body text-xs font-semibold text-on-surface tracking-wide uppercase">Enterprise SSO (SAML)</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-outline-variant/50 rounded-lg bg-surface hover:bg-surface-container-low transition-colors group">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">fingerprint</span>
              <span className="font-body text-xs font-semibold text-on-surface tracking-wide uppercase">Biometric Authenticator</span>
            </button>
          </div>

          <footer className="mt-12 text-center">
            <p className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant/60 leading-relaxed">
              Authorized Personnel Only.<br/>
              © 2024 Executive Layer HRMS. Version 2.4.1-stable
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
