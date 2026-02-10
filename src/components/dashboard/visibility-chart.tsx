"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ScanResult {
  engine: string;
  mentioned: boolean;
}

interface Scan {
  id: string;
  createdAt: string;
  results: ScanResult[];
}

function computeEngineScore(results: ScanResult[], engine: string): number {
  const engineResults = results.filter((r) => r.engine === engine);
  if (engineResults.length === 0) return 0;
  const mentioned = engineResults.filter((r) => r.mentioned).length;
  return Math.round((mentioned / engineResults.length) * 100);
}

export function VisibilityChart({ scans }: { scans: Scan[] }) {
  const data = [...scans]
    .reverse()
    .map((scan) => ({
      date: new Date(scan.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      ChatGPT: computeEngineScore(scan.results, "chatgpt"),
      Claude: computeEngineScore(scan.results, "claude"),
      Gemini: computeEngineScore(scan.results, "gemini"),
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
          width={35}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "13px" }}
        />
        <Line
          type="monotone"
          dataKey="ChatGPT"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="Claude"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="Gemini"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
