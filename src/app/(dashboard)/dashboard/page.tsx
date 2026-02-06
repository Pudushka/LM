import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  TrendingUp,
  Eye,
  MessageSquare,
  ThumbsUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    label: "AI Visibility Score",
    value: "87.4",
    unit: "%",
    change: "+12.3%",
    positive: true,
    icon: Eye,
  },
  {
    label: "Total AI Mentions",
    value: "1,247",
    unit: "",
    change: "+8.7%",
    positive: true,
    icon: MessageSquare,
  },
  {
    label: "Positive Sentiment",
    value: "94.2",
    unit: "%",
    change: "+3.1%",
    positive: true,
    icon: ThumbsUp,
  },
  {
    label: "Search Trend",
    value: "↑ Rising",
    unit: "",
    change: "+24.5%",
    positive: true,
    icon: TrendingUp,
  },
];

const recentMentions = [
  {
    engine: "ChatGPT",
    query: "best AI search optimization tools",
    position: 1,
    sentiment: "Positive",
    time: "2 min ago",
  },
  {
    engine: "Perplexity",
    query: "how to optimize for AI search",
    position: 3,
    sentiment: "Positive",
    time: "15 min ago",
  },
  {
    engine: "Gemini",
    query: "AI SEO platforms comparison",
    position: 2,
    sentiment: "Neutral",
    time: "1 hour ago",
  },
  {
    engine: "Claude",
    query: "AI visibility monitoring tools",
    position: 1,
    sentiment: "Positive",
    time: "2 hours ago",
  },
  {
    engine: "ChatGPT",
    query: "brand monitoring in AI search",
    position: 4,
    sentiment: "Positive",
    time: "3 hours ago",
  },
];

const engineData = [
  { name: "ChatGPT", score: 92, mentions: 456, color: "from-green-500 to-emerald-600" },
  { name: "Perplexity", score: 87, mentions: 312, color: "from-blue-500 to-cyan-500" },
  { name: "Gemini", score: 79, mentions: 245, color: "from-yellow-500 to-orange-500" },
  { name: "Claude", score: 85, mentions: 189, color: "from-primary to-violet-500" },
  { name: "Copilot", score: 71, mentions: 45, color: "from-cyan-500 to-teal-500" },
];

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Overview"
        subtitle="Your AI search performance at a glance"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card/50 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon size={16} className="text-primary" />
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.positive ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.positive ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {stat.value}
              <span className="text-sm text-muted-foreground font-normal">
                {stat.unit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">AI Visibility Trend</h3>
            <div className="flex items-center gap-2 text-xs">
              {["7D", "30D", "90D"].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    period === "30D"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart visualization */}
          <div className="flex items-end gap-[3px] h-48">
            {[
              45, 52, 48, 61, 55, 67, 62, 70, 65, 73, 78, 72, 80, 75, 82, 79,
              85, 81, 87, 83, 89, 85, 88, 84, 90, 87, 92, 89, 91, 87,
            ].map((value, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/80 to-cyan-500/60 hover:from-primary hover:to-cyan-400 transition-colors cursor-pointer"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            <span>Feb 1</span>
            <span>Feb 15</span>
            <span>Mar 1</span>
          </div>
        </div>

        {/* Engine Breakdown */}
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h3 className="font-semibold mb-6">Engine Breakdown</h3>
          <div className="space-y-4">
            {engineData.map((engine) => (
              <div key={engine.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span>{engine.name}</span>
                  <span className="text-muted-foreground">
                    {engine.score}% · {engine.mentions} mentions
                  </span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${engine.color}`}
                    style={{ width: `${engine.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Mentions Table */}
      <div className="mt-6 rounded-2xl border border-border bg-card/50 p-6">
        <h3 className="font-semibold mb-4">Recent AI Mentions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 font-medium">Engine</th>
                <th className="text-left py-3 font-medium">Query</th>
                <th className="text-left py-3 font-medium">Position</th>
                <th className="text-left py-3 font-medium">Sentiment</th>
                <th className="text-right py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentMentions.map((mention, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-3 font-medium">{mention.engine}</td>
                  <td className="py-3 text-muted-foreground">
                    {mention.query}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      #{mention.position}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs ${
                        mention.sentiment === "Positive"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {mention.sentiment}
                    </span>
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    {mention.time}
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
