import React from 'react';
import {
  LayoutDashboard,
  Utensils,
  Apple,
  ShieldCheck,
  ChefHat,
  CalendarRange,
  History,
  Settings,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tag: null },
  { id: 'food', label: 'Food & Nutrition', icon: Utensils, tag: 'Core' },
  { id: 'freshness', label: 'Freshness Analysis', icon: Apple, tag: 'Visual' },
  { id: 'hygiene', label: 'Kitchen Hygiene', icon: ShieldCheck, tag: 'Video/Img' },
  { id: 'recipes', label: 'Cooking Assistant', icon: ChefHat, tag: 'Smart' },
  { id: 'meal-planner', label: 'Meal Planner', icon: CalendarRange, tag: '7-Day' },
  { id: 'history', label: 'Analysis History', icon: History, tag: null },
  { id: 'reports', label: 'Reports & Settings', icon: Settings, tag: null },
];

export default function Sidebar({
  activePage,
  setActivePage,
  isMobileOpen,
  setIsMobileOpen,
  systemHealth
}) {
  const isDemo = systemHealth?.is_demo_mode ?? true;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-cream-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-600 text-white flex items-center justify-center shadow-elevated">
              <Sparkles className="w-5 h-5 text-amberfood-300" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                Food Verse <span className="text-forest-600">AI</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Multimodal Food Agent
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-cream-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Intelligence Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-forest-600 text-white shadow-sm shadow-forest-600/30'
                    : 'text-slate-600 hover:text-forest-700 hover:bg-forest-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-forest-600'}`} />
                  <span>{item.label}</span>
                </div>

                {item.tag && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                      isActive
                        ? 'bg-forest-700 text-cream-100'
                        : 'bg-cream-200 text-slate-500'
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Mode Indicator */}
        <div className="p-4 border-t border-cream-200 bg-cream-50/60">
          <div className="p-3 rounded-xl bg-white border border-cream-200 text-xs space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                System Mode
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isDemo ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
                }`}
              />
            </div>

            <div className="text-slate-700 font-semibold flex items-center justify-between">
              <span>{isDemo ? 'Demo Mode' : 'Gemini AI Active'}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {isDemo ? 'v1.0 Demo' : systemHealth?.active_model || 'Gemini'}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              {isDemo
                ? 'Running with realistic sample profiles. Configure GEMINI_API_KEY for live analysis.'
                : 'Connected to official Google GenAI multimodal endpoint.'}
            </p>

            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest-600 hover:text-forest-700 hover:underline pt-1"
            >
              <span>Swagger API Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
