"use client"

import { useAdmin } from "./admin-context"

export function SettingsTab() {
  const { settings, setSettings, settingsSaved, saveSettings } = useAdmin()

  return (
    <div>
      <div className="max-w-md space-y-5">
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-accent font-medium mb-1.5">Store Name</label>
          <input type="text" value={settings.storeName} onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))}
            className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-accent font-medium mb-1.5">Store Email</label>
          <input type="email" value={settings.email} onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))}
            className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors" />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase text-accent font-medium mb-1.5">Currency</label>
          <select value={settings.currency} onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))}
            className="w-full px-4 py-2.5 bg-transparent border border-border text-sm text-foreground focus:outline-none focus:border-accent transition-colors">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <button onClick={saveSettings}
          className="bg-accent text-accent-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-accent/90 transition-colors">
          {settingsSaved ? "Saved" : "Save Settings"}
        </button>
      </div>
    </div>
  )
}