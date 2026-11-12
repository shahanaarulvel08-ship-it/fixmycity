import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Activity } from './Icons';

export default function StatusBadge({ status, isMock = false }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Submitted':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-[#2496D8]',
          icon: <Clock size={13} className="text-[#2496D8]" />
        };
      case 'Under Review':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: <AlertTriangle size={13} className="text-amber-500" />
        };
      case 'In Progress':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-600',
          icon: <Activity size={13} className="text-indigo-600" />
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-[#2EAD72]',
          icon: <CheckCircle2 size={13} className="text-[#2EAD72]" />
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: <Clock size={13} className="text-slate-400" />
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.icon}
        <span>{status}</span>
      </span>

      {isMock ? (
        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
          Sample
        </span>
      ) : (
        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
          Live API
        </span>
      )}
    </div>
  );
}

