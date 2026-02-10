"use client";

import { useRef } from "react";
import {
  Printer,
  FileBarChart,
  Target,
  Zap,
  AlertCircle,
} from "lucide-react";
import {
  getScoreColor,
  getScoreLabel,
  getEngineDisplayName,
  getEngineIcon,
  formatDate,
} from "@/lib/utils";

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
  totalScore: number | null;
  createdAt: string;
  results: ScanResult[];
}

interface Business {
  id: string;
  name: string;
  website: string;
  location: string;
  specialty: string;
  scans: Scan[];
}

const ENGINES = ["chatgpt", "claude", "gemini"];

function computeEngineScore(results: ScanResult[], engine: string): number {
  const engineResults = results.filter((r) => r.engine === engine);
  if (engineResults.length === 0) return 0;
  const mentioned = engineResults.filter((r) => r.mentioned).length;
  return Math.round((mentioned / engineResults.length) * 100);
}

export function ReportsContent({ business }: { business: Business }) {
  const reportRef = useRef<HTMLDivElement>(null);
  const latestScan = business.scans[0];

  const handlePrint = () => {
    window.print();
  };

  if (!latestScan) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-surface-900 mb-6">Reports</h1>
        <div className="rounded-xl border border-surface-200 bg-white p-12 text-center">
          <AlertCircle className="w-8 h-8 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm">
            Complete a scan first to generate a visibility report.
          </p>
        </div>
      </div>
    );
  }

  const results = latestScan.results;
  const overallScore = latestScan.totalScore ?? 0;
  const allRecommendations: string[] = [];
  const allAnalyses: string[] = [];

  for (const r of results) {
    if (r.recommendations) {
      try {
        const parsed = JSON.parse(r.recommendations);
        if (Array.isArray(parsed)) allRecommendations.push(...parsed);
      } catch {
        if (r.recommendations.trim()) allRecommendations.push(r.recommendations);
      }
    }
    if (r.analysis && !allAnalyses.includes(r.analysis)) {
      allAnalyses.push(r.analysis);
    }
  }

  const uniqueRecs = [...new Set(allRecommendations)];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Visibility Report
          </h1>
          <p className="text-surface-500 text-sm mt-0.5">
            Based on scan from {formatDate(latestScan.createdAt)}
          </p>
        </div>
        <button onClick={handlePrint} className="btn-secondary">
          <Printer className="w-4 h-4" />
          Print Report
        </button>
      </div>

      <div ref={reportRef} className="space-y-6 print:space-y-4">
        {/* Report header */}
        <div className="rounded-xl border border-surface-200 bg-white p-8 print:border-0 print:p-0 print:pb-4">
          <div className="flex items-center gap-3 mb-6 print:mb-4">
            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center print:bg-black">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-surface-900">
                GEONEXO Visibility Report
              </div>
              <div className="text-sm text-surface-500">
                {business.name} &middot; {formatDate(latestScan.createdAt)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-surface-500 mb-1">Business</div>
              <div className="text-sm font-semibold text-surface-900">
                {business.name}
              </div>
            </div>
            <div>
              <div className="text-xs text-surface-500 mb-1">Location</div>
              <div className="text-sm font-semibold text-surface-900">
                {business.location}
              </div>
            </div>
            <div>
              <div className="text-xs text-surface-500 mb-1">Specialty</div>
              <div className="text-sm font-semibold text-surface-900">
                {business.specialty}
              </div>
            </div>
            <div>
              <div className="text-xs text-surface-500 mb-1">
                Overall Score
              </div>
              <div
                className={`text-2xl font-bold ${getScoreColor(overallScore)}`}
              >
                {overallScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* Engine breakdown */}
        <div className="rounded-xl border border-surface-200 bg-white p-6 print:border-0 print:p-0 print:pb-4">
          <h2 className="text-sm font-bold text-surface-700 mb-4 uppercase tracking-wider">
            Engine-by-Engine Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ENGINES.map((engine) => {
              const score = computeEngineScore(results, engine);
              const engineResults = results.filter((r) => r.engine === engine);
              const mentioned = engineResults.filter(
                (r) => r.mentioned
              ).length;

              return (
                <div
                  key={engine}
                  className="rounded-lg border border-surface-200 p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{getEngineIcon(engine)}</span>
                    <span className="text-sm font-bold text-surface-800">
                      {getEngineDisplayName(engine)}
                    </span>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </div>
                  <div className="text-xs text-surface-500 mt-1">
                    {getScoreLabel(score)} &middot; Mentioned in {mentioned}/
                    {engineResults.length} queries
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prompt results table */}
        <div className="rounded-xl border border-surface-200 bg-white p-6 print:border-0 print:p-0 print:pb-4">
          <h2 className="text-sm font-bold text-surface-700 mb-4 uppercase tracking-wider">
            Detailed Results by Prompt
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-2 pr-4 font-semibold text-surface-500">
                    Search Prompt
                  </th>
                  {ENGINES.map((engine) => (
                    <th
                      key={engine}
                      className="text-center py-2 px-3 font-semibold text-surface-500"
                    >
                      {getEngineDisplayName(engine)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...new Set(results.map((r) => r.prompt.id))].map(
                  (promptId) => {
                    const promptResults = results.filter(
                      (r) => r.prompt.id === promptId
                    );
                    return (
                      <tr
                        key={promptId}
                        className="border-b border-surface-50"
                      >
                        <td className="py-2.5 pr-4 text-surface-700">
                          {promptResults[0]?.prompt.text}
                        </td>
                        {ENGINES.map((engine) => {
                          const result = promptResults.find(
                            (r) => r.engine === engine
                          );
                          return (
                            <td
                              key={engine}
                              className="py-2.5 px-3 text-center"
                            >
                              <span
                                className={`inline-block w-6 h-6 rounded-full text-xs font-bold leading-6 ${
                                  result?.mentioned
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-50 text-red-400"
                                }`}
                              >
                                {result?.mentioned ? "Y" : "N"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Diagnostics */}
        {allAnalyses.length > 0 && (
          <div className="rounded-xl border border-surface-200 bg-white p-6 print:border-0 print:p-0 print:pb-4">
            <h2 className="text-sm font-bold text-surface-700 mb-4 uppercase tracking-wider">
              Diagnostics
            </h2>
            <div className="space-y-3">
              {allAnalyses.slice(0, 5).map((analysis, i) => (
                <div
                  key={i}
                  className="text-sm text-surface-600 leading-relaxed p-3 bg-surface-50 rounded-lg"
                >
                  {analysis}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {uniqueRecs.length > 0 && (
          <div className="rounded-xl border border-surface-200 bg-white p-6 print:border-0 print:p-0 print:pb-4">
            <h2 className="text-sm font-bold text-surface-700 mb-4 uppercase tracking-wider">
              Recommended Actions
            </h2>
            <div className="space-y-2">
              {uniqueRecs.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-surface-700 leading-snug">
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-surface-400 pt-4 print:pt-2">
          Generated by GEONEXO &middot; AI Visibility Platform &middot;{" "}
          {formatDate(new Date())}
        </div>
      </div>
    </div>
  );
}
