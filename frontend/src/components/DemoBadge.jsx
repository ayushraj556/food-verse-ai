import React from 'react';
import { Sparkles, Info, Cpu } from 'lucide-react';

export default function DemoBadge({ isDemo, modelUsed, className = "" }) {
  if (isDemo) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm ${className}`}>
        <Info className="w-3.5 h-3.5 text-amber-600" />
        <span>Demo Data</span>
        <span className="text-[10px] text-amber-700/80 font-normal hidden sm:inline">(Sample Profile)</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-50 text-forest-700 border border-forest-200 shadow-sm ${className}`}>
      <Cpu className="w-3.5 h-3.5 text-forest-600 animate-pulse" />
      <span>AI Mode</span>
      <span className="text-[10px] text-forest-600/80 font-mono hidden sm:inline">({modelUsed || 'Gemini'})</span>
    </div>
  );
}
