import React, { useState } from 'react';
import {
  Utensils,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Layers,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { api } from '../api/client';
import ImageDropzone from '../components/ImageDropzone';
import NutritionChart from '../components/NutritionChart';
import DemoBadge from '../components/DemoBadge';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function FoodNutrition({ forceDemo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleImages = [
    {
      label: 'Salmon & Quinoa Bowl',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      name: 'salmon_bowl.jpg',
      type: 'image/jpeg'
    },
    {
      label: 'Avocado Toast & Egg',
      url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
      name: 'avocado_toast.jpg',
      type: 'image/jpeg'
    },
    {
      label: 'Chickpea Coconut Curry',
      url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
      name: 'curry_bowl.jpg',
      type: 'image/jpeg'
    }
  ];

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeFood(selectedFile, forceDemo);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze food image.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Food Recognition & Nutrition Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multimodal visual breakdown of multi-item meal plates, calorie estimations, and macronutrients.
          </p>
        </div>
        {result && (
          <DemoBadge isDemo={result.is_demo} modelUsed={result.model_used} />
        )}
      </div>

      {/* Main Upload & Trigger Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-forest-600" />
                <span>Upload Food Plate Image</span>
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
              sampleOptions={sampleImages}
              maxSizeMB={15}
            />

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <span className="font-semibold block">Analysis Failed</span>
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
                  <span>Segmenting Components...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amberfood-300" />
                  <span>Analyze Meal & Nutrition</span>
                </>
              )}
            </button>
          </div>

          <DisclaimerBanner type="nutrition" />
        </div>

        {/* Results Presentation Area */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Card */}
              <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-4">
                {/* Uploaded Evidence Image Preview */}
                {result.image_filename && (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
                    <img
                      src={api.getUploadUrl(result.image_filename)}
                      alt={result.food_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                      <div className="text-white space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amberfood-300 block">
                          Visual Input Inspected
                        </span>
                        <h4 className="font-bold text-sm sm:text-base leading-tight drop-shadow-sm">
                          {result.food_name}
                        </h4>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-start justify-between gap-3 pt-1">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600 bg-forest-50 px-2.5 py-0.5 rounded-md">
                      {result.category || 'General Dish'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                      {result.food_name}
                    </h3>
                  </div>
                  <DemoBadge isDemo={result.is_demo} modelUsed={result.model_used} />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {result.explanation}
                </p>

                {/* Dietary Tags */}
                {result.dietary_tags && result.dietary_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.dietary_tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-cream-100 text-slate-700 border border-cream-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Macro Metric Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-amberfood-50/60 border border-amberfood-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amberfood-700 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Calories
                    </span>
                    <div className="text-xl font-black text-slate-900">
                      {Math.round(result.nutrition_summary?.total_calories_kcal ?? 0)}
                      <span className="text-xs font-semibold text-slate-400 ml-1">kcal</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-forest-50/60 border border-forest-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5" /> Protein
                    </span>
                    <div className="text-xl font-black text-slate-900">
                      {(result.nutrition_summary?.total_protein_g ?? 0).toFixed(1)}
                      <span className="text-xs font-semibold text-slate-400 ml-1">g</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                      <Wheat className="w-3.5 h-3.5" /> Carbs
                    </span>
                    <div className="text-xl font-black text-slate-900">
                      {(result.nutrition_summary?.total_carbs_g ?? 0).toFixed(1)}
                      <span className="text-xs font-semibold text-slate-400 ml-1">g</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/40 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5" /> Total Fat
                    </span>
                    <div className="text-xl font-black text-slate-900">
                      {(result.nutrition_summary?.total_fat_g ?? 0).toFixed(1)}
                      <span className="text-xs font-semibold text-slate-400 ml-1">g</span>
                    </div>
                  </div>
                </div>

                {/* Portion & Confidence Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 border-t border-cream-200 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-slate-400" />
                    <span>Portion: <strong>{result.portion_size}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Visual Confidence: <strong>{Math.round((result.confidence_score || 0.85) * 100)}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Nutrition Charts */}
              <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft">
                <h4 className="text-sm font-bold text-slate-900 mb-4">
                  Macronutrient Energy Distribution
                </h4>
                <NutritionChart
                  summary={result.nutrition_summary}
                  detectedItems={result.detected_items}
                />
              </div>

              {/* Itemized Detected Ingredients / Components */}
              <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-forest-600" />
                    <span>Segmented Food Components ({result.detected_items?.length || 0})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Component Breakdown</span>
                </div>

                <div className="divide-y divide-cream-200">
                  {result.detected_items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">{item.name}</span>
                        <span className="text-[11px] text-slate-400">{item.portion}</span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="font-extrabold text-slate-900 block">
                          {Math.round(item.calories_kcal)} kcal
                        </span>
                        <span className="text-[10px] text-slate-400">
                          P: {item.protein_g}g | C: {item.carbs_g}g | F: {item.fat_g}g
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[380px] rounded-3xl bg-white border border-dashed border-cream-300 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-soft">
              <div className="w-16 h-16 rounded-2xl bg-cream-100 text-forest-600 flex items-center justify-center shadow-inner">
                <Utensils className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  No Food Image Analyzed Yet
                </h4>
                <p className="text-xs text-slate-500">
                  Select a food image on the left or click one of the instant sample dishes to preview multimodal nutritional analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
