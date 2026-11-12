import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from './Icons';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  const typeConfig = {
    success: {
      border: 'border-emerald-500 bg-white text-emerald-900',
      icon: <CheckCircle2 className="text-emerald-500" size={20} />,
      progress: 'bg-emerald-500'
    },
    error: {
      border: 'border-rose-500 bg-white text-rose-900',
      icon: <AlertCircle className="text-rose-500" size={20} />,
      progress: 'bg-rose-500'
    },
    warning: {
      border: 'border-amber-500 bg-white text-amber-900',
      icon: <AlertTriangle className="text-amber-500" size={20} />,
      progress: 'bg-amber-500'
    },
    info: {
      border: 'border-sky-500 bg-white text-sky-900',
      icon: <Info className="text-sky-500" size={20} />,
      progress: 'bg-sky-500'
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type] || typeConfig.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white ${config.border} transform transition-all duration-300 animate-slide-in relative overflow-hidden`}
          >
            <div className="shrink-0 mt-0.5">{config.icon}</div>
            <div className="flex-1 text-sm">
              {toast.title && <h4 className="font-semibold text-slate-900 mb-0.5">{toast.title}</h4>}
              <p className="text-slate-600 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
              aria-label="Dismiss alert"
            >
              <X size={16} />
            </button>
            <div
              className={`absolute bottom-0 left-0 h-1 ${config.progress} animate-toast-timer`}
              style={{ animationDuration: `${toast.duration || 4500}ms` }}
            />
          </div>
        );
      })}
    </div>
  );
}

