"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Activity,
  BarChart3,
  Shield,
  ArrowRight,
  Zap,
  Eye,
  Target,
} from "lucide-react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-brand-600">
          <Activity className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">GEONEXO</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="btn-ghost"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="btn-primary"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-full text-brand-700 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI Visibility Platform for Healthcare
          </div>
          <h1 className="text-5xl font-extrabold text-surface-950 leading-tight tracking-tight">
            Know how AI search
            <br />
            <span className="text-brand-600">talks about your practice</span>
          </h1>
          <p className="mt-6 text-lg text-surface-500 leading-relaxed max-w-xl">
            When patients ask ChatGPT, Gemini, or Claude for doctor
            recommendations, is your practice in the answer? GEONEXO monitors
            your visibility across AI engines and shows you exactly what to fix.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="btn-primary text-base px-6 py-3"
            >
              Start Monitoring <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-sm text-surface-400">
              Free baseline scan included
            </span>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-t border-surface-200 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                Multi-Engine Monitoring
              </h3>
              <p className="text-surface-500 text-sm leading-relaxed">
                See how ChatGPT, Gemini, and Claude respond when patients search
                for practices like yours. Real data, not guesses.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                Clear Diagnostics
              </h3>
              <p className="text-surface-500 text-sm leading-relaxed">
                Understand WHY you appear (or don&apos;t) in AI answers.
                Structured analysis you can act on, not vague theories.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900">
                Actionable Guidance
              </h3>
              <p className="text-surface-500 text-sm leading-relaxed">
                Prioritized recommendations you or your team can execute. No
                fluff, no retainers — just what to do next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-surface-400 text-sm">
            <Target className="w-4 h-4" />
            <span>GEONEXO</span>
          </div>
          <p className="text-sm text-surface-400">
            &copy; {new Date().getFullYear()} GEONEXO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
