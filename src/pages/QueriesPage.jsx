import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import { useNotification } from '../context/NotificationContext';
import {
  HelpCircle,
  Send,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Building2,
  ChevronDown
} from '../components/Icons';

export default function QueriesPage({ navigate }) {
  const { user } = useAuth();
  const { queries, submitQuery } = useComplaints();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history' | 'faqs'
  const [formData, setFormData] = useState({
    title: '',
    category: 'Water Supply',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Water Supply & Sewerage',
    'Electricity & Street Illumination',
    'Roads & Pedestrian Walkways',
    'Solid Waste & Sanitation',
    'Parks & Green Canopy',
    'Public Health & Vector Control',
    'Property Tax & Building Permits',
    'Civic Policy Suggestion'
  ];

  const faqs = [
    {
      q: 'What is the average grievance redressal timeframe in my city?',
      a: 'As per the City Citizen Charter, emergency electrical and water leaks are addressed within 12–24 hours. Road repairs and waste clearance typically take 24–48 hours depending on division work orders.'
    },
    {
      q: 'How are complaints routed to field engineers?',
      a: 'When you submit a complaint through Fix My City, the webhook API dispatches your report directly to the ward-level SNS Workbench. The automated dispatch system assigns the nearest available squad officer.'
    },
    {
      q: 'Can I upload photos of issues taken earlier from my phone gallery?',
      a: 'Yes, Fix My City supports JPG, JPEG, PNG, and WEBP formats directly from your device storage or camera.'
    },
    {
      q: 'How do I request a new street light or speed bump in my lane?',
      a: 'You can submit a formal request right here using the "Queries & Requests" submission form with the category set to "Roads & Pedestrian Walkways" or "Electricity & Street Illumination".'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast({
        title: 'Incomplete Query',
        message: 'Please provide both a subject title and detailed query description.',
        type: 'warning'
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitQuery({
        ...formData,
        citizenName: user?.name || 'Citizen Inquirer',
        citizenEmail: user?.email || 'citizen@fixmycity.org'
      });

      addToast({
        title: 'Query Submitted to Ward Office',
        message: 'Your inquiry has been logged and forwarded to municipal public relations.',
        type: 'success'
      });

      setFormData({
        title: '',
        category: 'Water Supply',
        description: ''
      });
      setActiveTab('history');
    } catch (err) {
      addToast({
        title: 'Submission Failed',
        message: 'Unable to forward query. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQueries = queries.filter(
    (q) =>
      !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#123B63] to-[#2496D8] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-slate-100 mb-2">
                <HelpCircle size={14} className="text-[#2EAD72]" />
                <span>Civic Assistance & Inquiry Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Queries & Civic Requests
              </h1>
              <p className="mt-1 text-sm text-slate-100 max-w-xl">
                Have questions about municipal services, water schedules, or want to suggest improvements for your locality? Submit them directly to city hall.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'new'
                ? 'border-[#123B63] text-[#123B63]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send size={16} />
            <span>Submit New Request</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-[#123B63] text-[#123B63]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare size={16} />
            <span>Query History ({queries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'faqs'
                ? 'border-[#123B63] text-[#123B63]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle size={16} />
            <span>Civic FAQs</span>
          </button>
        </div>

        {/* Tab 1: Submit New Query / Request */}
        {activeTab === 'new' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-[#123B63] mb-1">
              Ask City Hall or Request Assistance
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Inquiries are forwarded via the SNS Workbench webhook to the relevant ward council desk.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subject / Inquiry Topic <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Garbage collection truck timings on weekends"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2496D8] bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Department / Service Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#2496D8] bg-slate-50 focus:bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Message / Request <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain your query, request assistance, or provide specific suggestions for city authorities..."
                  className="w-full p-4 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2496D8] bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#123B63] hover:bg-[#0d2b4a] shadow-md transition-all flex items-center gap-2"
                >
                  {submitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Dispatch Query to City Desk</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Query History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search submitted queries..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            {filteredQueries.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                <p className="text-sm text-slate-500">No matching queries found.</p>
              </div>
            ) : (
              filteredQueries.map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#123B63] bg-slate-100 px-2 py-0.5 rounded">
                          {q.id}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {q.status}
                        </span>
                        <span className="text-xs text-slate-400">• {q.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{q.title}</h3>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(q.submitted_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{q.description}"
                  </p>

                  {q.response && (
                    <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs">
                      <span className="font-bold text-[#123B63] block mb-1">
                        Official Response ({q.answered_by}):
                      </span>
                      <p className="text-slate-700 leading-relaxed">{q.response}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2"
              >
                <h3 className="text-sm font-bold text-[#123B63] flex items-start gap-2">
                  <span className="text-[#2496D8] font-mono">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-slate-600 pl-5 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

