const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleResponse(res) {
  if (!res.ok) {
    let errorDetail = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = await res.text();
    }
    throw new Error(errorDetail || 'Request failed');
  }
  return res.json();
}

export const api = {
  baseUrl: API_BASE_URL,

  getUploadUrl(filename) {
    if (!filename) return null;
    if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
    return `${API_BASE_URL}/uploads/${filename}`;
  },

  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return handleResponse(res);
  },

  async getStats() {
    const res = await fetch(`${API_BASE_URL}/api/stats`);
    return handleResponse(res);
  },

  async verifyApiKey(apiKey, apply = true) {
    const res = await fetch(`${API_BASE_URL}/api/settings/verify-api-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, apply }),
    });
    return handleResponse(res);
  },

  // Food Analysis
  async analyzeFood(file, forceDemo = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('force_demo', String(forceDemo));
    const res = await fetch(`${API_BASE_URL}/api/food/analyze`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  async getFoodAnalysis(id) {
    const res = await fetch(`${API_BASE_URL}/api/food/${id}`);
    return handleResponse(res);
  },

  // Freshness Analysis
  async analyzeFreshness(file, forceDemo = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('force_demo', String(forceDemo));
    const res = await fetch(`${API_BASE_URL}/api/freshness/analyze`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  // Kitchen Hygiene Analysis
  async analyzeHygiene(file, forceDemo = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('force_demo', String(forceDemo));
    const res = await fetch(`${API_BASE_URL}/api/hygiene/analyze`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  // Smart Cooking Assistant
  async generateRecipe(payload, forceDemo = false) {
    const res = await fetch(`${API_BASE_URL}/api/recipes/generate?force_demo=${forceDemo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async listRecipes() {
    const res = await fetch(`${API_BASE_URL}/api/recipes`);
    return handleResponse(res);
  },

  async deleteRecipe(id) {
    const res = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Meal Planner
  async generateMealPlan(payload, forceDemo = false) {
    const res = await fetch(`${API_BASE_URL}/api/meal-plans/generate?force_demo=${forceDemo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async listMealPlans() {
    const res = await fetch(`${API_BASE_URL}/api/meal-plans`);
    return handleResponse(res);
  },

  async getMealPlan(id) {
    const res = await fetch(`${API_BASE_URL}/api/meal-plans/${id}`);
    return handleResponse(res);
  },

  async updateMealPlan(id, updatePayload) {
    const res = await fetch(`${API_BASE_URL}/api/meal-plans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });
    return handleResponse(res);
  },

  async deleteMealPlan(id) {
    const res = await fetch(`${API_BASE_URL}/api/meal-plans/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // History
  async getHistory(type = 'all', search = '') {
    const params = new URLSearchParams({ analysis_type: type });
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE_URL}/api/history?${params.toString()}`);
    return handleResponse(res);
  },

  async deleteHistoryRecord(type, id) {
    const res = await fetch(`${API_BASE_URL}/api/history/${type}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Export URL
  getExportUrl(format = 'csv') {
    return `${API_BASE_URL}/api/export/${format}`;
  }
};
