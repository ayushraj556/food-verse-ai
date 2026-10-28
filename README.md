# Food Verse AI – Multimodal Food Intelligence Agent

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Google GenAI SDK](https://img.shields.io/badge/Google_GenAI_SDK-2.33-4285F4.svg?logo=google&logoColor=white)](https://pypi.org/project/google-genai/)
[![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy_2.0-003B57.svg?logo=sqlite&logoColor=white)](https://www.sqlalchemy.org)
[![Tests](https://img.shields.io/badge/Tests-15%2F15%20Passing-brightgreen.svg)]()

> A full-stack, multimodal food intelligence platform that analyzes food images, short kitchen videos, and text inputs to deliver dietary recognition, macronutrient estimation, freshness screening, kitchen sanitation auditing, and personalized 7-day meal planning.

---

## 🌟 Key Capabilities & Working Modules

Every navigation item links to a complete, fully implemented module:

1. **Executive Food Dashboard**
   - Live metrics calculated directly from persistent SQLite storage: total multimodal analyses, food nutrition records, average calories, and active 7-day meal plans.
   - Dynamic food category distribution chart using Recharts.
   - Chronological analysis activity timeline with instant deep-dive links.

2. **Food Recognition & Nutrition Analysis** *(Core High-Priority Feature)*
   - Accepts JPG, JPEG, PNG, or WEBP food photos (drag-and-drop or file picker) up to 15MB.
   - Frontend and backend validation for content type and size limits.
   - Multimodal component segmentation: identifies multiple distinct dishes on a plate, returning individual portion estimates alongside a unified total.
   - Interactive macronutrient energy ratio charts (Recharts Pie and Bar charts for Protein, Carbs, Fat, and Fiber).
   - Prominently labeled visual estimation disclaimer noting that visual inspection cannot account for hidden oils, sodium, or exact preparation weights.

3. **Food Freshness Screening**
   - Classifies produce and perishables into three strict standards: **Fresh**, **Moderately Fresh**, or **Possibly Spoiled**.
   - Evaluates observable visual markers: dehydration, skin wrinkling, ripening spots, water-soaking, and surface mold.
   - Clear food safety guidance and practical storage advice (temperature, containers, humidity).
   - Prominent disclaimer clarifying that visual appearance alone cannot detect microscopic bacterial pathogens (Salmonella, Listeria) or invisible toxins.

4. **Kitchen Hygiene & Sanitation Inspection**
   - Supports both still images and short video clips (`.mp4`, `.webm`, `.mov`).
   - Uses OpenCV keyframe extraction to sample representative video frames without crashing or freezing.
   - Evaluates observable operational criteria: food-grade glove usage, hair coverings/restraints, surface cleanliness, and cross-contamination indicators.
   - Outlines observations, identified concerns, actionable sanitation improvements, and analysis limitations.
   - Explicit disclaimer that visual screening does not certify restaurants or guarantee health department compliance.

5. **Smart Cooking Assistant**
   - Formulates creative chef recipes based on available pantry/fridge ingredients, diet preferences (Vegetarian, Non-Vegetarian, Vegan), cuisine styles, and time limits.
   - Includes ingredient quantities, sequential cooking steps, serving sizes, and estimated macros.
   - Provides culinary safety notes and allergen cross-contact warnings.
   - Allows users to view and delete saved recipes from SQLite storage.

6. **Personalized 7-Day Meal Planner**
   - Builds custom Monday–Sunday meal plans (Breakfast, Lunch, Dinner, Snack) tailored to specific dietary targets (Balanced Nutrition, High Protein, Weight Management, Heart Health).
   - Full CRUD capability: View weekly schedules, switch between days, edit plan notes, save new plans, and delete outdated meal plans.
   - Safe nutritional boundaries: avoids dangerous crash diets or extreme calorie restrictions.

7. **Multimodal Analysis History**
   - Unified searchable history across all inspection modules.
   - Filter by module type (`all`, `food`, `freshness`, `hygiene`) with instant search by keyword.
   - Modal inspection viewer showing structured JSON details, timestamp, and uploaded image attachments.
   - Safe record deletion.

8. **Reports & System Settings**
   - Exports verified analysis records into downloadable **CSV Spreadsheets** or **Structured JSON files**.
   - Live diagnostics showing Google GenAI SDK connectivity, active vision model identifier, database health, and max upload limits.
   - Interactive "Force Demo Mode" simulation toggle to test realistic demo profiles on demand without expending API tokens.

---

## 🎨 Design System & Theme

- **Warm Cream Background**: `#FDFBF7` and `#F8F5EE` for a warm, welcoming food-centric aesthetic.
- **Deep Forest Green Accents**: `#1B4332` and `#2D6A4F` for trust, freshness, and organic nutrition.
- **Amber & Orange Highlights**: `#EA580C` and `#F97316` for culinary warmth and active focal points.
- **Typography & Cards**: Clean modern sans-serif typography (`Plus Jakarta Sans`), subtle rounded cards (`rounded-2xl`, `rounded-3xl`), and soft layered drop-shadows (`shadow-soft`, `shadow-elevated`).

---

## 🏗️ Architecture & Technology Stack

```
food-verse-ai/
├── backend/
│   ├── main.py                     # FastAPI app, CORS, static mounts, exception handlers
│   ├── config.py                   # Pydantic/dotenv settings, allowed mime types, upload limits
│   ├── database.py                 # SQLite engine & SQLAlchemy SessionLocal setup
│   ├── models.py                   # SQLAlchemy ORM models (Food, Freshness, Hygiene, Recipe, MealPlan)
│   ├── schemas.py                  # Pydantic v2 validation models & standardized disclaimers
│   ├── services/
│   │   ├── ai_client.py            # Google GenAI SDK wrapper (gemini-2.5-flash / gemini-1.5-flash)
│   │   ├── demo_data.py            # High-fidelity demo sample profiles for offline mode
│   │   ├── food_analysis.py        # Food segmentation & nutrition estimation logic
│   │   ├── freshness_analysis.py   # Spoilage & freshness screening logic
│   │   ├── hygiene_analysis.py     # Video frame extraction & kitchen sanitation inspection
│   │   ├── recipe_service.py       # Recipe formulation & culinary safety logic
│   │   └── meal_planner.py         # 7-day weekly schedule generation logic
│   ├── routers/                    # Modular FastAPI routers
│   │   ├── health.py               # /api/health
│   │   ├── food.py                 # /api/food/analyze, /api/food/{id}
│   │   ├── freshness.py            # /api/freshness/analyze, /api/freshness/{id}
│   │   ├── hygiene.py              # /api/hygiene/analyze, /api/hygiene/{id}
│   │   ├── recipes.py              # /api/recipes/generate, /api/recipes
│   │   ├── meal_plans.py           # /api/meal-plans (Full CRUD)
│   │   ├── history.py              # /api/history (Unified search & filter)
│   │   └── stats.py                # /api/stats, /api/export/csv, /api/export/json
│   ├── tests/                      # Pytest test suite (10 comprehensive tests)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.js           # Centralized API client configured via environment variable
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Sidebar.jsx         # Navigation drawer & status footer
│   │   │   ├── Navbar.jsx          # Header, mode toggle, online indicator
│   │   │   ├── ImageDropzone.jsx   # Drag-and-drop file upload with preview & demo selector
│   │   │   ├── DemoBadge.jsx       # Clear distinction between Demo Mode & Live AI Mode
│   │   │   ├── NutritionChart.jsx  # Recharts Pie & Bar macro charts
│   │   │   └── DisclaimerBanner.jsx# Ethical food safety disclaimers
│   │   ├── pages/                  # 8 distinct working pages
│   │   ├── App.jsx                 # Application layout & state management
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── start.sh                        # Unified one-command startup script
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (Tested on Python 3.13)
- **Node.js 18+** & **npm**

### Option 1: Automated Launch (Recommended)

Run the included all-in-one startup script:

```bash
chmod +x start.sh
./start.sh
```

This will automatically:
1. Verify the Python virtual environment and install missing dependencies.
2. Verify frontend npm packages.
3. Start the FastAPI backend on `http://127.0.0.1:8000`.
4. Start the Vite React frontend on `http://127.0.0.1:5173`.

### Option 2: Individual Service Launch

**Terminal 1 — Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export PYTHONPATH=..
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Running the Backend Test Suite

To run all automated backend tests:

```bash
./start.sh test
```

Or manually using pytest:
```bash
PYTHONPATH=. backend/venv/bin/pytest backend/tests/ -v
```

**Test Coverage (15 Comprehensive Passing Tests):**
- System health check & SQLite database connectivity
- Root API metadata and Swagger docs endpoint
- Interactive Gemini API key verification (empty key and invalid key rejection)
- Valid and invalid image MIME types (JPEG, PNG, WEBP vs text/pdf)
- Zero-byte file rejection and oversized upload rejection (413 Content Too Large)
- Food nutrition response schema & disclaimer presence
- Freshness classification states (`Fresh`, `Moderately Fresh`, `Possibly Spoiled`) & invalid MIME rejection
- Kitchen hygiene analysis with still images and video files (`.mp4`)
- Recipe formulation, ingredient matching, and deletion
- 7-Day Meal Plan full CRUD (Create, Read, Update meal plans with inline data, and Delete)
- Dynamic dashboard statistics calculation and CSV/JSON report exports

---

## 🔑 Environment Configuration

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:

```ini
# Google Gemini API Key
# Leave blank to operate in Demo Mode with realistic sample profiles
GEMINI_API_KEY=

# Supported Gemini Vision Model
GEMINI_MODEL=gemini-2.5-flash

# Server Host & Port
HOST=127.0.0.1
PORT=8000

# CORS Origins (Comma-separated)
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# SQLite Database URL
DATABASE_URL=sqlite:///./food_verse.db

# Storage Limits
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=15
```

### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:

```ini
VITE_API_BASE_URL=http://localhost:8000
```

---

## 💡 AI Mode vs. Demo Mode

The application is engineered to be **100% functional out-of-the-box** regardless of API key availability:

| Feature | AI Mode (`GEMINI_API_KEY` present) | Demo Mode (`GEMINI_API_KEY` absent or force toggled) |
| :--- | :--- | :--- |
| **Provider** | Live Google GenAI SDK | Verified high-fidelity nutritional datasets |
| **Model** | `gemini-2.5-flash` / `gemini-1.5-flash` | `demo-sample` |
| **Labeling** | Green badge: `AI Mode (Gemini)` | Amber badge: `Demo Data (Sample Profile)` |
| **Authenticity** | Direct multimodal computer vision analysis | Realistic predefined samples clearly labeled |
| **Network Dependency**| Requires active internet connection | Runs completely offline |

*Ethical Guarantee: Demo responses are never disguised as real AI predictions.*

---

## 📡 API Reference Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health, model configured, demo mode flag |
| `POST`| `/api/food/analyze` | Multimodal food plate analysis and macronutrient breakdown |
| `GET` | `/api/food/{id}` | Retrieve saved food analysis by ID |
| `POST`| `/api/freshness/analyze`| Produce freshness screening and storage recommendations |
| `GET` | `/api/freshness/{id}` | Retrieve saved freshness analysis by ID |
| `POST`| `/api/hygiene/analyze` | Kitchen sanitation audit for images and videos |
| `GET` | `/api/hygiene/{id}` | Retrieve saved hygiene record by ID |
| `POST`| `/api/recipes/generate`| Generate tailored culinary recipes from available ingredients |
| `GET` | `/api/recipes` | List all saved recipes |
| `DELETE`| `/api/recipes/{id}` | Delete saved recipe |
| `POST`| `/api/meal-plans/generate` | Generate 7-day personalized meal plan |
| `GET` | `/api/meal-plans` | List saved 7-day meal plans |
| `GET` | `/api/meal-plans/{id}` | Retrieve single meal plan by ID |
| `PUT` | `/api/meal-plans/{id}` | Update existing meal plan title or notes |
| `DELETE`| `/api/meal-plans/{id}` | Delete saved meal plan |
| `GET` | `/api/history` | Search and filter unified multimodal analysis records |
| `DELETE`| `/api/history/{type}/{id}` | Delete historical evaluation record |
| `GET` | `/api/stats` | Dynamic dashboard metrics compiled from SQLite database |
| `GET` | `/api/export/csv` | Download full analysis report as a valid CSV spreadsheet |
| `GET` | `/api/export/json` | Download full analysis report as structured JSON |
| `GET` | `/docs` | Interactive Swagger API documentation |

---

## 🛡️ Responsible AI & Safety Disclaimers

1. **Nutritional Estimates**: Visual estimates are approximate. Portions, cooking oils, hidden sodium, and preparation methods vary. This tool does not provide clinical or medical nutrition therapy.
2. **Freshness Screening**: Visual screening cannot detect invisible pathogenic bacteria (*Salmonella*, *Listeria*, *E. coli*) or deep fungal toxins. When in doubt, prioritize safety and discard questionable food.
3. **Kitchen Hygiene Inspection**: Visual indicators assess only observable workstation practices. This does not constitute health department certification or HACCP compliance verification.
4. **Allergies**: Always read packaging labels directly before consuming or preparing meals for individuals with severe food allergies.
