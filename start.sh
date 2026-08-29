#!/bin/bash

# ==============================================================================
# DHRITI - Mental Wellbeing Monitoring & Distress-Support Platform
# Unified Service Startup Script
# ==============================================================================

set -e

# Change to project root directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================"
echo "               STARTING DHRITI PLATFORM               "
echo "======================================================"

# 1. Check Server Dependencies
if [ ! -d "server/node_modules" ]; then
  echo "📦 Installing backend server dependencies..."
  (cd server && npm install)
fi

# 2. Check Server Environment File
if [ ! -f "server/.env" ]; then
  if [ -f "server/.env.example" ]; then
    echo "⚙️ Creating server/.env from template..."
    cp server/.env.example server/.env
  fi
fi

# 3. Initialize SQLite Database via Prisma
echo "🗄️ Initializing SQLite Prisma database..."
(cd server && npx prisma db push --skip-generate > /dev/null 2>&1 || true)
(cd server && npx prisma generate > /dev/null 2>&1 || true)

# 4. Check Client Dependencies
if [ ! -d "client/node_modules" ]; then
  echo "📦 Installing frontend client dependencies..."
  (cd client && npm install)
fi

echo ""
echo "🚀 Launching backend on http://localhost:5001"
echo "🚀 Launching frontend on http://localhost:3000"
echo ""
echo "Press CTRL+C to stop all services."
echo "======================================================"

# Trap to gracefully terminate all child processes on Ctrl+C
cleanup() {
  echo ""
  echo "🛑 Shutting down DHRITI services..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start backend server in background
(cd server && npm start) &
SERVER_PID=$!

# Start frontend Next.js dev server in background
(cd client && npm run dev) &
CLIENT_PID=$!

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
