import React, { useEffect, useState } from 'react';
import {
  Utensils,
  Apple,
  ShieldCheck,
  ChefHat,
  CalendarRange,
  Flame,
  Activity,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { api } from '../api/client';
import DemoBadge from '../components/DemoBadge';

const CATEGORY_COLORS = ['#2D6A4F', '#40916C', '#52B788', '#EA580C', '#F97316', '#D97706'];

export default function Dashboard({ setActivePage, forceDemo }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Analyze Food & Nutrition',
      desc: 'Upload a meal to estimate calories and macros.',
      icon: Utensils,
      color: 'bg-forest-600 text-white',
      page: 'food',
    },
    {
      title: 'Check Food Freshness',
      desc: 'Screen produce for visible aging and safety.',
      icon: Apple,
      color: 'bg-amberfood-500 text-white',
      page: 'freshness',
    },
    {
      title: 'Inspect Kitchen Hygiene',
      desc: 'Scan prep area images or videos for hygiene risks.',
      icon: ShieldCheck,
      color: 'bg-emerald-700 text-white',
      page: 'hygiene',
    },
    {
      title: 'Generate 7-Day Meal Plan',
      desc: 'Build tailored daily schedules matching your goals.',
      icon: CalendarRange,
      color: 'bg-amber-600 text-white',
      page: 'meal-planner',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-700 via-forest-600 to-forest-800 text-white p-8 sm:p-10 shadow-elevated">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-amberfood-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multimodal Artificial Intelligence Platform</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Intelligent Food Analysis & Kitchen Safety
          </h2>
          <p className="text-sm text-forest-100 leading-relaxed">
            Welcome to Food Verse AI. Analyze food imagery for instant nutritional estimation,
            screen produce freshness, audit kitchen hygiene protocols, and generate balanced chef recipes.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActivePage('food')}
              className="px-5 py-2.5 rounded-xl bg-white text-forest-800 font-bold text-xs hover:bg-cream-100 transition-colors shadow-sm flex items-center gap-2"
            >
              <span>Start Food Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActivePage('recipes')}
              className="px-5 py-2.5 rounded-xl bg-forest-800/80 hover:bg-forest-800 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-2"
            >
              <ChefHat className="w-4 h-4 text-amberfood-300" />
              <span>Smart Recipe Assistant</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 rounded-full bg-forest-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Analyses</span>
            <Activity className="w-4 h-4 text-forest-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {loading ? '...' : stats?.total_analyses ?? 0}
          </div>
          <p className="text-[11px] text-slate-500">Multimodal scans executed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Food Analyses</span>
            <Utensils className="w-4 h-4 text-amberfood-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {loading ? '...' : stats?.food_analyses_count ?? 0}
          </div>
          <p className="text-[11px] text-slate-500">Nutrition & macro evaluations</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Calories</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {loading ? '...' : `${Math.round(stats?.avg_calories_kcal ?? 0)}`}
            <span className="text-xs font-semibold text-slate-400 ml-1">kcal</span>
          </div>
          <p className="text-[11px] text-slate-400 italic">Approx. sample average</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-cream-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Plans</span>
            <CalendarRange className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {loading ? '...' : stats?.meal_plans_count ?? 0}
          </div>
          <p className="text-[11px] text-slate-500">7-day tailored meal plans</p>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">Quick Access Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActivePage(action.page)}
                className="group p-5 rounded-2xl bg-white border border-cream-200 hover:border-forest-400 shadow-soft hover:shadow-elevated transition-all duration-200 text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-forest-700 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                  </div>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-forest-600 group-hover:translate-x-1 transition-transform">
                  <span>Open module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Distribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-cream-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Analyzed Categories</h3>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Distribution
              </span>
            </div>

            {stats?.category_distribution && stats.category_distribution.length > 0 ? (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.category_distribution}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" allowDecimals={false} hide />
                    <YAxis
                      dataKey="category"
                      type="category"
                      width={120}
                      tick={{ fontSize: 11, fill: '#4B5563' }}
                    />
                    <Tooltip
                      formatter={(val) => [`${val} analyses`, 'Count']}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#E5E0D5', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {stats.category_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-60 flex flex-col items-center justify-center text-center p-6 bg-cream-50/50 rounded-2xl border border-dashed border-cream-300">
                <Utensils className="w-8 h-8 text-cream-400 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No Food Records Yet</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Upload meal images in the Food & Nutrition module to build real category statistics.
                </p>
                <button
                  type="button"
                  onClick={() => setActivePage('food')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700"
                >
                  Analyze First Meal
                </button>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-4 border-t border-cream-200 pt-3">
            Real dynamic aggregates pulled directly from SQLite database.
          </p>
        </div>

        {/* Recent Multimodal Activity */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-cream-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Recent Analysis Timeline</h3>
              <button
                type="button"
                onClick={() => setActivePage('history')}
                className="text-xs font-semibold text-forest-600 hover:text-forest-700 hover:underline"
              >
                View all history
              </button>
            </div>

            {stats?.recent_activities && stats.recent_activities.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_activities.map((act) => (
                  <div
                    key={`${act.type}-${act.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-cream-50/60 hover:bg-cream-100/60 border border-cream-200 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3 truncate pr-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-cream-300 flex items-center justify-center shrink-0">
                        {act.type === 'food' && <Utensils className="w-4 h-4 text-amberfood-600" />}
                        {act.type === 'freshness' && <Apple className="w-4 h-4 text-emerald-600" />}
                        {act.type === 'hygiene' && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-800 block truncate">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-cream-300">
                        {act.status_or_metric}
                      </span>
                      <DemoBadge isDemo={act.is_demo} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-60 flex flex-col items-center justify-center text-center p-6 bg-cream-50/50 rounded-2xl border border-dashed border-cream-300">
                <Activity className="w-8 h-8 text-cream-400 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No Historical Records</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Your recent food inspections, freshness evaluations, and hygiene scans will populate here.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-cream-200 flex items-center justify-between text-xs text-slate-400">
            <span>Audit trail preserved in local storage.</span>
            <button
              type="button"
              onClick={fetchStats}
              className="text-forest-600 font-semibold hover:underline"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
