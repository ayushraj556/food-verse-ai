import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Utensils,
  Apple,
  ShieldCheck,
  Trash2,
  ExternalLink,
  X,
  Clock,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/client';
import DemoBadge from '../components/DemoBadge';

export default function AnalysisHistory({ setActivePage }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getHistory(filterType, searchQuery);
      setHistoryItems(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterType, searchQuery]);

  const handleDelete = async (item) => {
    try {
      await api.deleteHistoryRecord(item.type, item.id);
      setHistoryItems(historyItems.filter((i) => !(i.type === item.type && i.id === item.id)));
      if (activeModalItem?.id === item.id && activeModalItem?.type === item.type) {
        setActiveModalItem(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Multimodal Analysis History
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, filter, inspect, and delete historical food, freshness, and kitchen hygiene records.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-cream-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Module Type Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Modules' },
            { id: 'food', label: 'Food Nutrition' },
            { id: 'freshness', label: 'Freshness' },
            { id: 'hygiene', label: 'Kitchen Hygiene' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'bg-cream-100 text-slate-600 hover:bg-cream-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by title..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-cream-300 focus:outline-hidden focus:border-forest-500 bg-cream-50/50"
          />
        </div>
      </div>

      {/* History Items List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <div className="w-6 h-6 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading audit log...
        </div>
      ) : historyItems.length > 0 ? (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-cream-200 hover:border-forest-300 shadow-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5 truncate">
                <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center shrink-0">
                  {item.type === 'food' && <Utensils className="w-5 h-5 text-amberfood-600" />}
                  {item.type === 'freshness' && <Apple className="w-5 h-5 text-emerald-600" />}
                  {item.type === 'hygiene' && <ShieldCheck className="w-5 h-5 text-blue-600" />}
                </div>

                <div className="truncate space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md">
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{item.summary}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-cream-200">
                <DemoBadge isDemo={item.is_demo} />
                <button
                  type="button"
                  onClick={() => setActiveModalItem(item)}
                  className="px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-forest-50 hover:text-forest-700 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-cream-300 text-center space-y-3">
          <History className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">No Records Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No historical analyses match your search criteria. Clear the search input to see all records.'
              : 'Execute an analysis in any module to record evaluation data in local storage.'}
          </p>
        </div>
      )}

      {/* Detail Inspection Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 border border-cream-200 shadow-elevated">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-md">
                  {activeModalItem.type.toUpperCase()} Record #{activeModalItem.id}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50">
                <span className="text-slate-500">Evaluated Timestamp:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(activeModalItem.created_at).toLocaleString()}
                </span>
              </div>

              {activeModalItem.image_filename && (
                <div className="space-y-1">
                  <span className="text-slate-500 block">Uploaded Evidence:</span>
                  <div className="rounded-xl overflow-hidden bg-slate-900 max-h-48 flex items-center justify-center">
                    <img
                      src={api.getUploadUrl(activeModalItem.image_filename)}
                      alt="Record attachment"
                      className="max-h-48 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Raw JSON detail dump */}
              <div className="space-y-1">
                <span className="text-slate-500 block font-semibold">Structured Inspection Metrics:</span>
                <pre className="p-3 rounded-xl bg-cream-100 text-[11px] font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(
                    {
                      metrics: activeModalItem.metrics,
                      details: activeModalItem.full_data,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-cream-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-slate-800 font-semibold text-xs"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
