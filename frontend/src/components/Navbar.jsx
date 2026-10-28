import React from 'react';
import { Menu, Sparkles, Cpu, ToggleLeft, ToggleRight, Wifi, WifiOff } from 'lucide-react';

const PAGE_HEADERS = {
  dashboard: {
    title: 'Executive Food Intelligence Dashboard',
    subtitle: 'Unified multimodal analysis overview, category insights, and recent activity'
  },
  food: {
    title: 'Food Recognition & Nutrition Analysis',
    subtitle: 'Segment multi-item plates, estimate macronutrients, and analyze portion sizes'
  },
  freshness: {
    title: 'Food Freshness Screening',
    subtitle: 'Evaluate visible ripening, degradation, and safety guidance for produce and items'
  },
  hygiene: {
    title: 'Kitchen Hygiene & Sanitation Inspection',
    subtitle: 'Visual screening for glove usage, hair restraints, and surface contamination'
  },
  recipes: {
    title: 'Smart Cooking Assistant',
    subtitle: 'Generate tailored culinary recipes from available ingredients and dietary restrictions'
  },
  'meal-planner': {
    title: 'Personalized 7-Day Meal Planner',
    subtitle: 'Custom daily nutrition schedules tailored to your lifestyle and caloric targets'
  },
  history: {
    title: 'Multimodal Analysis History',
    subtitle: 'Searchable audit log and deep-dive inspections of all saved evaluations'
  },
  reports: {
    title: 'Reports & System Settings',
    subtitle: 'Export comprehensive analysis records and inspect system configuration'
  }
};

export default function Navbar({
  activePage,
  onOpenMobile,
  systemHealth,
  forceDemo,
  setForceDemo
}) {
  const headerInfo = PAGE_HEADERS[activePage] || PAGE_HEADERS.dashboard;
  const isDemo = forceDemo || (systemHealth?.is_demo_mode ?? true);
  const isOnline = systemHealth?.database_connected ?? false;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-cream-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-cream-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {headerInfo.title}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            {headerInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Connectivity Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cream-100 text-slate-600 border border-cream-200">
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="hidden md:inline">API Online</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="hidden md:inline text-rose-600">API Offline</span>
            </>
          )}
        </div>

        {/* Demo Mode Toggle Button */}
        <button
          type="button"
          onClick={() => setForceDemo(!forceDemo)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isDemo
              ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              : 'bg-forest-50 text-forest-800 border-forest-200 hover:bg-forest-100'
          }`}
          title="Toggle between Demo Sample Mode and Live Gemini AI Mode"
        >
          {isDemo ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Demo Mode: Active</span>
              <span className="sm:hidden">Demo</span>
            </>
          ) : (
            <>
              <Cpu className="w-3.5 h-3.5 text-forest-600" />
              <span className="hidden sm:inline">Live AI: Active</span>
              <span className="sm:hidden">AI</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
