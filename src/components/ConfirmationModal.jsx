import React from 'react';
import { AlertTriangle, MapPin, Mail, User, FileText, Check, X, Camera } from './Icons';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  formData,
  submitting
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#123B63]">
                Confirm Complaint Submission
              </h3>
              <p className="text-xs text-slate-500">
                Please verify your details before sending to the municipal portal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Recap */}
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <User size={14} className="text-[#2496D8]" />
                <span className="font-semibold uppercase tracking-wider">Citizen Name</span>
              </div>
              <p className="font-bold text-slate-800 truncate">{formData.name}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Mail size={14} className="text-[#2496D8]" />
                <span className="font-semibold uppercase tracking-wider">Email Address</span>
              </div>
              <p className="font-bold text-slate-800 truncate">{formData.email}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <MapPin size={14} className="text-[#2496D8]" />
              <span className="font-semibold uppercase tracking-wider">Incident Location</span>
            </div>
            <p className="font-bold text-slate-800">{formData.location}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <FileText size={14} className="text-[#2496D8]" />
              <span className="font-semibold uppercase tracking-wider">Complaint Description</span>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {formData.complaint}
            </p>
          </div>

          {formData.queries_and_requests && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <span className="text-[#2EAD72] font-bold">?</span>
                <span className="font-semibold uppercase tracking-wider">Additional Queries & Requests</span>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed max-h-24 overflow-y-auto text-xs">
                {formData.queries_and_requests}
              </p>
            </div>
          )}

          {formData.image ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                <Camera size={14} className="text-[#2496D8]" />
                <span className="font-semibold uppercase tracking-wider">Attached Image</span>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-900 flex items-center justify-center">
                <img
                  src={formData.image}
                  alt="Complaint Preview"
                  className="max-h-48 object-contain w-full"
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic px-1">
              No photo attached (optional image omitted).
            </div>
          )}

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-800 flex items-start gap-2">
            <span className="font-bold text-[#2496D8]">ℹ</span>
            <span>
              By clicking "Confirm & Submit", your grievance data will be transmitted via HTTPS POST to the SNS Workbench municipal agent webhook.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-2 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
          >
            Edit Details
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2EAD72] hover:bg-[#269360] text-white shadow-md shadow-[#2EAD72]/25 transition-all flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Transmitting to Webhook...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Confirm & Submit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

