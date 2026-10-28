import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Clock,
  Users,
  Flame,
  ShieldAlert,
  Sparkles,
  Plus,
  X,
  Bookmark,
  Trash2,
  AlertCircle,
  UtensilsCrossed,
  Check
} from 'lucide-react';
import { api } from '../api/client';
import DemoBadge from '../components/DemoBadge';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function CookingAssistant({ forceDemo }) {
  const [ingredients, setIngredients] = useState(['Tofu', 'Broccoli', 'Garlic', 'Soy Sauce']);
  const [currentIngInput, setCurrentIngInput] = useState('');
  const [dietPref, setDietPref] = useState('Vegetarian');
  const [cuisine, setCuisine] = useState('Asian');
  const [maxTime, setMaxTime] = useState(25);
  const [servings, setServings] = useState(2);
  const [allergies, setAllergies] = useState('');

  const [loading, setLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'saved'
  const [error, setError] = useState(null);

  const fetchSaved = async () => {
    try {
      const list = await api.listRecipes();
      setSavedRecipes(list);
    } catch (err) {
      console.error('Failed to load saved recipes', err);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    const val = currentIngInput.trim();
    if (val && !ingredients.includes(val)) {
      setIngredients([...ingredients, val]);
      setCurrentIngInput('');
    }
  };

  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one available ingredient.');
      return;
    }
    setLoading(true);
    setError(null);

    const allergyList = allergies
      ? allergies.split(',').map((a) => a.trim()).filter(Boolean)
      : [];

    try {
      const recipe = await api.generateRecipe(
        {
          ingredients,
          diet_preference: dietPref,
          cuisine,
          max_time_min: maxTime,
          allergies: allergyList,
          servings,
        },
        forceDemo
      );
      setCurrentRecipe(recipe);
      fetchSaved();
    } catch (err) {
      setError(err.message || 'Failed to generate recipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await api.deleteRecipe(id);
      setSavedRecipes(savedRecipes.filter((r) => r.id !== id));
      if (currentRecipe?.id === id) {
        setCurrentRecipe(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header & Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Smart Cooking Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Turn your available fridge and pantry ingredients into delicious, chef-crafted recipes with safety notes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-cream-100 rounded-xl border border-cream-200">
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'generator'
                ? 'bg-white text-forest-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Recipe Generator
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('saved');
              fetchSaved();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-white text-forest-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Saved Recipes</span>
            <span className="px-1.5 py-0.2 bg-cream-200 text-slate-700 rounded-full text-[10px]">
              {savedRecipes.length}
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-forest-600" />
                <span>Pantry & Cooking Preferences</span>
              </h3>

              {/* Ingredients Tag Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Available Ingredients *
                </label>
                <form onSubmit={handleAddIngredient} className="flex gap-2">
                  <input
                    type="text"
                    value={currentIngInput}
                    onChange={(e) => setCurrentIngInput(e.target.value)}
                    placeholder="e.g. Chicken breast, Garlic, Olive oil..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-cream-300 focus:outline-hidden focus:border-forest-500 bg-cream-50/50"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-forest-600 text-white hover:bg-forest-700 transition-colors"
                    title="Add ingredient"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-forest-50 text-forest-800 border border-forest-200"
                    >
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(ing)}
                        className="text-forest-600 hover:text-rose-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Diet Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Dietary Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Vegetarian', 'Non-Vegetarian', 'Vegan'].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setDietPref(pref)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        dietPref === pref
                          ? 'bg-forest-600 text-white border-forest-600 shadow-sm'
                          : 'bg-cream-50 text-slate-700 border-cream-200 hover:bg-white'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Cuisine
                  </label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-cream-300 bg-cream-50/50 focus:outline-hidden focus:border-forest-500"
                  >
                    <option value="Any">Any Cuisine</option>
                    <option value="Asian">Asian Fusion</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Indian">Indian</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Max Time: {maxTime} min
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={maxTime}
                    onChange={(e) => setMaxTime(Number(e.target.value))}
                    className="w-full accent-forest-600 cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Allergies / Exclusions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Allergies & Avoidances (comma-separated)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Peanuts, Gluten, Dairy, Shellfish"
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
                    <span>Formulating Recipe...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amberfood-300" />
                    <span>Generate Tailored Recipe</span>
                  </>
                )}
              </button>
            </div>

            <DisclaimerBanner type="allergy" />
          </div>

          {/* Recipe Display Column */}
          <div className="lg:col-span-7">
            {currentRecipe ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-soft space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-md">
                          {currentRecipe.cuisine}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-cream-100 text-slate-600">
                          {currentRecipe.diet_type}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                        {currentRecipe.recipe_name}
                      </h3>
                    </div>
                    <DemoBadge isDemo={currentRecipe.is_demo} />
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-cream-50/70 border border-cream-200 flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-forest-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Time</span>
                        <span className="font-bold text-slate-800">
                          {currentRecipe.prep_time_min + currentRecipe.cook_time_min} mins
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-cream-50/70 border border-cream-200 flex items-center gap-2 text-xs">
                      <Users className="w-4 h-4 text-amberfood-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Servings</span>
                        <span className="font-bold text-slate-800">{currentRecipe.servings} portions</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-cream-50/70 border border-cream-200 flex items-center gap-2 text-xs">
                      <Flame className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Calories</span>
                        <span className="font-bold text-slate-800">
                          {Math.round(currentRecipe.estimated_nutrition?.calories_per_serving_kcal || 0)} kcal
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients List */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Ingredients & Measures
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {currentRecipe.ingredients?.map((ing, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-cream-50/60">
                          <Check className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                          <span>{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Step-by-Step Instructions
                    </h4>
                    <ol className="space-y-3 text-xs text-slate-700">
                      {currentRecipe.instructions?.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-cream-50/40">
                          <span className="w-5 h-5 rounded-full bg-forest-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Safety Notes */}
                  {currentRecipe.safety_notes && currentRecipe.safety_notes.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-1.5">
                      <span className="font-bold text-rose-900 block flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        Culinary Safety & Temperature Notes:
                      </span>
                      <ul className="space-y-1 text-rose-950">
                        {currentRecipe.safety_notes.map((sn, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                            <span>{sn}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[380px] rounded-3xl bg-white border border-dashed border-cream-300 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-soft">
                <div className="w-16 h-16 rounded-2xl bg-cream-100 text-forest-600 flex items-center justify-center shadow-inner">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1">
                  <h4 className="text-base font-bold text-slate-900">
                    No Recipe Generated Yet
                  </h4>
                  <p className="text-xs text-slate-500">
                    Input your pantry items and click Generate Tailored Recipe to formulate instructions and macros.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Saved Recipes Tab */
        <div className="space-y-4">
          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-3xl bg-white border border-cream-200 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md">
                        {r.cuisine}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteRecipe(r.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                        title="Delete recipe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {r.recipe_name}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {r.prep_time_min + r.cook_time_min}m
                      </span>
                      <span>•</span>
                      <span>{r.servings} servings</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 pt-1">
                      Ingredients: {r.ingredients?.slice(0, 4).join(', ')}...
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentRecipe(r);
                      setActiveTab('generator');
                    }}
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-cream-100 hover:bg-forest-50 hover:text-forest-700 text-slate-700 transition-colors"
                  >
                    View Full Recipe
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-dashed border-cream-300 text-center space-y-3">
              <ChefHat className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No Saved Recipes</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Generate recipes using the generator tab and they will automatically be preserved in your database.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
