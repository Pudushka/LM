import DashboardHeader from "@/components/dashboard/DashboardHeader";

const queryData = [
  { query: "best AI search optimization tools", mentions: 89, trend: "+15%", engines: ["ChatGPT", "Perplexity", "Gemini"] },
  { query: "AI SEO platform", mentions: 67, trend: "+22%", engines: ["ChatGPT", "Claude"] },
  { query: "how to optimize for AI search", mentions: 54, trend: "+8%", engines: ["Perplexity", "Gemini"] },
  { query: "brand visibility AI engines", mentions: 43, trend: "+31%", engines: ["ChatGPT", "Perplexity", "Claude"] },
  { query: "AI search analytics tools", mentions: 38, trend: "+12%", engines: ["ChatGPT", "Gemini"] },
  { query: "monitor AI search mentions", mentions: 29, trend: "+19%", engines: ["Perplexity"] },
  { query: "AI search ranking factors", mentions: 24, trend: "+5%", engines: ["ChatGPT", "Claude", "Gemini"] },
  { query: "optimize content for ChatGPT", mentions: 21, trend: "+42%", engines: ["ChatGPT"] },
];

const sentimentBreakdown = [
  { label: "Positive", percentage: 72, color: "bg-green-500" },
  { label: "Neutral", percentage: 22, color: "bg-yellow-500" },
  { label: "Negative", percentage: 6, color: "bg-red-500" },
];

const competitorData = [
  { name: "GeoNexo", score: 87, change: "+12%" },
  { name: "Competitor A", score: 74, change: "+5%" },
  { name: "Competitor B", score: 68, change: "-2%" },
  { name: "Competitor C", score: 61, change: "+8%" },
  { name: "Competitor D", score: 53, change: "+1%" },
];

export default function AnalyticsPage() {
  return (
    <>
      <DashboardHeader
        title="Analytics"
        subtitle="Deep dive into your AI search performance data"
      />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Sentiment Breakdown */}
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h3 className="font-semibold mb-6">Sentiment Analysis</h3>

          {/* Sentiment bar */}
          <div className="flex rounded-full overflow-hidden h-4 mb-6">
            {sentimentBreakdown.map((s) => (
              <div
                key={s.label}
                className={`${s.color}`}
                style={{ width: `${s.percentage}%` }}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {sentimentBreakdown.map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span className="text-sm text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                <span className="text-2xl font-bold">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Benchmark */}
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h3 className="font-semibold mb-6">Competitor Benchmark</h3>
          <div className="space-y-4">
            {competitorData.map((comp, i) => (
              <div key={comp.name} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-4">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm ${
                        i === 0 ? "font-semibold text-primary" : ""
                      }`}
                    >
                      {comp.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comp.score}</span>
                      <span
                        className={`text-xs ${
                          comp.change.startsWith("+")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {comp.change}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        i === 0
                          ? "bg-gradient-to-r from-primary to-cyan-500"
                          : "bg-muted-foreground/30"
                      }`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Queries */}
      <div className="rounded-2xl border border-border bg-card/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Top Queries</h3>
          <button className="text-xs text-primary hover:underline">
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 font-medium">#</th>
                <th className="text-left py-3 font-medium">Query</th>
                <th className="text-left py-3 font-medium">Mentions</th>
                <th className="text-left py-3 font-medium">Trend</th>
                <th className="text-left py-3 font-medium">Engines</th>
              </tr>
            </thead>
            <tbody>
              {queryData.map((q, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20"
                >
                  <td className="py-3 text-muted-foreground">{i + 1}</td>
                  <td className="py-3 font-medium">{q.query}</td>
                  <td className="py-3">{q.mentions}</td>
                  <td className="py-3 text-green-400">{q.trend}</td>
                  <td className="py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {q.engines.map((e) => (
                        <span
                          key={e}
                          className="px-2 py-0.5 rounded-md bg-muted/50 text-xs text-muted-foreground"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
