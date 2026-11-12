import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, Lock, Eye, EyeOff, MapPin, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from '../components/Icons';

export default function RegisterPage({ navigate }) {
  const { register, loading } = useAuth();
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    termsAgreed: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email format (e.g. name@domain.com).';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.termsAgreed) {
      errs.termsAgreed = 'You must accept the Civic Charter to register.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register(formData);
      addToast({
        title: 'Account Created Successfully!',
        message: 'Welcome to Fix My City. Your citizen profile is active.',
        type: 'success'
      });
      navigate('/home');
    } catch (err) {
      addToast({
        title: 'Registration Error',
        message: err.message || 'Unable to register account. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#123B63]/10 to-transparent pointer-events-none" />
      <div className="absolute top-12 right-10 w-72 h-72 rounded-full bg-[#2496D8]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#2EAD72]/10 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo and Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#123B63] to-[#2496D8] shadow-lg shadow-[#123B63]/25 mb-4 transform hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-11 h-11 fill-none">
              <path d="M100 16 L164 42 C164 100 138 148 100 182 C62 148 36 100 36 42 Z" fill="#123B63" stroke="#2496D8" strokeWidth="6" />
              <rect x="58" y="92" width="16" height="42" rx="2" fill="#2496D8" />
              <path d="M92 70 L100 52 L108 70 V134 H92 Z" fill="#FFFFFF" />
              <circle cx="100" cy="80" r="4.5" fill="#123B63" />
              <rect x="126" y="84" width="18" height="50" rx="2" fill="#2496D8" />
              <circle cx="138" cy="138" r="22" fill="#2EAD72" stroke="#FFFFFF" strokeWidth="4" />
              <path d="M128 138 L135 145 L149 131" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B63] tracking-tight">
            Join Fix My City
          </h1>
          <p className="mt-2 text-sm text-[#5A6E85] font-medium">
            Register to report issues, track resolutions, and help your community.
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 relative">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  placeholder="e.g. Priyadharshini Raman"
                  className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
                    errors.name
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="citizen@example.com"
                  className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
                    errors.email
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Location (Ward / Area) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City / Area / Ward
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Ward 12, Gandhipuram"
                  className="block w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="At least 6 characters"
                  className={`block w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-colors ${
                    errors.password
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                  }}
                  placeholder="Repeat your password"
                  className={`block w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors ${
                    errors.confirmPassword
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] bg-slate-50/50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* Civic Pledge Checkbox */}
            <div className="pt-1">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAgreed}
                  onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                  className="h-4 w-4 mt-0.5 text-[#2496D8] focus:ring-[#2496D8] border-slate-300 rounded"
                />
                <span className="ml-2 block text-xs text-slate-600 leading-snug">
                  I agree to submit genuine civic reports in accordance with the{' '}
                  <span className="text-[#2496D8] font-semibold underline">Citizen Grievance Charter</span>.
                </span>
              </label>
              {errors.termsAgreed && (
                <p className="mt-1 text-xs text-rose-600">{errors.termsAgreed}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#123B63] hover:bg-[#0d2b4a] shadow-lg shadow-[#123B63]/20 transition-all"
              >
                {loading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Citizen Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-bold text-[#2496D8] hover:text-[#123B63] hover:underline transition-colors"
              >
                Sign In to Portal
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

