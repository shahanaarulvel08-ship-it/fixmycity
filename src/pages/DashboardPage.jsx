import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { CITY_ANNOUNCEMENTS } from '../constants/mockData';
import StatusBadge from '../components/StatusBadge';
import {
  AlertTriangle,
  FileText,
  HelpCircle,
  Phone,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  Activity,
  Building2
} from '../components/Icons';

export default function DashboardPage({ navigate }) {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const totalComplaints = complaints.length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'In Progress' || c.status === 'Under Review'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 94;

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-16">
      {/* Hero Welcome Section */}
      <section className="bg-gradient-to-b from-[#123B63] to-[#0e2c4a] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative civic pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#2496D8_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#2496D8]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-slate-200 mb-3 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#2EAD72]" />
                <span>Fix My City Civilian Dashboard • {user?.ward || 'Ward 14'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Welcome to Fix My City!
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed">
                Your voice matters. Help us improve your city by reporting civic issues.
              </p>
            </div>

            {/* Quick Citizen Profile Widget */}
            {user && (
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#2496D8]"
                />
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{user.name}</h3>
                  <p className="text-xs text-slate-300">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] bg-[#2EAD72]/20 text-[#2EAD72] font-semibold px-2 py-0.5 rounded-full border border-[#2EAD72]/30">
                      ★ Active Resident
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
              <span className="text-xs text-slate-300 block mb-1">Total Reported</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalComplaints}</span>
                <span className="text-xs text-slate-400">cases</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
              <span className="text-xs text-slate-300 block mb-1">In Action / Review</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2496D8]">{inProgressCount}</span>
                <span className="text-xs text-slate-400">active</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
              <span className="text-xs text-slate-300 block mb-1">Resolved Issues</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2EAD72]">{resolvedCount}</span>
                <span className="text-xs text-slate-400">fixed</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
              <span className="text-xs text-slate-300 block mb-1">Average Response</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">24-48h</span>
                <span className="text-xs text-slate-400">SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-10">
        {/* Main Central Complaint Callout Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/70 border border-slate-200 text-center relative overflow-hidden transition-all hover:shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#123B63] via-[#2496D8] to-[#2EAD72]" />

          <div className="max-w-2xl mx-auto flex flex-col items-center">
            {/* Large Alert / Message Icon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-[#2496D8]/10 to-[#2EAD72]/10 border-2 border-[#2496D8]/30 flex items-center justify-center text-[#2496D8] shadow-inner mb-5 transform hover:scale-105 transition-transform">
              <AlertTriangle size={48} className="text-[#2496D8] animate-bounce-short" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123B63] tracking-tight">
              Report a Civic Issue
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              Spotted a problem in your area? Let us know, and we'll help get it resolved.
            </p>

            {/* Prominent Primary CTA Button */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
              <button
                onClick={() => navigate('/complaint')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#123B63] hover:bg-[#0d2b4a] text-white font-bold text-base shadow-lg shadow-[#123B63]/25 hover:shadow-xl hover:shadow-[#123B63]/30 transform hover:-translate-y-0.5 transition-all"
              >
                <Plus size={20} className="text-[#2496D8]" />
                <span>Register a Complaint</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-[#2EAD72]" /> Free Service
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#2496D8]" /> Webhook Automated
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={14} className="text-amber-500" /> Live Tracking
              </span>
            </div>
          </div>
        </div>

        {/* 4 Quick Access Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#123B63] flex items-center gap-2">
              <span>Quick Services</span>
            </h3>
            <span className="text-xs text-slate-500">One-click civilian actions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Card 1: Submit Complaint */}
            <div
              onClick={() => navigate('/complaint')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#2496D8] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#2496D8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <AlertTriangle size={24} />
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-[#2496D8] transition-colors">
                  Submit a Complaint
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Report road hazards, garbage, street lights, water leaks, or tree falls.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2496D8]">
                <span>Open Form</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Quick Card 2: My Complaints */}
            <div
              onClick={() => navigate('/my-complaints')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#123B63] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#123B63] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative">
                  <FileText size={24} />
                  {complaints.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#2496D8] text-white text-[10px] font-bold flex items-center justify-center">
                      {complaints.length}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-[#123B63] transition-colors">
                  My Complaints
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Track real-time progress, assigned ward engineers, and municipal inspection notes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#123B63]">
                <span>View My Reports ({complaints.length})</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Quick Card 3: Queries & Requests */}
            <div
              onClick={() => navigate('/queries')}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#2EAD72] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#2EAD72] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <HelpCircle size={24} />
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-[#2EAD72] transition-colors">
                  Queries & Requests
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Raise public service questions, suggest municipal upgrades, or request help.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2EAD72]">
                <span>Ask Question</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Quick Card 4: Contact Support */}
            <div
              onClick={() => setSupportModalOpen(true)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Contact Support
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  24/7 civic hotline 1913, emergency dispatchers, and ward control room direct dial.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>View Emergency Desk</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Section: Recent Complaints Feed & City Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Complaints Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#123B63]">Recent Reported Issues</h3>
                <p className="text-xs text-slate-500">Your latest logged civic grievances</p>
              </div>
              <button
                onClick={() => navigate('/my-complaints')}
                className="text-xs font-bold text-[#2496D8] hover:text-[#123B63] transition-colors"
              >
                View All ({complaints.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {recentComplaints.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate('/my-complaints')}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4 justify-between"
                >
                  <div className="flex gap-4 items-start flex-1 min-w-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt="Evidence"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#123B63]">{item.id}</span>
                        <StatusBadge status={item.status} isMock={item.is_mock} />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                        {item.complaint}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin size={12} className="text-[#2496D8] shrink-0" />
                        <span>{item.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.submitted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs font-semibold text-[#2496D8] flex items-center gap-1">
                      Details <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* City Announcements Column (1/3 width) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#123B63]">Municipal Updates</h3>
              <p className="text-xs text-slate-500">Live notices from City Hall</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              {CITY_ANNOUNCEMENTS.map((item) => (
                <div key={item.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-[#2496D8] border border-sky-100">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 hover:text-[#2496D8] transition-colors cursor-pointer">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={() => navigate('/queries')}
                  className="w-full text-center text-xs font-bold text-[#123B63] hover:text-[#2496D8] py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  View City Knowledge Base →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#123B63] text-base">Municipal Citizen Support</h3>
                  <p className="text-xs text-slate-500">24/7 Redressal Control Desks</p>
                </div>
              </div>
              <button
                onClick={() => setSupportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-800">Toll-Free City Grievance</p>
                  <p className="text-[11px] text-slate-500">Potholes, water, waste, lighting</p>
                </div>
                <a
                  href="tel:1913"
                  className="px-3 py-1.5 rounded-lg bg-[#2496D8] text-white text-xs font-bold hover:bg-[#1a82be]"
                >
                  Call 1913
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-800">Ward Councilor Office</p>
                  <p className="text-[11px] text-slate-500">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
                <a
                  href="tel:+914222300000"
                  className="px-3 py-1.5 rounded-lg bg-[#123B63] text-white text-xs font-bold hover:bg-[#0d2b4a]"
                >
                  Call Ward
                </a>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-rose-900">Emergency Police & Fire</p>
                  <p className="text-[11px] text-rose-600">Immediate public safety hazards</p>
                </div>
                <span className="font-mono font-bold text-rose-700 text-sm">112 / 100</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setSupportModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Close Support Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

