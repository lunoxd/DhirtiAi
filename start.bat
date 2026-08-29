@echo off
TITLE DHRITI Platform 2.0 - Windows Launcher
COLOR 0A

echo ===============================================
echo 🚀 DHRITI PLATFORM 2.0 WINDOWS LAUNCHER
echo ===============================================

REM 1. Pull latest code from GitHub
echo.
echo 📥 [1/4] Pulling latest code from GitHub (origin main)...
git pull origin main

REM 2. Install dependencies if needed and sync SQLite Database
echo.
echo 🗄️ [2/4] Syncing SQLite Database Schema via Prisma...
cd server
call npx prisma db push --skip-generate

REM 3. Seed real Admin Account & clean mock data
echo.
echo 🔑 [3/4] Provisioning Real Admin Credentials & Database...
call node clean_db.js
cd ..

REM 4. Launch Backend API (Port 5001) in new window & Frontend (Port 3000)
echo.
echo 🌐 [4/4] Starting DHRITI Services in Windows...
echo    • Backend API:  http://localhost:5001
echo    • Frontend Web: http://localhost:3000
echo ===============================================

start "DHRITI Backend API (5001)" cmd /k "cd /d %~dp0server && node index.js"
start "DHRITI Next.js Web (3000)" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ✓ All DHRITI services launched in separate windows!
echo Press any key to close this installer window...
pause > nul
