"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [brandName, setBrandName] = useState("GeoNexo");
  const [domain, setDomain] = useState("geonexo.com");
  const [keywords, setKeywords] = useState(
    "AI search optimization, AI SEO, AI visibility"
  );
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [slackIntegration, setSlackIntegration] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account and monitoring preferences"
      />

      <div className="max-w-2xl space-y-8">
        {/* Brand Settings */}
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h3 className="font-semibold mb-4">Brand Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Target Keywords
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                placeholder="Comma-separated keywords"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate keywords with commas
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h3 className="font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              {
                label: "Email Alerts",
                description: "Get notified when your AI visibility changes significantly",
                value: emailAlerts,
                onChange: setEmailAlerts,
              },
              {
                label: "Weekly Report",
                description: "Receive a weekly summary of your AI search performance",
                value: weeklyReport,
                onChange: setWeeklyReport,
              },
              {
                label: "Slack Integration",
                description: "Send alerts to your Slack workspace",
                value: slackIntegration,
                onChange: setSlackIntegration,
              },
            ].map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <button
                  onClick={() => setting.onChange(!setting.value)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    setting.value ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      setting.value ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h3 className="font-semibold mb-4">API Access</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value="gnx_sk_1234567890abcdef"
                readOnly
                className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground"
              />
              <button className="px-4 py-3 rounded-xl border border-border bg-muted/50 hover:bg-muted text-sm font-medium transition-colors">
                Copy
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this key to access the GeoNexo API
            </p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data.
          </p>
          <button className="px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-white text-sm font-medium transition-colors">
            Delete Account
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-sm transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
