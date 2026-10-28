import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const MACRO_COLORS = {
  Protein: '#2D6A4F', // Forest green
  Carbs: '#EA580C',   // Amber orange
  Fat: '#D97706',     // Warm amber
  Fiber: '#059669',   // Emerald
};

export default function NutritionChart({ summary, detectedItems = [] }) {
  if (!summary) return null;

  const macroData = [
    { name: 'Protein', grams: summary.total_protein_g, calories: summary.total_protein_g * 4, color: MACRO_COLORS.Protein },
    { name: 'Carbs', grams: summary.total_carbs_g, calories: summary.total_carbs_g * 4, color: MACRO_COLORS.Carbs },
    { name: 'Fat', grams: summary.total_fat_g, calories: summary.total_fat_g * 9, color: MACRO_COLORS.Fat },
  ].filter(d => d.grams > 0);

  const totalMacroCal = macroData.reduce((acc, curr) => acc + curr.calories, 0) || 1;

  const pieData = macroData.map(d => ({
    name: d.name,
    value: Math.round((d.calories / totalMacroCal) * 100),
    grams: d.grams,
    color: d.color,
  }));

  const itemBarData = detectedItems.slice(0, 5).map(item => ({
    name: item.name.length > 18 ? item.name.slice(0, 16) + '...' : item.name,
    calories: Math.round(item.calories_kcal),
    protein: Math.round(item.protein_g),
    carbs: Math.round(item.carbs_g),
    fat: Math.round(item.fat_g),
  }));

  return (
    <div className="space-y-6">
      {/* Macronutrient Calorie Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-cream-50/70 p-4 rounded-2xl border border-cream-200">
        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val, name, item) => [
                  `${val}% (${item.payload.grams}g)`,
                  `${name} (% of calories)`
                ]}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#E5E0D5', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-slate-800 leading-none">
              {Math.round(summary.total_calories_kcal)}
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              kcal
            </span>
          </div>
        </div>

        {/* Legend / Stats */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Macronutrient Ratio (% of energy)
          </h4>
          {pieData.map((macro) => (
            <div key={macro.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                <span className="font-semibold text-slate-700">{macro.name}</span>
                <span className="text-slate-400">({macro.grams}g)</span>
              </div>
              <span className="font-bold text-slate-900">{macro.value}%</span>
            </div>
          ))}
          {summary.total_fiber_g > 0 && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-cream-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="font-semibold text-slate-700">Dietary Fiber</span>
              </div>
              <span className="font-bold text-slate-900">{summary.total_fiber_g}g</span>
            </div>
          )}
        </div>
      </div>

      {/* Component Calorie Comparison Bar Chart if detected items exist */}
      {itemBarData.length > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Calorie Contribution by Detected Component
          </h4>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={itemBarData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: '#4B5563' }} />
                <Tooltip
                  formatter={(val) => [`${val} kcal`, 'Calories']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#E5E0D5', fontSize: '12px' }}
                />
                <Bar dataKey="calories" fill="#2D6A4F" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
