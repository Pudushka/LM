"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Target, ArrowRight, Loader2, Building2, Globe, MapPin, Stethoscope } from "lucide-react";

const SPECIALTIES = [
  "General Practice / Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Dermatology",
  "Cardiology",
  "Orthopedics",
  "Psychiatry",
  "Dentistry",
  "Ophthalmology",
  "OB/GYN",
  "Neurology",
  "Plastic Surgery",
  "Urgent Care",
  "Chiropractic",
  "Physical Therapy",
  "Other Medical Specialty",
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, website, location, specialty }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create business profile");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Header */}
      <nav className="border-b border-surface-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-surface-900">GEONEXO</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    s <= step
                      ? "bg-brand-600 text-white"
                      : "bg-surface-200 text-surface-400"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`text-sm font-medium ${
                    s <= step ? "text-surface-700" : "text-surface-400"
                  }`}
                >
                  {s === 1 ? "Practice Info" : "Review & Start"}
                </span>
                {s < 2 && <div className="flex-1 h-px bg-surface-200" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-surface-900 mb-2">
                Set up your practice
              </h1>
              <p className="text-surface-500 mb-8">
                Tell us about your medical practice so we can start monitoring
                how AI search engines talk about you.
              </p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="label">
                    <Building2 className="w-4 h-4 inline mr-1.5 text-surface-400" />
                    Practice name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Austin Heart Clinic"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="label">
                    <Globe className="w-4 h-4 inline mr-1.5 text-surface-400" />
                    Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="input-field"
                    placeholder="https://www.austinheartclinic.com"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="label">
                    <MapPin className="w-4 h-4 inline mr-1.5 text-surface-400" />
                    Location (city, state)
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field"
                    placeholder="Austin, TX"
                  />
                </div>

                <div>
                  <label htmlFor="specialty" className="label">
                    <Stethoscope className="w-4 h-4 inline mr-1.5 text-surface-400" />
                    Specialty
                  </label>
                  <select
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select specialty...</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!name || !website || !location || !specialty}
                  className="btn-primary w-full"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-surface-900 mb-2">
                Ready to go
              </h1>
              <p className="text-surface-500 mb-8">
                Here&apos;s what we&apos;ll set up for you. You can customize
                everything after your first scan.
              </p>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="rounded-xl border border-surface-200 bg-white p-5">
                  <div className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    Your Practice
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-surface-500">Name</span>
                      <span className="font-medium text-surface-900">
                        {name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-500">Website</span>
                      <span className="font-medium text-surface-900">
                        {website}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-500">Location</span>
                      <span className="font-medium text-surface-900">
                        {location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-500">Specialty</span>
                      <span className="font-medium text-surface-900">
                        {specialty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-surface-200 bg-white p-5">
                  <div className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    What Happens Next
                  </div>
                  <ul className="space-y-2.5 text-sm text-surface-600">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-500 font-bold mt-0.5">1.</span>
                      We&apos;ll generate search prompts tailored to your
                      specialty and location
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-500 font-bold mt-0.5">2.</span>
                      You&apos;ll run your first scan across ChatGPT, Claude,
                      and Gemini
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-500 font-bold mt-0.5">3.</span>
                      Your dashboard will show visibility scores, diagnostics,
                      and recommendations
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Launch Dashboard <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
