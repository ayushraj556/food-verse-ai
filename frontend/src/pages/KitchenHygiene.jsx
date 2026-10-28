import React, { useState } from 'react';
import {
  ShieldCheck,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  AlertCircle,
  HelpCircle,
  HandMetal,
  UserCheck,
  Sparkle,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/client';
import ImageDropzone from '../components/ImageDropzone';
import DemoBadge from '../components/DemoBadge';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function KitchenHygiene({ forceDemo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleKitchenMedia = [
    {
      label: 'Prep Kitchen (Clean Image)',
      url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80',
      name: 'kitchen_clean.jpg',
      type: 'image/jpeg'
    },
    {
      label: 'Commercial Line Cook',
      url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80',
      name: 'kitchen_line.jpg',
      type: 'image/jpeg'
    }
  ];

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeHygiene(selectedFile, forceDemo);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to inspect kitchen hygiene.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const getScoreBadge = (score) => {
    const s = (score || '').toLowerCase();
    if (s.includes('good') || s.includes('high') || s.includes('pass')) {
      return {
        label: 'Acceptable Sanitation Observed',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      };
    }
    if (s.includes('critical') || s.includes('hazard') || s.includes('poor')) {
      return {
        label: 'Critical Attention Required',
        bg: 'bg-rose-50 text-rose-800 border-rose-300',
      };
    }
    return {
      label: 'Moderate Concern Identified',
      bg: 'bg-amber-50 text-amber-900 border-amber-300',
    };
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Kitchen Hygiene & Sanitation Inspection
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Multimodal frame screening for food handler personal protective equipment, clean worktops, and cross-contamination hazards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-600" />
                <span>Upload Kitchen Image or Video</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">JPG, PNG or MP4</span>
            </div>

            <ImageDropzone
              onFileSelected={(file) => {
                setSelectedFile(file);
                setResult(null);
                setError(null);
              }}
              selectedFile={selectedFile}
              onClear={handleClear}
              isLoading={loading}
              acceptVideo={true}
              sampleOptions={sampleKitchenMedia}
              maxSizeMB={15}
            />

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <span className="font-semibold block">Inspection Error</span>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                !selectedFile || loading
                  ? 'bg-cream-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-forest-600 hover:bg-forest-700 text-white shadow-forest-700/20 hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Extracting Frames & Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amberfood-300" />
                  <span>Run Kitchen Hygiene Inspection</span>
                </>
              )}
            </button>
          </div>

          <DisclaimerBanner type="hygiene" />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Overall Score Card */}
              <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-5">
                {/* Media Preview */}
                {result.file_name && (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-900 shadow-inner flex items-center justify-center">
                    {result.media_type === 'video' ? (
                      <video
                        src={api.getUploadUrl(result.file_name)}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={api.getUploadUrl(result.file_name)}
                        alt="Kitchen area"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                      {result.media_type === 'video' ? 'Video Frame Analysis' : 'Station Still Frame'}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-start justify-between gap-3 pt-1">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Assessment Target
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                      Food Prep Station ({result.media_type.toUpperCase()})
                    </h3>
                  </div>
                  <DemoBadge isDemo={result.is_demo} modelUsed={result.model_used} />
                </div>

                {/* Score Hero Badge */}
                {(() => {
                  const badge = getScoreBadge(result.overall_hygiene_score);
                  return (
                    <div className={`p-4 rounded-2xl border flex items-center justify-between ${badge.bg}`}>
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 shrink-0" />
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider block opacity-75">
                            Visual Hygiene Rating
                          </span>
                          <span className="text-lg font-black tracking-tight block">
                            {result.overall_hygiene_score}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 shadow-xs">
                        {badge.label}
                      </span>
                    </div>
                  );
                })()}

                {/* 4 Core Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <HandMetal className="w-3.5 h-3.5 text-forest-600" />
                      Glove Usage
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      {result.gloves_observed}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-forest-600" />
                      Hair Restraint
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      {result.hair_covering_observed}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkle className="w-3.5 h-3.5 text-amberfood-600" />
                      Surface Cleanliness
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      {result.surface_cleanliness}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Cross-Contamination
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      {result.cross_contamination_risk}
                    </p>
                  </div>
                </div>
              </div>

              {/* Observations & Concerns Tabs / Lists */}
              <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-5">
                {/* Positive / Neutral Observations */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-forest-600" />
                    Observed Good Practices ({result.observations?.length || 0})
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {result.observations?.map((obs, i) => (
                      <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-forest-50/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-600 shrink-0 mt-1.5" />
                        <span>{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Concerns */}
                {result.concerns && result.concerns.length > 0 && (
                  <div className="pt-2 border-t border-cream-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      Sanitation Concerns ({result.concerns.length})
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {result.concerns.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-rose-50/50 text-rose-950">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {result.improvements && result.improvements.length > 0 && (
                  <div className="pt-2 border-t border-cream-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amberfood-700 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amberfood-600" />
                      Suggested Actionable Improvements ({result.improvements.length})
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-cream-50">
                          <span className="w-1.5 h-1.5 rounded-full bg-amberfood-600 shrink-0 mt-1.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stated Analysis Limitations */}
                {result.limitations && (
                  <div className="p-3.5 rounded-xl bg-cream-100 text-slate-600 text-xs flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-700">Visual Inspection Scope Limitations:</span>
                      <p>{result.limitations}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-3xl bg-white border border-dashed border-cream-300 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-soft">
              <div className="w-16 h-16 rounded-2xl bg-cream-100 text-forest-600 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  No Kitchen Station Inspected Yet
                </h4>
                <p className="text-xs text-slate-500">
                  Upload an image or short video of a prep station to screen for gloves, hairnets, board sanitation, and utensil hygiene.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
