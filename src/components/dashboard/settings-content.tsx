"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, User, Building2, Key } from "lucide-react";

interface UserData {
  id: string;
  name: string | null;
  email: string;
}

interface BusinessData {
  id: string;
  name: string;
  website: string;
  location: string;
  specialty: string;
}

export function SettingsContent({
  user,
  business,
}: {
  user: UserData;
  business: BusinessData | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [bizName, setBizName] = useState(business?.name || "");
  const [bizWebsite, setBizWebsite] = useState(business?.website || "");
  const [bizLocation, setBizLocation] = useState(business?.location || "");
  const [bizSpecialty, setBizSpecialty] = useState(business?.specialty || "");

  const handleSaveBusiness = async () => {
    if (!business) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/business/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bizName,
          website: bizWebsite,
          location: bizLocation,
          specialty: bizSpecialty,
        }),
      });

      if (res.ok) {
        setMessage("Settings saved successfully.");
        router.refresh();
      } else {
        setMessage("Failed to save settings.");
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Settings</h1>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm mb-6 ${
            message.includes("success")
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Account */}
      <div className="rounded-xl border border-surface-200 bg-white p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-surface-500" />
          <h2 className="text-sm font-bold text-surface-700 uppercase tracking-wider">
            Account
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              value={user.name || ""}
              disabled
              className="input-field bg-surface-50"
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="input-field bg-surface-50"
            />
          </div>
        </div>
      </div>

      {/* Business */}
      {business && (
        <div className="rounded-xl border border-surface-200 bg-white p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-surface-500" />
            <h2 className="text-sm font-bold text-surface-700 uppercase tracking-wider">
              Business Profile
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Practice Name</label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Website</label>
              <input
                type="url"
                value={bizWebsite}
                onChange={(e) => setBizWebsite(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Location</label>
              <input
                type="text"
                value={bizLocation}
                onChange={(e) => setBizLocation(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Specialty</label>
              <input
                type="text"
                value={bizSpecialty}
                onChange={(e) => setBizSpecialty(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              onClick={handleSaveBusiness}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* API Keys info */}
      <div className="rounded-xl border border-surface-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-surface-500" />
          <h2 className="text-sm font-bold text-surface-700 uppercase tracking-wider">
            AI Engine Status
          </h2>
        </div>
        <div className="space-y-3">
          {[
            { name: "OpenAI (ChatGPT)", env: "OPENAI_API_KEY" },
            { name: "Anthropic (Claude)", env: "ANTHROPIC_API_KEY" },
            { name: "Google (Gemini)", env: "GOOGLE_GEMINI_API_KEY" },
          ].map((engine) => (
            <div
              key={engine.env}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-surface-700">{engine.name}</span>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-100 text-surface-500">
                Configured via environment
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-surface-400 mt-4">
          API keys are managed through server environment variables for security.
          Contact your administrator to update engine configurations.
        </p>
      </div>
    </div>
  );
}
