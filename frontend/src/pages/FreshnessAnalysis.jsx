import React, { useState } from 'react';
import {
  Apple,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Sparkles,
  AlertCircle,
  Info,
  ThermometerSnowflake,
  Lightbulb
} from 'lucide-react';
import { api } from '../api/client';
import ImageDropzone from '../components/ImageDropzone';
import DemoBadge from '../components/DemoBadge';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function FreshnessAnalysis({ forceDemo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleProduce = [
    {
      label: 'Fresh Strawberries',
      url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
      name: 'fresh_strawberries.jpg',
      type: 'image/jpeg'
    },
    {
      label: 'Ripe Bananas',
      url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
      name: 'ripe_bananas.jpg',
      type: 'image/jpeg'
    },
    {
      label: 'Questionable Produce',
      url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
      name: 'aging_carrots.jpg',
      type: 'image/jpeg'
    }
  ];

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeFreshness(selectedFile, forceDemo);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze freshness.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  // Status visual mapping
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Fresh':
        return {
          icon: CheckCircle,
          label: 'Fresh & Optimal',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500'
        };
      case 'Moderately Fresh':
        return {
          icon: AlertTriangle,
          label: 'Moderately Fresh (Ripe)',
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-500'
        };
      case 'Possibly Spoiled':
      default:
        return {
          icon: XCircle,
          label: 'Possibly Spoiled – Caution',
          bg: 'bg-rose-50 text-rose-900 border-rose-300',
          dot: 'bg-rose-500'
        };
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Produce & Food Freshness Screening
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detect visible surface dehydration, ripening speckles, mold colonies, and bruising.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-600" />
                <span>Upload Food or Produce Image</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">JPG, PNG, WEBP</span>
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
              sampleOptions={sampleProduce}
              maxSizeMB={15}
            />

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <span className="font-semibold block">Freshness Scan Error</span>
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
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20 hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Visual Surface...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amberfood-300" />
                  <span>Run Freshness Screening</span>
                </>
              )}
            </button>
          </div>

          <DisclaimerBanner type="freshness" />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Primary Assessment Card */}
              <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Inspected Item
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                      {result.item_name}
                    </h3>
                  </div>
                  <DemoBadge isDemo={result.is_demo} modelUsed={result.model_used} />
                </div>

                {/* Status Hero Badge */}
                {(() => {
                  const statusInfo = getStatusBadge(result.freshness_status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <div className={`p-4 rounded-2xl border flex items-center justify-between ${statusInfo.bg}`}>
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-6 h-6 shrink-0" />
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider block opacity-75">
                            Status Verdict
                          </span>
                          <span className="text-lg font-black tracking-tight block">
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="opacity-75 block">Certainty</span>
                        <span className="font-bold">{result.confidence_level} Confidence</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Safety Guidance Callout */}
                <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amberfood-600" />
                    Safety Guidance & Consumption Advice:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {result.safety_guidance}
                  </p>
                </div>

                {/* Storage Tip */}
                {result.storage_tip && (
                  <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200 text-xs flex items-start gap-2.5">
                    <ThermometerSnowflake className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-forest-900 block mb-0.5">Recommended Storage Condition</span>
                      <p className="text-forest-800">{result.storage_tip}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Observed Visual Indicators */}
              <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amberfood-600" />
                  <span>Observed Visual Indicators ({result.visual_indicators?.length || 0})</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.visual_indicators?.map((indicator, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-2 rounded-xl bg-cream-50/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600 shrink-0 mt-1.5" />
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Actionable Handling Recommendations
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-3xl bg-white border border-dashed border-cream-300 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-soft">
              <div className="w-16 h-16 rounded-2xl bg-cream-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <Apple className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  No Produce Screened Yet
                </h4>
                <p className="text-xs text-slate-500">
                  Upload an image of fruit, vegetables, or perishables to inspect for aging markers, softening, or spoilage indicators.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
