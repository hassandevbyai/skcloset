# SKCLOSET - Quick Deploy Script (Run on YOUR machine)
# Save this as deploy.ps1 and run in PowerShell

Write-Host "=== SKCLOSET Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# ----- 1. Check prerequisites -----
$hasGit = Get-Command git -ErrorAction SilentlyContinue
$hasNode = Get-Command node -ErrorAction SilentlyContinue

if (-not $hasNode) {
    Write-Host "❌ Node.js is not installed. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $(node --version) detected" -ForegroundColor Green

if (-not $hasGit) {
    Write-Host "❌ Git is not installed. Install from https://git-scm.com" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git detected" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Run this script from the project root (skcloset/)" -ForegroundColor Red
    exit 1
}

# ----- 2. Install dependencies -----
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# ----- 3. Remove corrupted SWC binary -----
if (Test-Path "node_modules\@next\swc-win32-x64-msvc") {
    Remove-Item -Recurse -Force "node_modules\@next\swc-win32-x64-msvc" -ErrorAction SilentlyContinue
    Write-Host "✅ Removed corrupted SWC binary" -ForegroundColor Green
}

# ----- 4. Test build -----
Write-Host ""
Write-Host "🔨 Testing build..." -ForegroundColor Yellow
npx next build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check the errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build passed!" -ForegroundColor Green

# ----- 5. Initialize Git -----
Write-Host ""
Write-Host "📁 Initializing Git..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    git add .
    git commit -m "Initial commit - SKCLOSET"
    git branch -M main
}
Write-Host "✅ Git repository initialized" -ForegroundColor Green

# ----- 6. Instructions for GitHub + Vercel -----
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ BUILD READY! Follow these steps:" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Step 1: Push to GitHub" -ForegroundColor Yellow
Write-Host "   Create a repo at https://github.com/new"
Write-Host "   Then run these commands:"
Write-Host "     git remote add origin https://github.com/YOUR_USERNAME/skcloset.git"
Write-Host "     git push -u origin main"
Write-Host ""
Write-Host "📌 Step 2: Create Supabase project" -ForegroundColor Yellow
Write-Host "   Go to https://supabase.com → New project"
Write-Host "   Then run the SQL from: supabase/migrations/001_initial_schema.sql"
Write-Host "   (Optional): supabase/seed.sql for sample data"
Write-Host ""
Write-Host "📌 Step 3: Deploy to Vercel" -ForegroundColor Yellow
Write-Host "   Go to https://vercel.com/new"
Write-Host "   Import your skcloset GitHub repo"
Write-Host "   Add these environment variables:"
Write-Host ""
Write-Host "   NEXT_PUBLIC_SUPABASE_URL      = (from Supabase dashboard → Settings → API)"
Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY = (from Supabase dashboard)"
Write-Host "   SUPABASE_SERVICE_ROLE_KEY     = (from Supabase dashboard)"
Write-Host "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = (from Stripe dashboard)"
Write-Host "   STRIPE_SECRET_KEY             = (from Stripe dashboard)"
Write-Host "   STRIPE_WEBHOOK_SECRET         = (from Stripe dashboard)"
Write-Host "   NEXT_PUBLIC_APP_URL           = https://skcloset.vercel.app"
Write-Host ""
Write-Host "📌 Step 4: Set up GitHub Actions secrets" -ForegroundColor Yellow
Write-Host "   Go to your GitHub repo → Settings → Secrets → Actions"
Write-Host "   Add the same 6 env vars as above"
Write-Host ""
Write-Host "📌 Step 5: (Optional) Custom domain" -ForegroundColor Yellow
Write-Host "   In Vercel → Project → Domains → Add skcloset.com"
Write-Host "   Update your DNS records"
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Your site will be live at: https://skcloset.vercel.app" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
