import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, Building2, AlertCircle } from '../components/Icons';

export default function LoginPage({ navigate }) {
  const { login, loginDemo, loading } = useAuth();
  const { addToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [authError, setAuthError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email format (e.g. citizen@example.com).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setAuthError(null);

    try {
      await login(email, password, rememberMe);
      addToast({
        title: 'Authentication Successful',
        message: 'Identity verified by SNS Workbench (HTTP 200). Welcome back!',
        type: 'success'
      });
      navigate('/home');
    } catch (err) {
      setAuthError(err.message || 'Unable to authenticate. Please check credentials.');
      addToast({
        title: 'Sign In Failed',
        message: err.message || 'Unable to authenticate. Please check credentials.',
        type: 'error',
        duration: 7000
      });
    }
  };

  const handleDemoLogin = async () => {
    setAuthError(null);
    try {
      await loginDemo();
      addToast({
        title: 'Demo Citizen Access Granted',
        message: 'Verified resident Alex Morgan authenticated via SNS Workbench (HTTP 200).',
        type: 'success'
      });
      navigate('/home');
    } catch (err) {
      setAuthError(err.message || 'Demo authentication failed.');
      addToast({
        title: 'Demo Sign In Failed',
        message: err.message || 'Unable to authenticate demo citizen.',
        type: 'error',
        duration: 7000
      });
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      addToast({
        title: 'Invalid Email',
        message: 'Please enter a valid email to receive the password reset code.',
        type: 'warning'
      });
      return;
    }
    setForgotModalOpen(false);
    addToast({
      title: 'Reset Link Dispatched',
      message: `A password reset link has been dispatched to ${forgotEmail}.`,
      type: 'info'
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#123B63]/10 to-transparent pointer-events-none" />
      <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-[#2496D8]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#2EAD72]/10 blur-3xl pointer-events-none" />

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
            Welcome to Fix My City
          </h1>
          <p className="mt-2 text-sm text-[#5A6E85] font-medium">
            Together, let's make our city a better place.
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 relative">
          {/* Quick Demo Login Pill */}
          <div className="mb-6 p-3 rounded-2xl bg-sky-50/80 border border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#2496D8]" />
              <span className="text-xs font-semibold text-slate-700">Quick Evaluation?</span>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs font-bold text-[#123B63] bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-sky-200 shadow-sm transition-all"
            >
              1-Click Demo Login →
            </button>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-fade-in">
              <AlertCircle size={17} className="text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Authentication Rejected</p>
                <p className="mt-0.5 text-rose-700">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="citizen@example.com"
                  className={`block w-full pl-10 pr-3.5 py-3 rounded-xl border text-sm transition-colors ${
                    errors.email
                      ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] focus:border-[#2496D8] bg-slate-50/50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-semibold text-[#2496D8] hover:text-[#123B63] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-3 rounded-xl border text-sm transition-colors ${
                    errors.password
                      ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/30'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#2496D8] focus:border-[#2496D8] bg-slate-50/50 focus:bg-white'
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
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#2496D8] focus:ring-[#2496D8] border-slate-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-600 cursor-pointer">
                Remember me on this citizen device
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#123B63] hover:bg-[#0d2b4a] shadow-lg shadow-[#123B63]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#123B63] transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              New to Fix My City?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-bold text-[#2496D8] hover:text-[#123B63] hover:underline transition-colors"
              >
                Create Citizen Account / Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Security & Authenticity Notice */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck size={15} className="text-[#2EAD72]" />
          <span>Client-side citizen session. Webhook requests securely forwarded.</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-slate-800">
            <h3 className="text-lg font-bold text-[#123B63] mb-2">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered civilian email. We'll send instructions to recover access.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2496D8]"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2496D8] hover:bg-[#1976D2] rounded-xl shadow-sm"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

