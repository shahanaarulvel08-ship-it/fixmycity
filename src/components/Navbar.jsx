import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import {
  Home,
  AlertTriangle,
  FileText,
  HelpCircle,
  User,
  LogOut,
  Menu,
  X,
  Settings,
  ShieldCheck,
  ChevronDown
} from './Icons';

export default function Navbar({ currentPath, navigate, onOpenApiModal }) {
  const { user, logout } = useAuth();
  const { complaints } = useComplaints();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeCount = complaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'In Progress'
  ).length;

  const navLinks = [
    { path: '/home', label: 'Home', icon: <Home size={18} /> },
    { path: '/complaint', label: 'Submit Complaint', icon: <AlertTriangle size={18} /> },
    {
      path: '/my-complaints',
      label: 'My Complaints',
      icon: <FileText size={18} />,
      badge: activeCount > 0 ? activeCount : null
    },
    { path: '/queries', label: 'Queries & Requests', icon: <HelpCircle size={18} /> },
    { path: '/profile', label: 'Profile', icon: <User size={18} /> }
  ];

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNav('/home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#123B63] to-[#2496D8] p-0.5 shadow-md shadow-[#123B63]/20 flex items-center justify-center text-white transform group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-8 h-8 fill-none">
                <path d="M100 16 L164 42 C164 100 138 148 100 182 C62 148 36 100 36 42 Z" fill="#123B63" stroke="#2496D8" strokeWidth="6" />
                <rect x="58" y="92" width="16" height="42" rx="2" fill="#2496D8" />
                <path d="M92 70 L100 52 L108 70 V134 H92 Z" fill="#FFFFFF" />
                <circle cx="100" cy="80" r="4.5" fill="#123B63" />
                <rect x="126" y="84" width="18" height="50" rx="2" fill="#2496D8" />
                <circle cx="138" cy="138" r="22" fill="#2EAD72" stroke="#FFFFFF" strokeWidth="4" />
                <path d="M128 138 L135 145 L149 131" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-[#123B63]">
                  FIX MY <span className="text-[#2496D8]">CITY</span>
                </span>
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold bg-emerald-100 text-[#2EAD72] px-2 py-0.5 rounded-full border border-emerald-200">
                  Gov Civic-Tech
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Civilian Grievance & Municipal Redressal Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#123B63] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#123B63] hover:bg-slate-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-[#2EAD72] text-white'
                          : 'bg-[#2496D8] text-white'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls (API Settings, User Greeting, Logout) */}
          <div className="hidden md:flex items-center gap-3">
            {/* SNS Workbench Webhook Button */}
            <button
              onClick={onOpenApiModal}
              title="Configure & Test SNS Workbench Webhook"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-[#2496D8]/10 hover:text-[#2496D8] border border-slate-200 transition-colors"
            >
              <Settings size={15} />
              <span className="hidden lg:inline">SNS Webhook</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* User Profile Pill */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors text-left"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#2496D8]"
                  />
                  <div className="hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      {user.ward || 'Citizen'}
                    </p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleNav('/profile')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User size={15} className="text-[#2496D8]" />
                      <span>View Profile & Ward</span>
                    </button>
                    <button
                      onClick={() => handleNav('/my-complaints')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <FileText size={15} className="text-[#2496D8]" />
                      <span>Track Complaints ({complaints.length})</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#123B63] text-white hover:bg-[#0d2b4a] shadow-sm transition-colors"
              >
                Sign In
              </button>
            )}

            {user && (
              <button
                onClick={handleLogout}
                title="Logout from portal"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenApiModal}
              title="SNS Webhook Settings"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fade-in">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-3">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2496D8]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#123B63] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#2EAD72] text-white' : 'bg-[#2496D8] text-white'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                onOpenApiModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100"
            >
              <Settings size={18} className="text-[#2496D8]" />
              <span>Configure SNS Workbench Webhook</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout ({user.name.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#123B63] hover:bg-[#0d2b4a]"
              >
                Sign In to Citizen Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

