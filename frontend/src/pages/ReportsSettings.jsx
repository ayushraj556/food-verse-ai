import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Settings,
  ShieldAlert,
  Server,
  Database,
  Cpu,
  Key,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';
import DemoBadge from '../components/DemoBadge';

export default function ReportsSettings({ systemHealth, forceDemo, setForceDemo }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // API Key Verification Tool state
  const [inputKey, setInputKey] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleVerifyKey = async (e) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setVerifyResult({ valid: false, message: 'Please enter a Gemini API Key to test.' });
      return;
    }
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await api.verifyApiKey(inputKey.trim(), true);
      setVerifyResult(res);
      if (res.valid) {
        setInputKey('');
      }
    } catch (err) {
      setVerifyResult({ valid: false, message: err.message || 'API verification failed.' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Reports & System Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Export full analysis audit reports to CSV/JSON and review active system configuration.
        </p>
      </div>

      {/* Export Reports Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Analysis Data Export
              </h3>
              <p className="text-xs text-slate-500">
                Download verified historical analysis evaluations compiled directly from your local SQLite database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchStats}
            className="p-2 text-slate-400 hover:text-forest-600 rounded-lg hover:bg-cream-100"
            title="Refresh record counts"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Real Summary Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Records
            </span>
            <div className="text-xl font-extrabold text-slate-900">
              {stats?.total_analyses ?? 0}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Food Analyses
            </span>
            <div className="text-xl font-extrabold text-slate-900">
              {stats?.food_analyses_count ?? 0}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Freshness Checks
            </span>
            <div className="text-xl font-extrabold text-slate-900">
              {stats?.freshness_count ?? 0}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Hygiene Audits
            </span>
            <div className="text-xl font-extrabold text-slate-900">
              {stats?.hygiene_count ?? 0}
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={api.getExportUrl('csv')}
            download
            className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Spreadsheet</span>
          </a>

          <a
            href={api.getExportUrl('json')}
            download
            className="px-5 py-2.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-slate-800 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Structured JSON</span>
          </a>
        </div>
      </div>

      {/* Live API Key Configurator / Tester */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-50 text-forest-600 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Interactive Gemini API Key Verification
            </h3>
            <p className="text-xs text-slate-500">
              Connect or test your Google Gemini API key live. When verified, the system seamlessly transitions to live multimodal AI mode.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyKey} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste your Google Gemini API Key (e.g. AIzaSy...)"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-cream-300 focus:outline-hidden focus:border-forest-500 bg-cream-50/50 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Testing Key...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amberfood-300" />
                  <span>Verify & Connect Key</span>
                </>
              )}
            </button>
          </div>

          {verifyResult && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2 border ${
                verifyResult.valid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {verifyResult.valid ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <div>
                <span className="font-bold block">
                  {verifyResult.valid ? 'API Key Authenticated Successfully' : 'Authentication Failed'}
                </span>
                <p className="opacity-90">{verifyResult.message}</p>
                {verifyResult.valid && (
                  <span className="text-[11px] font-semibold text-emerald-700 block mt-1">
                    System Mode updated: {verifyResult.active_mode} ({verifyResult.model})
                  </span>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* System Settings & Diagnostics Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              System Diagnostics & Runtime Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Environment variables and model configuration verified against Google GenAI SDK.
            </p>
          </div>
        </div>

        <div className="divide-y divide-cream-200 text-xs">
          {/* API Key Status */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold text-slate-800 block">GEMINI_API_KEY</span>
                <span className="text-slate-400">Environment authentication key</span>
              </div>
            </div>
            <div>
              {systemHealth?.api_key_configured ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Key Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Not Provided (Demo Mode Active)
                </span>
              )}
            </div>
          </div>

          {/* Model Selection */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold text-slate-800 block">Multimodal Vision Model</span>
                <span className="text-slate-400">Configured model identifier</span>
              </div>
            </div>
            <span className="font-mono text-slate-700 bg-cream-100 px-2.5 py-1 rounded-md border border-cream-200">
              {systemHealth?.active_model || 'gemini-2.5-flash'}
            </span>
          </div>

          {/* Database */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold text-slate-800 block">Storage Engine</span>
                <span className="text-slate-400">Persistent relational database</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              SQLite (food_verse.db)
            </span>
          </div>

          {/* Upload Limit */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold text-slate-800 block">Max Upload Payload</span>
                <span className="text-slate-400">Safety boundary for image & video files</span>
              </div>
            </div>
            <span className="font-bold text-slate-800">
              {systemHealth?.max_upload_size_mb || 15} MB
            </span>
          </div>

          {/* Force Demo Override */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">Force Demo Mode Simulation</span>
              <span className="text-slate-400">Preview demo sample outputs without spending API tokens</span>
            </div>
            <button
              type="button"
              onClick={() => setForceDemo(!forceDemo)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                forceDemo
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-cream-100 text-slate-700 border-cream-300 hover:bg-cream-200'
              }`}
            >
              {forceDemo ? 'Force Demo ON' : 'Force Demo OFF'}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs text-slate-600 space-y-2">
          <span className="font-bold text-slate-800 block">How to configure your live Gemini API Key in `.env`:</span>
          <p>
            Create or edit <code className="font-mono bg-cream-200 px-1 py-0.5 rounded text-forest-800">backend/.env</code> with:
          </p>
          <pre className="p-2.5 rounded-lg bg-slate-900 text-amberfood-200 font-mono text-[11px]">
            GEMINI_API_KEY=your_actual_api_key_here
          </pre>
          <p>
            When restart occurs, Food Verse AI automatically switches into live AI Mode with zero code changes required.
          </p>
        </div>
      </div>
    </div>
  );
}
