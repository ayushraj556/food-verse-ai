#!/bin/bash
# ==============================================================================
# Food Verse AI – Multimodal Food Intelligence Agent Startup Script
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
AMBER='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "=================================================================="
echo "    Food Verse AI – Multimodal Food Intelligence Agent           "
echo "=================================================================="
echo -e "${NC}"

MODE="${1:-all}"

# Function to run backend tests
run_tests() {
    echo -e "${AMBER}Running backend test suite...${NC}"
    export PYTHONPATH="$SCRIPT_DIR"
    "$SCRIPT_DIR/backend/venv/bin/pytest" "$SCRIPT_DIR/backend/tests" -v
    exit 0
}

if [ "$MODE" = "test" ]; then
    run_tests
fi

# 1. Setup Backend Virtual Environment if needed
if [ ! -d "$SCRIPT_DIR/backend/venv" ]; then
    echo -e "${AMBER}[1/3] Creating Python 3 virtual environment...${NC}"
    python3 -m venv "$SCRIPT_DIR/backend/venv"
    echo -e "${AMBER}[2/3] Installing backend dependencies...${NC}"
    "$SCRIPT_DIR/backend/venv/bin/pip" install --upgrade pip
    "$SCRIPT_DIR/backend/venv/bin/pip" install -r "$SCRIPT_DIR/backend/requirements.txt"
fi

# 2. Setup Frontend Dependencies if needed
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo -e "${AMBER}[3/3] Installing frontend npm dependencies...${NC}"
    (cd "$SCRIPT_DIR/frontend" && npm install)
fi

echo -e "${GREEN}✓ All dependencies verified.${NC}\n"

# Function to start backend
start_backend() {
    echo -e "${CYAN}→ Starting FastAPI backend on http://127.0.0.1:8000 ...${NC}"
    export PYTHONPATH="$SCRIPT_DIR"
    "$SCRIPT_DIR/backend/venv/bin/uvicorn" backend.main:app --host 127.0.0.1 --port 8000 --reload
}

# Function to start frontend
start_frontend() {
    echo -e "${CYAN}→ Starting Vite frontend on http://127.0.0.1:5173 ...${NC}"
    (cd "$SCRIPT_DIR/frontend" && npm run dev)
}

if [ "$MODE" = "backend" ]; then
    start_backend
elif [ "$MODE" = "frontend" ]; then
    start_frontend
else
    echo -e "${BOLD}Launching full-stack services concurrently:${NC}"
    echo -e " • Backend API:        ${GREEN}http://127.0.0.1:8000${NC}"
    echo -e " • Swagger API Docs:   ${GREEN}http://127.0.0.1:8000/docs${NC}"
    echo -e " • Frontend Interface: ${GREEN}http://127.0.0.1:5173${NC}\n"

    trap 'kill 0' EXIT
    (export PYTHONPATH="$SCRIPT_DIR" && "$SCRIPT_DIR/backend/venv/bin/uvicorn" backend.main:app --host 127.0.0.1 --port 8000 --reload) &
    (cd "$SCRIPT_DIR/frontend" && npm run dev) &
    wait
fi
