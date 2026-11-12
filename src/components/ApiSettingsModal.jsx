import React, { useState } from 'react';
import {
  DEFAULT_WEBHOOK_URL,
  TEST_WEBHOOK_URL,
  getWebhookConfig,
  saveWebhookConfig,
  testWebhookHealth
} from '../services/webhookService';
import { Settings, RefreshCw, CheckCircle2, AlertCircle, X, ExternalLink, ShieldCheck } from './Icons';

export default function ApiSettingsModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(getWebhookConfig());
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveWebhookConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testWebhookHealth(config.url);
    setTestResult(result);
    setTesting(false);
  };

  const handleSelectPreset = (url) => {
    const updated = { ...config, url };
    setConfig(updated);
    saveWebhookConfig(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scale-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2496D8]/10 text-[#2496D8] flex items-center justify-center border border-[#2496D8]/20">
              <Settings size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#123B63]">
                SNS Workbench Webhook Settings
              </h3>
              <p className="text-xs text-slate-500">
                Inspect, configure, and test API connectivity with the municipal agent backend.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Endpoint Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset(DEFAULT_WEBHOOK_URL)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  config.url === DEFAULT_WEBHOOK_URL
                    ? 'border-[#2496D8] bg-sky-50/50 text-[#123B63] font-bold shadow-sm ring-1 ring-[#2496D8]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">Production Webhook</span>
                  {config.url === DEFAULT_WEBHOOK_URL && (
                    <span className="text-[10px] bg-[#2496D8] text-white px-1.5 py-0.2 rounded font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate font-mono">
                  /webhook/3c4473e9-1031-48f3...
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(TEST_WEBHOOK_URL)}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  config.url === TEST_WEBHOOK_URL
                    ? 'border-[#2496D8] bg-sky-50/50 text-[#123B63] font-bold shadow-sm ring-1 ring-[#2496D8]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900">Test Webhook (n8n Draft)</span>
                  {config.url === TEST_WEBHOOK_URL && (
                    <span className="text-[10px] bg-[#2496D8] text-white px-1.5 py-0.2 rounded font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate font-mono">
                  /webhook-test/3c4473e9-1031-48f3...
                </p>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Webhook API Endpoint (POST)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  placeholder="https://api.agents.snsihub.ai/webhook/..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2496D8] bg-slate-50 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
                  <span>{testing ? 'Testing...' : 'Test Ping'}</span>
                </button>
              </div>
            </div>

            {/* Test Result Display */}
            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {testResult.success ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Webhook Connected Successfully (HTTP {testResult.status})</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-amber-600" />
                      <span>
                        Webhook Notice: HTTP {testResult.status || 'Offline'}
                      </span>
                    </>
                  )}
                </div>
                <p className="font-mono text-[11px] mt-1 bg-white/70 p-2 rounded border border-current/20 break-all">
                  {testResult.error || JSON.stringify(testResult.data || testResult.rawResponse)}
                </p>
                {testResult.isInactiveWorkflow && (
                  <p className="mt-1 text-[11px] text-amber-800">
                    💡 <strong>SNS Workbench note:</strong> The webhook workflow is currently inactive in n8n. In Fix My City, submissions are automatically saved to your local complaints ledger so your workflow is never interrupted!
                  </p>
                )}
              </div>
            )}

            {/* Expected JSON Schema Info */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-1.5 text-[11px]">
                <span>REQUIRED JSON PAYLOAD FORMAT</span>
                <span className="text-[#2496D8]">POST application/json</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-emerald-400 overflow-x-auto">{`{
  "name": "Citizen Name",
  "location": "Complaint Location",
  "email": "citizen@example.com",
  "image": "Uploaded Image URL or Base64 Data (or null)",
  "complaint": "Description of the complaint",
  "queries_and_requests": "Additional queries or requests",
  "submitted_at": "ISO Timestamp"
}`}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Zero sensitive API secrets exposed in client bundle</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#123B63] hover:bg-[#0d2b4a] text-white shadow-sm transition-all"
                >
                  {savedSuccess ? 'Saved ✓' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

