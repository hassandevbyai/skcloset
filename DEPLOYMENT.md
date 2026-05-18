# SKCLOSET — Deployment Guide

## Overview
- **Frontend**: Next.js 16 (App Router)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

---

## Prerequisites

### Accounts Needed
1. **GitHub** — Push code to a repository
2. **Vercel** (free) — Sign in with GitHub at https://vercel.com
3. **Supabase** (free) — Sign in with GitHub at https://supabase.com
4. **Stripe** (free) — Sign in at https://stripe.com

---

## Step 1: Push to GitHub

```bash
# From the project root
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skcloset.git
git push -u origin main
```

## Step 2: Set Up Supabase

1. Go to https://supabase.com → **New project**
2. Choose a name: `skcloset`
3. Set a secure database password
4. Choose a region close to you
5. Wait for the database to provision (~2 minutes)

### Run Migrations
1. Go to **SQL Editor** in Supabase dashboard
2. Open `supabase/migrations/001_initial_schema.sql` from this project
3. Paste the entire file and click **Run**
4. (Optional) Run `supabase/seed.sql` for sample data

### Get API Keys
1. Go to **Project Settings** → **API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Set Up Stripe

1. Go to https://dashboard.stripe.com
2. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`
4. Set up webhook endpoint:
   - URL: `https://your-domain.vercel.app/api/webhook/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

## Step 4: Deploy to Vercel

### Option A: Quick Deploy (from Vercel Dashboard)
1. Go to https://vercel.com/new
2. Import your GitHub repository (`skcloset`)
3. Add environment variables (from steps 2 & 3):
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   NEXT_PUBLIC_APP_URL=https://skcloset.vercel.app
   ```
4. Click **Deploy** — it will build & deploy in ~2 minutes

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

## Step 5: Set Up GitHub Actions (CI/CD)

Add these secrets in your GitHub repo:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Value |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe dashboard |
| `STRIPE_SECRET_KEY` | From Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | From Stripe dashboard |
| `VERCEL_TOKEN` | Generate in Vercel: Settings → Tokens |
| `VERCEL_ORG_ID` | From `vercel link` → `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | From `vercel link` → `.vercel/project.json` |

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard → Project → **Domains**
2. Add `skcloset.com`
3. Update your DNS records as instructed by Vercel

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role (admin) key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | ❌* | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your production URL |

*Required only if using Stripe webhooks for payment status updates.

---

## Monitoring

Vercel provides built-in:
- **Analytics** — Traffic, bandwidth, performance
- **Logs** — Server function logs
- **Status** — Uptime monitoring

For error tracking, add Sentry:
```bash
npm install @sentry/nextjs
npx sentry-wizard -i nextjs
```

---

## Rollback

If a deployment breaks:
1. Go to Vercel dashboard → **Deployments**
2. Find the last working deployment
3. Click the **...** menu → **Promote to Production**

---

## Build Notes (Windows)

This project has SWC binary compatibility issues on Windows.
- The corrupted `@next/swc-win32-x64-msvc` binary has been removed
- The build falls back to WASM compilation
- **This does not affect Vercel deployments** — Vercel uses Linux where SWC works natively
