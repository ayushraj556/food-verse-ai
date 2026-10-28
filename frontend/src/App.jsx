import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FoodNutrition from './pages/FoodNutrition';
import FreshnessAnalysis from './pages/FreshnessAnalysis';
import KitchenHygiene from './pages/KitchenHygiene';
import CookingAssistant from './pages/CookingAssistant';
import MealPlanner from './pages/MealPlanner';
import AnalysisHistory from './pages/AnalysisHistory';
import ReportsSettings from './pages/ReportsSettings';
import { api } from './api/client';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const [forceDemo, setForceDemo] = useState(false);

  const fetchHealth = async () => {
    try {
      const data = await api.getHealth();
      setSystemHealth(data);
    } catch (err) {
      console.warn('Backend currently offline or starting up...', err);
      setSystemHealth({
        status: 'offline',
        is_demo_mode: true,
        database_connected: false,
        active_model: 'offline',
      });
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} forceDemo={forceDemo} />;
      case 'food':
        return <FoodNutrition forceDemo={forceDemo} />;
      case 'freshness':
        return <FreshnessAnalysis forceDemo={forceDemo} />;
      case 'hygiene':
        return <KitchenHygiene forceDemo={forceDemo} />;
      case 'recipes':
        return <CookingAssistant forceDemo={forceDemo} />;
      case 'meal-planner':
        return <MealPlanner forceDemo={forceDemo} />;
      case 'history':
        return <AnalysisHistory setActivePage={setActivePage} />;
      case 'reports':
        return (
          <ReportsSettings
            systemHealth={systemHealth}
            forceDemo={forceDemo}
            setForceDemo={setForceDemo}
          />
        );
      default:
        return <Dashboard setActivePage={setActivePage} forceDemo={forceDemo} />;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        systemHealth={systemHealth}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Navbar
          activePage={activePage}
          onOpenMobile={() => setIsMobileOpen(true)}
          systemHealth={systemHealth}
          forceDemo={forceDemo}
          setForceDemo={setForceDemo}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-cream-200 bg-white/60 py-4 px-6 text-center text-xs text-slate-400">
          <p>
            Food Verse AI — Multimodal Food Intelligence Agent • Built with FastAPI, React & Google GenAI SDK.
          </p>
        </footer>
      </div>
    </div>
  );
}
