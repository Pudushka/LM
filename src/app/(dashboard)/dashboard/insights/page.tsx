import DashboardHeader from "@/components/dashboard/DashboardHeader";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const insights = [
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "Rising query: 'AI content optimization'",
    description:
      "This query has seen a 340% increase in AI search volume. Your brand is not yet being mentioned. Create targeted content to capture this opportunity.",
    impact: "High",
    action: "Create Content",
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Competitor gaining visibility on Perplexity",
    description:
      "Competitor A has overtaken your position for 'AI search tools' queries on Perplexity. Their recent blog post is being frequently cited.",
    impact: "Medium",
    action: "Analyze Competitor",
  },
  {
    type: "success",
    icon: CheckCircle2,
    title: "Strong presence on ChatGPT for brand queries",
    description:
      "Your brand is mentioned in 92% of relevant ChatGPT queries with positive sentiment. Keep maintaining your current content strategy.",
    impact: "Positive",
    action: "View Details",
  },
  {
    type: "opportunity",
    icon: Lightbulb,
    title: "Optimize FAQ schema for AI engines",
    description:
      "Adding structured FAQ content to your key pages could improve how AI engines understand and cite your expertise. Estimated +15% visibility boost.",
    impact: "High",
    action: "View Guide",
  },
  {
    type: "warning",
    icon: AlertTriangle,
    title: "Inconsistent brand description across AI engines",
    description:
      "Gemini and Claude describe your product differently than ChatGPT. Standardizing your messaging could improve consistency by 30%.",
    impact: "Medium",
    action: "Fix Issues",
  },
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "New AI engine: Meta AI gaining traction",
    description:
      "Meta AI search is growing rapidly. Early optimization could establish your brand presence before competitors enter this space.",
    impact: "High",
    action: "Explore",
  },
];

const typeConfig = {
  opportunity: {
    bg: "bg-primary/5",
    border: "border-primary/20",
    badge: "bg-primary/10 text-primary",
    badgeLabel: "Opportunity",
  },
  warning: {
    bg: "bg-yellow-500/5",
    border: "border-yellow-500/20",
    badge: "bg-yellow-500/10 text-yellow-400",
    badgeLabel: "Warning",
  },
  success: {
    bg: "bg-green-500/5",
    border: "border-green-500/20",
    badge: "bg-green-500/10 text-green-400",
    badgeLabel: "Success",
  },
};

export default function InsightsPage() {
  return (
    <>
      <DashboardHeader
        title="AI Insights"
        subtitle="AI-powered recommendations to improve your search visibility"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-border bg-card/50 p-5 text-center">
          <div className="text-3xl font-bold gradient-text mb-1">6</div>
          <p className="text-sm text-muted-foreground">Active Insights</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/50 p-5 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">3</div>
          <p className="text-sm text-muted-foreground">Opportunities</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/50 p-5 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">2</div>
          <p className="text-sm text-muted-foreground">Warnings</p>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type as keyof typeof typeConfig];
          return (
            <div
              key={i}
              className={`rounded-2xl border ${config.border} ${config.bg} p-6 transition-all hover:border-primary/30`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                  <insight.icon size={18} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${config.badge}`}
                    >
                      {config.badgeLabel}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        insight.impact === "High"
                          ? "bg-red-500/10 text-red-400"
                          : insight.impact === "Medium"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {insight.impact} Impact
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
                <button className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted/50 hover:bg-muted text-sm font-medium transition-colors border border-border">
                  {insight.action}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
