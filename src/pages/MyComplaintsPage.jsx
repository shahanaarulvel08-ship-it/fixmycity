import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import StatusBadge from '../components/StatusBadge';
import ImagePreviewModal from '../components/ImagePreviewModal';
import {
  FileText,
  Search,
  Filter,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  User,
  ArrowRight,
  Plus,
  Camera,
  ExternalLink
} from '../components/Icons';

export default function MyComplaintsPage({ navigate }) {
  const { complaints } = useComplaints();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState('');
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);

  const statuses = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved'];

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.id.toLowerCase().includes(query) ||
      c.complaint.toLowerCase().includes(query) ||
      c.location.toLowerCase().includes(query) ||
      (c.category && c.category.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const getTimelineSteps = (complaint) => {
    const defaultSteps = [
      { key: 'Submitted', label: 'Complaint Logged' },
      { key: 'Under Review', label: 'Ward Inspection' },
      { key: 'In Progress', label: 'Work In Progress' },
      { key: 'Resolved', label: 'Issue Resolved' }
    ];

    const currentIdx = defaultSteps.findIndex((s) => s.key === complaint.status);
    return defaultSteps.map((step, idx) => ({
      ...step,
      isCompleted: idx <= (currentIdx === -1 ? 0 : currentIdx),
      isCurrent: idx === currentIdx
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#2496D8] border border-sky-100">
                Civic Redressal Ledger
              </span>
              <span className="text-xs text-slate-400">• Total: {complaints.length} Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123B63] tracking-tight">
              My Submitted Complaints
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              Track real-time municipal inspection progress, assigned division engineers, and resolution updates.
            </p>
          </div>

          <button
            onClick={() => navigate('/complaint')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#123B63] hover:bg-[#0d2b4a] text-white font-bold text-sm shadow-md transition-all shrink-0"
          >
            <Plus size={18} className="text-[#2496D8]" />
            <span>New Complaint</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {statuses.map((status) => {
              const count =
                status === 'All'
                  ? complaints.length
                  : complaints.filter((c) => c.status === status).length;
              const isActive = statusFilter === status;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#123B63] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#2496D8] text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, street..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2496D8] bg-slate-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Complaints List Grid */}
        {filteredComplaints.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-sky-50 text-[#2496D8] flex items-center justify-center mx-auto mb-4">
              <FileText size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Complaints Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              {searchQuery || statusFilter !== 'All'
                ? 'No complaints match your active filter criteria. Try resetting the filters.'
                : "You haven't reported any public issues yet. Spotted a pothole, street light problem, or water leak?"}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {(searchQuery || statusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setStatusFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Reset Filters
                </button>
              )}
              <button
                onClick={() => navigate('/complaint')}
                className="px-5 py-2 text-xs font-bold text-white bg-[#123B63] hover:bg-[#0d2b4a] rounded-xl shadow-sm"
              >
                Register First Complaint →
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredComplaints.map((item) => {
              const isExpanded = expandedComplaintId === item.id;
              const timelineSteps = getTimelineSteps(item);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Top Bar inside Card */}
                  <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-extrabold text-[#123B63] bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                        {item.id}
                      </span>
                      <StatusBadge status={item.status} isMock={item.is_mock} />
                      {item.category && (
                        <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={14} />
                      <span>
                        Reported on{' '}
                        {new Date(item.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Description & Location (2/3) */}
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Issue Description
                        </h4>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {item.complaint}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                        <MapPin size={16} className="text-[#2496D8] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                            Location
                          </span>
                          <span className="text-xs text-slate-800 font-medium">{item.location}</span>
                        </div>
                      </div>

                      {item.queries_and_requests && (
                        <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 block mb-0.5">
                            Additional Queries / Citizen Requests
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {item.queries_and_requests}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Evidence Photo & Officer Assignment (1/3) */}
                    <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                      {item.image ? (
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Photographic Evidence
                          </span>
                          <div
                            onClick={() => {
                              setSelectedImage(item.image);
                              setSelectedImageTitle(`${item.id} - ${item.category || 'Evidence'}`);
                            }}
                            className="relative group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video max-h-40"
                          >
                            <img
                              src={item.image}
                              alt="Complaint Evidence"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                              <ExternalLink size={14} />
                              <span>View Full Size</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                          <Camera size={20} className="mx-auto mb-1 text-slate-300" />
                          <span>No photo attached</span>
                        </div>
                      )}

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between text-slate-500">
                          <span>Division:</span>
                          <span className="font-medium text-slate-800 text-right truncate max-w-[140px]">
                            {item.assigned_dept || 'Municipal Works Cell'}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Officer:</span>
                          <span className="font-medium text-slate-800 text-right truncate max-w-[140px]">
                            {item.officer || 'Ward Inspection Squad'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Stepper Bar */}
                  <div className="p-5 sm:p-6 pt-4 bg-slate-50 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                      Resolution Lifecycle
                    </span>

                    <div className="grid grid-cols-4 gap-2 relative">
                      {timelineSteps.map((step, idx) => (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                              step.isCompleted
                                ? 'bg-[#2EAD72] text-white shadow-xs'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            {step.isCompleted ? <CheckCircle2 size={15} /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] font-semibold leading-tight ${
                              step.isCompleted ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage}
        title={selectedImageTitle}
      />
    </div>
  );
}

