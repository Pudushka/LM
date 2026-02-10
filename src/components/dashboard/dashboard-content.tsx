"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Radar,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  Zap,
  AlertCircle,
} from "lucide-react";
import {
  getScoreColor,
  getScoreBgColor,
  getScoreLabel,
  getEngineDisplayName,
  getEngineIcon,
  formatDateTime,
} from "@/lib/utils";
import { VisibilityChart } from "./visibility-chart";

interface ScanResult {
  id: string;
  engine: string;
  mentioned: boolean;
  sentiment: string | null;
  analysis: string | null;
  recommendations: string | null;
  prompt: { id: string; text: string; category: string };
}

interface Scan {
  id: string;
  status: string;
  totalScore: number | null;
  createdAt: string;
  completedAt: string | null;
  results: ScanResult[];
}

interface Business {
  id: string;
  name: string;
  website: string;
  location: string;
  specialty: string;
  scans: Scan[];
  prompts: { id: string; text: string }[];
}

const ENGINES = ["chatgpt", "claude", "gemini"] as const;

function computeEngineScore(results: ScanResult[], engine: string): number {
  const engineResults = results.filter((r) => r.engine === engine);
  if (engineResults.length === 0) return 0;
  const mentioned = engineResults.filter((r) => r.mentioned).length;
  return Math.round((mentioned / engineResults.length) * 100);
}

function computeOverallScore(results: ScanResult[]): number {
  if (results.length === 0) return 0;
  const mentioned = results.filter((r) => r.mentioned).length;
  return Math.round((mentioned / results.length) * 100);
}

function getTopRecommendations(results: ScanResult[]): string[] {
  const allRecs: string[] = [];
  for (const r of results) {
    if (r.recommendations) {
      try {
        const parsed = JSON.parse(r.recommendations);
        if (Array.isArray(parsed)) allRecs.push(...parsed);
      } catch {
        if (r.recommendations.trim()) allRecs.push(r.recommendations);
      }
    }
  }
  // Deduplicate and return top 5
  const unique = [...new Set(allRecs)];
  return unique.slice(0, 5);
}

function ScoreCard({
  engine,
  score,
  previousScore,
}: {
  engine: string;
  score: number;
  previousScore?: number;
}) {
  const diff =
    previousScore !== undefined ? score - previousScore : undefined;

  return (
    <div
      className={`rounded-xl border p-5 ${getScoreBgColor(score)} card-hover`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getEngineIcon(engine)}</span>
          <span className="text-sm font-semibold text-surface-700">
            {getEngineDisplayName(engine)}
          </span>
        </div>
        {diff !== undefined && diff !== 0 && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              diff > 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {diff > 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {diff > 0 ? "+" : ""}
            {diff}
          </div>
        )}
        {diff !== undefined && diff === 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-surface-400">
            <Minus className="w-3.5 h-3.5" />
            No change
          </div>
        )}
      </div>
      <div className={`text-4xl font-extrabold ${getScoreColor(score)}`}>
        {score}
      </div>
      <div className="text-xs text-surface-500 mt-1">
        {getScoreLabel(score)}
      </div>
    </div>
  );
}

export function DashboardContent({ business }: { business: Business }) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const latestScan = business.scans[0];
  const previousScan = business.scans[1];
  const latestResults = latestScan?.results || [];
  const previousResults = previousScan?.results || [];

  const overallScore = computeOverallScore(latestResults);
  const recommendations = getTopRecommendations(latestResults);
  const hasScans = business.scans.length > 0;

  const handleRunScan = async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id }),
      });

      if (res.ok) {
        // Poll for completion
        const { scanId } = await res.json();
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          const statusRes = await fetch(`/api/scan/${scanId}`);
          const statusData = await statusRes.json();

          if (
            statusData.status === "completed" ||
            statusData.status === "failed" ||
            attempts > 60
          ) {
            clearInterval(poll);
            setScanning(false);
            router.refresh();
          }
        }, 2000);
      } else {
        setScanning(false);
      }
    } catch {
      setScanning(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            {business.name}
          </h1>
          <p className="text-surface-500 text-sm mt-0.5">
            {business.specialty} &middot; {business.location}
          </p>
        </div>
        <button
          onClick={handleRunScan}
          disabled={scanning}
          className="btn-primary"
        >
          {scanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Radar className="w-4 h-4" />
              Run Scan
            </>
          )}
        </button>
      </div>

      {!hasScans ? (
        /* Empty state */
        <div className="rounded-xl border border-surface-200 bg-white p-12 text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Radar className="w-8 h-8 text-brand-500" />
          </div>
          <h2 className="text-lg font-semibold text-surface-900 mb-2">
            Ready to scan
          </h2>
          <p className="text-surface-500 text-sm max-w-md mx-auto mb-6">
            Run your first scan to see how {business.name} appears across AI
            search engines. We&apos;ll check {business.prompts.length} prompts
            across ChatGPT, Claude, and Gemini.
          </p>
          <button
            onClick={handleRunScan}
            disabled={scanning}
            className="btn-primary"
          >
            {scanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running first scan...
              </>
            ) : (
              <>
                Run First Scan <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* Dashboard with data */
        <div className="space-y-6">
          {/* Overall score + engine scores */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Overall */}
            <div className="rounded-xl border border-surface-200 bg-white p-5 card-hover">
              <div className="text-sm font-semibold text-surface-500 mb-3">
                Overall Visibility
              </div>
              <div
                className={`text-5xl font-extrabold ${getScoreColor(overallScore)}`}
              >
                {overallScore}
              </div>
              <div className="text-sm text-surface-500 mt-1">
                {getScoreLabel(overallScore)} &middot; out of 100
              </div>
              {latestScan && (
                <div className="text-xs text-surface-400 mt-3">
                  Last scan: {formatDateTime(latestScan.createdAt)}
                </div>
              )}
            </div>

            {/* Per engine */}
            {ENGINES.map((engine) => (
              <ScoreCard
                key={engine}
                engine={engine}
                score={computeEngineScore(latestResults, engine)}
                previousScore={
                  previousResults.length > 0
                    ? computeEngineScore(previousResults, engine)
                    : undefined
                }
              />
            ))}
          </div>

          {/* Chart + Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-xl border border-surface-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-surface-700 mb-4">
                Visibility Trend
              </h2>
              {business.scans.length > 1 ? (
                <VisibilityChart scans={business.scans} />
              ) : (
                <div className="h-48 flex items-center justify-center text-surface-400 text-sm">
                  Run more scans to see trends over time
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border border-surface-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-surface-700 mb-4">
                Top Recommendations
              </h2>
              {recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-surface-600 leading-snug">
                        {rec}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2 text-surface-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Recommendations generate after scanning
                </div>
              )}
            </div>
          </div>

          {/* Recent results detail */}
          {latestResults.length > 0 && (
            <div className="rounded-xl border border-surface-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-surface-700">
                  Latest Scan Results
                </h2>
                <button
                  onClick={() => router.push("/dashboard/scans")}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-100">
                      <th className="text-left py-2.5 pr-4 font-semibold text-surface-500">
                        Prompt
                      </th>
                      {ENGINES.map((engine) => (
                        <th
                          key={engine}
                          className="text-center py-2.5 px-3 font-semibold text-surface-500"
                        >
                          {getEngineIcon(engine)}{" "}
                          {getEngineDisplayName(engine)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Group by prompt */}
                    {[
                      ...new Set(latestResults.map((r) => r.prompt.id)),
                    ].map((promptId) => {
                      const promptResults = latestResults.filter(
                        (r) => r.prompt.id === promptId
                      );
                      const promptText = promptResults[0]?.prompt.text;
                      return (
                        <tr
                          key={promptId}
                          className="border-b border-surface-50"
                        >
                          <td className="py-3 pr-4 text-surface-700 max-w-xs truncate">
                            {promptText}
                          </td>
                          {ENGINES.map((engine) => {
                            const result = promptResults.find(
                              (r) => r.engine === engine
                            );
                            return (
                              <td
                                key={engine}
                                className="py-3 px-3 text-center"
                              >
                                {result ? (
                                  <span
                                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                      result.mentioned
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-red-50 text-red-500"
                                    }`}
                                  >
                                    {result.mentioned ? "✓" : "✗"}
                                  </span>
                                ) : (
                                  <span className="text-surface-300">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
