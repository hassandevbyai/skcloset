import Link from "next/link"

const steps = [
  {
    title: "Create Supabase Project",
    items: [
      "Go to https://supabase.com and sign in with GitHub",
      'Click "New Project" → Name: skcloset',
      "Set a strong database password and save it",
      "Choose region (e.g., US East iad1)",
      "Wait ~2 minutes for provisioning",
      'Go to Project Settings → API → copy Project URL and anon public key',
    ],
  },
  {
    title: "Run Migration SQL",
    items: [
      'In Supabase dashboard, go to SQL Editor',
      "Open supabase/migrations/001_initial_schema.sql",
      "Paste entire contents and click RUN",
      "Then do the same with supabase/seed.sql",
    ],
  },
  {
    title: "Update .env.local",
    items: [
      "Replace all placeholder values with real Supabase keys",
      "NEXT_PUBLIC_SUPABASE_URL — from Project Settings → API",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY — from Project Settings → API",
      "SUPABASE_SERVICE_ROLE_KEY — from Project Settings → API",
      "Add Stripe keys if processing payments",
    ],
  },
  {
    title: "Test Locally",
    items: [
      "Run: npx next dev --webpack",
      "Verify homepage loads with live data",
      "Test product pages, cart, and checkout",
      "Check API routes respond correctly",
    ],
  },
  {
    title: "Push to GitHub",
    items: [
      "git init && git add . && git commit -m \"Initial commit\"",
      "git branch -M main",
      "git remote add origin https://github.com/YOUR_USERNAME/skcloset.git",
      "git push -u origin main",
    ],
  },
  {
    title: "Deploy to Vercel",
    items: [
      "Go to https://vercel.com/new and import the repo",
      "Framework: Next.js (auto-detected)",
      "Add all environment variables from .env.local",
      "Set NEXT_PUBLIC_APP_URL=https://skcloset.vercel.app",
      "Click Deploy — takes ~2 minutes",
    ],
  },
]

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mb-2">Guide</p>
        <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-4">Deployment Checklist</h1>
        <p className="text-sm text-muted-foreground mb-12 max-w-lg">
          Follow these steps to take SKCLOSET from local development to production.
        </p>

        <div className="space-y-10">
          {steps.map((step, i) => (
            <section key={i}>
              <div className="flex items-center gap-4 mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent text-xs font-semibold flex items-center justify-center">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-serif text-xl md:text-2xl text-foreground">{step.title}</h2>
              </div>
              <ul className="space-y-2 ml-12">
                {step.items.map((item, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-3">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-accent/40 flex-shrink-0" />
                    <span className="font-mono text-[13px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 border border-border rounded-sm bg-card">
          <h3 className="text-xs tracking-[0.15em] uppercase font-medium text-foreground mb-3">Key Details</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong className="text-foreground">Supabase:</strong> 1 table migration + 15 seed products</li>
            <li><strong className="text-foreground">Auth:</strong> Row Level Security enabled on all tables</li>
            <li><strong className="text-foreground">Payments:</strong> Stripe (optional — can launch without)</li>
            <li><strong className="text-foreground">Domain:</strong> Deploy to skcloset.vercel.app first, then custom domain</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
