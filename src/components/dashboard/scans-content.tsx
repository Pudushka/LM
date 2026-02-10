"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Radar,
  Loader2,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  getScoreColor,
  getEngineDisplayName,
  getEngineIcon,
  formatDateTime,
} from "@/lib/utils";

interface ScanResult {
  id: string;
  engine: string;
  mentioned: boolean;
  mentionContext: string | null;
  sentiment: string | null;
  analysis: string | null;
  recommendations: string | null;
  response: string;
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

const statusConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  completed: { icon: CheckCircle2, color: "text-emerald-600", label: "Completed" },
  running: { icon: Loader2, color: "text-blue-500", label: "Running" },
  pending: { icon: Clock, color: "text-amber-500", label: "Pending" },
  failed: { icon: XCircle, color: "text-red-500", label: "Failed" },
};

function ScanRow({ scan }: { scan: Scan }) {
  const [expanded, setExpanded] = useState(false);
  const config = statusConfig[scan.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="border border-surface-200 rounded-xl bg-white overflow-hidden card-hover">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-surface-50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-surface-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-surface-400 flex-shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-surface-900">
              Scan &mdash; {formatDateTime(scan.createdAt)}
            </div>
            <div className="text-xs text-surface-500 mt-0.5">
              {scan.results.length} results across{" "}
              {new Set(scan.results.map((r) => r.engine)).size} engines
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {scan.totalScore !== null && (
            <div
              className={`text-2xl font-bold ${getScoreColor(scan.totalScore)}`}
            >
              {scan.totalScore}
            </div>
          )}
          <div className={`flex items-center gap-1.5 ${config.color}`}>
            <StatusIcon
              className={`w-4 h-4 ${scan.status === "running" ? "animate-spin" : ""}`}
            />
            <span className="text-xs font-medium">{config.label}</span>
          </div>
        </div>
      </button>

      {expanded && scan.results.length > 0 && (
        <div className="border-t border-surface-100 p-5">
          <div className="space-y-4">
            {/* Group results by prompt */}
            {[...new Set(scan.results.map((r) => r.prompt.id))].map(
              (promptId) => {
                const promptResults = scan.results.filter(
                  (r) => r.prompt.id === promptId
                );
                const promptText = promptResults[0]?.prompt.text;
                const category = promptResults[0]?.prompt.category;

                return (
                  <div key={promptId} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 bg-surface-100 text-surface-500 rounded">
                        {category}
                      </span>
                      <span className="text-sm font-medium text-surface-800">
                        {promptText}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-4">
                      {promptResults.map((result) => (
                        <div
                          key={result.id}
                          className={`rounded-lg border p-3 text-xs ${
                            result.mentioned
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-red-100 bg-red-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-surface-700">
                              {getEngineIcon(result.engine)}{" "}
                              {getEngineDisplayName(result.engine)}
                            </span>
                            <span
                              className={`font-bold ${
                                result.mentioned
                                  ? "text-emerald-600"
                                  : "text-red-500"
                              }`}
                            >
                              {result.mentioned ? "Mentioned" : "Not Found"}
                            </span>
                          </div>
                          {result.mentionContext && (
                            <p className="text-surface-500 italic mt-1 line-clamp-2">
                              {result.mentionContext}
                            </p>
                          )}
                          {result.analysis && (
                            <p className="text-surface-600 mt-2 leading-relaxed">
                              {result.analysis}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ScansContent({
  scans,
  businessId,
  businessName,
}: {
  scans: Scan[];
  businessId: string;
  businessName: string;
}) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const handleRunScan = async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });

      if (res.ok) {
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Scan History</h1>
          <p className="text-surface-500 text-sm mt-0.5">
            All visibility scans for {businessName}
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
              New Scan
            </>
          )}
        </button>
      </div>

      {scans.length === 0 ? (
        <div className="rounded-xl border border-surface-200 bg-white p-12 text-center">
          <AlertCircle className="w-8 h-8 text-surface-300 mx-auto mb-3" />
          <p className="text-surface-500 text-sm">
            No scans yet. Run your first scan to check your AI visibility.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => (
            <ScanRow key={scan.id} scan={scan} />
          ))}
        </div>
      )}
    </div>
  );
}
