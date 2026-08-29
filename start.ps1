# DHRITI Platform 2.0 PowerShell Startup Script (start.ps1)
# Pulls latest code from GitHub, syncs SQLite database, and launches Express backend + Next.js frontend

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "🚀 DHRITI PLATFORM 2.0 STARTUP (PowerShell)" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# 1. Pull latest code from GitHub
Write-Host "`n📥 [1/4] Pulling latest code from GitHub (origin main)..." -ForegroundColor Yellow
git pull origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Warning: Git pull failed or no remote set. Continuing local launch..." -ForegroundColor Red
} else {
    Write-Host "✓ GitHub repository up-to-date!" -ForegroundColor Green
}

# 2. Database schema synchronization
Write-Host "`n🗄️ [2/4] Syncing SQLite Database Schema via Prisma..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\server"
npx prisma db push --skip-generate

# 3. Seed real Admin Account & clean mock data
Write-Host "`n🔑 [3/4] Provisioning Real Admin Credentials & Database..." -ForegroundColor Yellow
node clean_db.js

# 4. Launch Backend API (Port 5001) & Next.js Frontend (Port 3000)
Write-Host "`n🌐 [4/4] Starting DHRITI Services..." -ForegroundColor Yellow
Write-Host "   • Backend API:  http://localhost:5001" -ForegroundColor Cyan
Write-Host "   • Frontend Web: http://localhost:3000" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Start Backend API in background job
$BackendJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot\server
    node index.js
}

# Start Frontend Next.js server in current process
Set-Location "$PSScriptRoot\client"
npm run dev
