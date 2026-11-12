import React from 'react';
import { X, ExternalLink } from './Icons';

export default function ImagePreviewModal({ isOpen, onClose, imageSrc, title }) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-scale-up"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 text-white border-b border-slate-800">
          <span className="text-xs font-semibold truncate text-slate-300">
            {title || 'Complaint Photographic Evidence'}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={imageSrc}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Open full image in new tab"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-2 overflow-auto bg-black/40">
          <img
            src={imageSrc}
            alt="Evidence"
            className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

