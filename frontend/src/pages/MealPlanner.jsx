import React, { useState, useEffect } from 'react';
import {
  CalendarRange,
  Flame,
  Dumbbell,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  ChevronRight,
  BookOpen,
  Check
} from 'lucide-react';
import { api } from '../api/client';
import DemoBadge from '../components/DemoBadge';
import DisclaimerBanner from '../components/DisclaimerBanner';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanner({ forceDemo }) {
  const [dietPref, setDietPref] = useState('Balanced');
  const [targetGoal, setTargetGoal] = useState('Balanced Nutrition');
  const [cookingTime, setCookingTime] = useState('Under 30 mins');
  const [allergies, setAllergies] = useState('');
  const [customTitle, setCustomTitle] = useState('My 7-Day Personalized Wellness Plan');

  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [savedPlans, setSavedPlans] = useState([]);
  const [activeView, setActiveView] = useState('planner'); // 'planner' | 'saved_list'
  
  // Edit states
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [isEditingMeals, setIsEditingMeals] = useState(false);
  const [dayMealForm, setDayMealForm] = useState(null);
  const [error, setError] = useState(null);

  const fetchSavedPlans = async () => {
    try {
      const list = await api.listMealPlans();
      setSavedPlans(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSavedPlans();
  }, []);

  // When selected day or current plan changes, sync dayMealForm
  useEffect(() => {
    if (currentPlan?.plan_data?.[selectedDay]) {
      setDayMealForm(JSON.parse(JSON.stringify(currentPlan.plan_data[selectedDay])));
    } else {
      setDayMealForm(null);
    }
    setIsEditingMeals(false);
  }, [selectedDay, currentPlan]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    const allergyList = allergies
      ? allergies.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    try {
      const plan = await api.generateMealPlan(
        {
          title: customTitle,
          diet_preference: dietPref,
          target_goal: targetGoal,
          allergies: allergyList,
          daily_schedule: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
          cooking_time_pref: cookingTime,
        },
        forceDemo
      );
      setCurrentPlan(plan);
      setEditNotes(plan.notes || '');
      setSelectedDay('Monday');
      fetchSavedPlans();
    } catch (err) {
      setError(err.message || 'Failed to generate meal plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!currentPlan?.id) return;
    try {
      const updated = await api.updateMealPlan(currentPlan.id, {
        notes: editNotes,
        title: currentPlan.title,
      });
      setCurrentPlan(updated);
      setIsEditingNotes(false);
      fetchSavedPlans();
    } catch (err) {
      setError('Could not update meal plan notes.');
    }
  };

  const handleSaveMeals = async () => {
    if (!currentPlan?.id || !dayMealForm) return;
    try {
      const updatedPlanData = {
        ...currentPlan.plan_data,
        [selectedDay]: dayMealForm,
      };
      const updated = await api.updateMealPlan(currentPlan.id, {
        plan_data: updatedPlanData,
      });
      setCurrentPlan(updated);
      setIsEditingMeals(false);
      fetchSavedPlans();
    } catch (err) {
      setError('Could not save updated meal schedule.');
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      await api.deleteMealPlan(id);
      setSavedPlans(savedPlans.filter((p) => p.id !== id));
      if (currentPlan?.id === id) {
        setCurrentPlan(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dayData = currentPlan?.plan_data?.[selectedDay] || null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Personalized 7-Day Meal Planner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build, edit, and organize balanced weekly nutrition schedules tailored to your lifestyle.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-cream-100 rounded-xl border border-cream-200">
          <button
            type="button"
            onClick={() => setActiveView('planner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeView === 'planner'
                ? 'bg-white text-forest-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Planner
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView('saved_list');
              fetchSavedPlans();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeView === 'saved_list'
                ? 'bg-white text-forest-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Saved Plans</span>
            <span className="px-1.5 py-0.2 bg-cream-200 text-slate-700 rounded-full text-[10px]">
              {savedPlans.length}
            </span>
          </button>
        </div>
      </div>

      {activeView === 'planner' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-forest-600" />
                <span>Meal Plan Parameters</span>
              </h3>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Plan Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-cream-300 focus:outline-hidden focus:border-forest-500 bg-cream-50/50"
                />
              </div>

              {/* Diet Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Diet Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Balanced'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setDietPref(p)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        dietPref === p
                          ? 'bg-forest-600 text-white border-forest-600 shadow-sm'
                          : 'bg-cream-50 text-slate-700 border-cream-200 hover:bg-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Primary Nutrition Goal
                </label>
                <select
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/50 focus:outline-hidden focus:border-forest-500"
                >
                  <option value="Balanced Nutrition">Balanced Nutrition & Vitality</option>
                  <option value="High Protein">High Protein & Muscle Recovery</option>
                  <option value="Weight Management">Calorie-Conscious Weight Management</option>
                  <option value="Heart Health">Low-Sodium & Heart Health</option>
                </select>
              </div>

              {/* Cooking Time Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Available Prep & Cooking Time
                </label>
                <select
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/50 focus:outline-hidden focus:border-forest-500"
                >
                  <option value="Under 20 mins">Quick & Easy (Under 20 mins)</option>
                  <option value="Under 30 mins">Moderate (Under 30 mins)</option>
                  <option value="45+ mins">Weekend Gourmet / Batch Prep</option>
                </select>
              </div>

              {/* Allergies */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Allergies & Dislikes (comma-separated)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Peanuts, Shellfish, Lactose"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-cream-300 focus:outline-hidden focus:border-forest-500 bg-cream-50/50"
                />
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-md bg-forest-600 hover:bg-forest-700 text-white shadow-forest-700/20 hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Constructing 7-Day Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amberfood-300" />
                    <span>Generate 7-Day Plan</span>
                  </>
                )}
              </button>
            </div>

            <DisclaimerBanner type="nutrition" />
          </div>

          {/* Plan Display Column */}
          <div className="lg:col-span-7">
            {currentPlan ? (
              <div className="space-y-6 animate-fadeIn">
                {/* Header Card */}
                <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-md">
                        {currentPlan.target_goal}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                        {currentPlan.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <DemoBadge isDemo={currentPlan.is_demo} />
                      <button
                        type="button"
                        onClick={() => setIsEditingNotes(!isEditingNotes)}
                        className="p-1.5 rounded-lg border border-cream-300 hover:bg-cream-100 text-slate-600 text-xs flex items-center gap-1"
                        title="Edit plan notes"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Notes</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes / Edit */}
                  {isEditingNotes ? (
                    <div className="space-y-2 pt-2 border-t border-cream-200">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Edit Plan Notes & Instructions:
                      </label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows={3}
                        className="w-full p-2.5 text-xs rounded-xl border border-cream-300 focus:outline-hidden focus:border-forest-500"
                      />
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        className="px-3 py-1.5 rounded-lg bg-forest-600 text-white text-xs font-semibold hover:bg-forest-700 flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Notes</span>
                      </button>
                    </div>
                  ) : (
                    currentPlan.notes && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-cream-50 p-3 rounded-xl border border-cream-200">
                        {currentPlan.notes}
                      </p>
                    )
                  )}

                  {/* Day Pills Navigator */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = selectedDay === day;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                            isSelected
                              ? 'bg-forest-600 text-white shadow-sm'
                              : 'bg-cream-100 hover:bg-cream-200 text-slate-600'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Day Meals View */}
                {dayData ? (
                  <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-cream-200">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-extrabold text-slate-900">
                          {selectedDay} Schedule
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingMeals(!isEditingMeals)}
                          className="px-2.5 py-1 rounded-lg border border-cream-300 hover:bg-cream-100 text-[11px] font-semibold text-slate-600 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3 text-forest-600" />
                          <span>{isEditingMeals ? 'Cancel Edit' : 'Edit Day Meals'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <Flame className="w-3.5 h-3.5 text-rose-500" />
                          {Math.round(dayData.daily_calories_kcal || 0)} kcal
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <Dumbbell className="w-3.5 h-3.5 text-forest-600" />
                          {Math.round(dayData.daily_protein_g || 0)}g protein
                        </span>
                      </div>
                    </div>

                    {/* Meal Slots (View or Edit Form) */}
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((slotKey) => {
                      const meal = dayData[slotKey];
                      if (!meal && !isEditingMeals) return null;

                      if (isEditingMeals && dayMealForm) {
                        const curMeal = dayMealForm[slotKey] || {
                          name: '',
                          description: '',
                          estimated_calories_kcal: 0,
                          protein_g: 0,
                        };
                        return (
                          <div
                            key={slotKey}
                            className="p-4 rounded-2xl bg-cream-50 border border-forest-300 space-y-3"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-white px-2 py-0.5 rounded-md border border-cream-200 inline-block">
                              Edit {slotKey}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={curMeal.name}
                                onChange={(e) => {
                                  setDayMealForm({
                                    ...dayMealForm,
                                    [slotKey]: { ...curMeal, name: e.target.value },
                                  });
                                }}
                                placeholder="Meal name"
                                className="px-3 py-1.5 text-xs rounded-lg border border-cream-300 bg-white"
                              />
                              <input
                                type="number"
                                value={curMeal.estimated_calories_kcal}
                                onChange={(e) => {
                                  setDayMealForm({
                                    ...dayMealForm,
                                    [slotKey]: {
                                      ...curMeal,
                                      estimated_calories_kcal: Number(e.target.value),
                                    },
                                  });
                                }}
                                placeholder="Calories (kcal)"
                                className="px-3 py-1.5 text-xs rounded-lg border border-cream-300 bg-white"
                              />
                            </div>
                            <textarea
                              value={curMeal.description}
                              onChange={(e) => {
                                setDayMealForm({
                                  ...dayMealForm,
                                  [slotKey]: { ...curMeal, description: e.target.value },
                                });
                              }}
                              rows={2}
                              placeholder="Meal description / ingredients"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-cream-300 bg-white"
                            />
                          </div>
                        );
                      }

                      return (
                        <div
                          key={slotKey}
                          className="p-4 rounded-2xl bg-cream-50/60 border border-cream-200 hover:border-forest-300 transition-colors space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-white px-2 py-0.5 rounded-md border border-cream-200">
                              {slotKey}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {Math.round(meal.estimated_calories_kcal)} kcal | {meal.protein_g}g P
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-900">{meal.name}</h5>
                          <p className="text-xs text-slate-500 leading-relaxed">{meal.description}</p>
                        </div>
                      );
                    })}

                    {isEditingMeals && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveMeals}
                          className="px-4 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save {selectedDay} Changes</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-cream-200">
                    No meal data recorded for this day.
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[380px] rounded-3xl bg-white border border-dashed border-cream-300 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-soft">
                <div className="w-16 h-16 rounded-2xl bg-cream-100 text-forest-600 flex items-center justify-center shadow-inner">
                  <CalendarRange className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1">
                  <h4 className="text-base font-bold text-slate-900">
                    No Weekly Plan Active
                  </h4>
                  <p className="text-xs text-slate-500">
                    Select your diet target and click Generate 7-Day Plan to structure breakfast, lunch, dinner, and snacks for each day.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Saved Plans List View */
        <div className="space-y-4">
          {savedPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlans.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-white border border-cream-200 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md">
                        {p.target_goal}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(p.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                        title="Delete meal plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {p.title}
                    </h4>

                    <p className="text-xs text-slate-500">
                      Diet: {p.diet_preference} • {Object.keys(p.plan_data || {}).length} Days Planned
                    </p>

                    {p.notes && (
                      <p className="text-xs text-slate-600 line-clamp-2 pt-1">{p.notes}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPlan(p);
                      setEditNotes(p.notes || '');
                      setActiveView('planner');
                    }}
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-cream-100 hover:bg-forest-50 hover:text-forest-700 text-slate-700 transition-colors"
                  >
                    Open & Review Plan
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-dashed border-cream-300 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No Saved Meal Plans</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Generate plans using the active planner tab and they will be safely preserved in your SQLite storage.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
