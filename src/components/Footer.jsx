import React from 'react';
import { Phone, ShieldCheck, ExternalLink, HelpCircle } from './Icons';

export default function Footer({ navigate, onOpenApiModal }) {
  return (
    <footer className="bg-[#123B63] text-white pt-14 pb-8 border-t-4 border-[#2496D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-7 h-7 fill-none">
                  <path d="M100 16 L164 42 C164 100 138 148 100 182 C62 148 36 100 36 42 Z" fill="#2496D8" stroke="#FFFFFF" strokeWidth="6" />
                  <circle cx="138" cy="138" r="22" fill="#2EAD72" stroke="#FFFFFF" strokeWidth="4" />
                  <path d="M128 138 L135 145 L149 131" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                FIX MY <span className="text-[#2496D8]">CITY</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Official citizen-first complaint management and municipal problem-reporting web platform. Making municipal administration transparent, accountable, and responsive to every civilian.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-[#2EAD72] font-semibold bg-[#2EAD72]/10 px-3 py-1.5 rounded-lg border border-[#2EAD72]/20 w-fit">
              <ShieldCheck size={16} />
              <span>Verified Civic Webhook Active</span>
            </div>
          </div>

          {/* Citizen Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              Citizen Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => navigate('/complaint')}
                  className="hover:text-[#2496D8] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#2496D8]">›</span> Register a Civic Complaint
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/my-complaints')}
                  className="hover:text-[#2496D8] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#2496D8]">›</span> Track Complaint Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/queries')}
                  className="hover:text-[#2496D8] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#2496D8]">›</span> Public Queries & Suggestions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/profile')}
                  className="hover:text-[#2496D8] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#2496D8]">›</span> Citizen Ward Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              <Phone size={16} className="text-[#2496D8]" />
              Emergency & Support
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex justify-between items-center">
                <span className="text-slate-300">City Grievance Helpline</span>
                <span className="font-bold text-[#2496D8] font-mono text-sm">1913</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex justify-between items-center">
                <span className="text-slate-300">Police Assistance</span>
                <span className="font-bold text-amber-400 font-mono text-sm">100 / 112</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex justify-between items-center">
                <span className="text-slate-300">Fire & Disaster Force</span>
                <span className="font-bold text-rose-400 font-mono text-sm">101</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex justify-between items-center">
                <span className="text-slate-300">Ambulance Services</span>
                <span className="font-bold text-[#2EAD72] font-mono text-sm">108</span>
              </div>
            </div>
          </div>

          {/* SNS Workbench Webhook Status */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
              SNS Workbench Integration
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Direct webhook dispatch sends every complaint payload in real time to the municipal AI workflow engine:
            </p>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-white/10 font-mono text-[11px] text-[#2496D8] break-all mb-3 select-all">
              https://api.agents.snsihub.ai/webhook/3c44...
            </div>
            <button
              onClick={onOpenApiModal}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-[#2496D8] hover:bg-[#1a82be] text-white transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Inspect & Test Webhook</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 Fix My City Portal. Designed with Civic Care for Urban Communities.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Charter</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Citizen Rights</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Municipal Transparency Act</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

