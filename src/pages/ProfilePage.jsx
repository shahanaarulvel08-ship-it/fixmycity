import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { useNotification } from '../context/NotificationContext';
import {
  User,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  LogOut,
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink
} from '../components/Icons';

export default function ProfilePage({ navigate }) {
  const { user, logout, updateProfile } = useAuth();
  const { complaints } = useComplaints();
  const { addToast } = useNotification();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    phone: user?.phone || '',
    ward: user?.ward || 'Ward 14'
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setEditModalOpen(false);
    addToast({
      title: 'Profile Updated',
      message: 'Citizen information has been updated successfully.',
      type: 'success'
    });
  };

  const handleLogout = () => {
    logout();
    addToast({
      title: 'Signed Out',
      message: 'You have been logged out of Fix My City.',
      type: 'info'
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#123B63] to-[#2496D8]" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-sky-100 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2EAD72] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                ✓
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#123B63]">
                    {user?.name || 'Citizen User'}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                </div>

                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <button
                    onClick={() => {
                      setEditForm({
                        name: user?.name || '',
                        email: user?.email || '',
                        location: user?.location || '',
                        phone: user?.phone || '',
                        ward: user?.ward || 'Ward 14'
                      });
                      setEditModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center gap-1"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start text-xs">
                <span className="bg-sky-50 text-[#2496D8] px-3 py-1 rounded-full font-semibold border border-sky-100">
                  {user?.ward || 'Ward 14 (Central)'}
                </span>
                <span className="bg-emerald-50 text-[#2EAD72] px-3 py-1 rounded-full font-semibold border border-emerald-100">
                  ★ Verified Citizen Voter
                </span>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
                  Member since {user?.joinedDate || '2026'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Civilian Credentials */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#123B63] uppercase tracking-wider">
              Citizen Profile Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-0.5">FULL NAME</span>
                <span className="text-sm font-bold text-slate-800">{user?.name}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-0.5">EMAIL ID</span>
                <span className="text-sm font-bold text-slate-800">{user?.email}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-0.5">REGISTERED RESIDENCE / LOCATION</span>
                <span className="text-sm font-bold text-slate-800">{user?.location || 'Not Specified'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-bold block mb-0.5">CONTACT PHONE</span>
                <span className="text-sm font-bold text-slate-800">{user?.phone || '+91 98450 12345'}</span>
              </div>
            </div>
          </div>

          {/* Civic Participation Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#123B63] uppercase tracking-wider">
              Civic Impact Summary
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-center">
                <span className="text-2xl font-extrabold text-[#2496D8] block">
                  {complaints.length}
                </span>
                <span className="text-[11px] font-semibold text-slate-600">Total Grievances</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                <span className="text-2xl font-extrabold text-[#2EAD72] block">
                  {complaints.filter((c) => c.status === 'Resolved').length}
                </span>
                <span className="text-[11px] font-semibold text-slate-600">Resolved for City</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Citizen Trust Badge:</span>
                <span className="font-bold text-[#2EAD72]">Active Civic Champion</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Assigned Municipal Zone:</span>
                <span className="font-bold text-slate-800">Zone 3 (Central Urban)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Registered Ward Counselor:</span>
                <span className="font-bold text-slate-800">Councilor R. Thangavel</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/my-complaints')}
                className="w-full py-2.5 rounded-xl bg-[#123B63] hover:bg-[#0d2b4a] text-white text-xs font-bold transition-colors"
              >
                View Complaint History →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-scale-up">
            <h3 className="text-lg font-bold text-[#123B63] mb-4">Edit Citizen Profile</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2496D8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2496D8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Address
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2496D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2496D8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#123B63] hover:bg-[#0d2b4a] shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

