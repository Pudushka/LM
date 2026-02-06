import {
  Search,
  BarChart3,
  Brain,
  Globe,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "AI Search Monitoring",
    description:
      "Track how ChatGPT, Perplexity, Gemini, and other AI engines reference your brand in real-time.",
  },
  {
    icon: BarChart3,
    title: "Visibility Analytics",
    description:
      "Comprehensive dashboards showing your brand's AI search presence, mention frequency, and trend data.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get actionable recommendations to improve how AI systems understand and recommend your content.",
  },
  {
    icon: Globe,
    title: "Multi-Engine Coverage",
    description:
      "Monitor across 10+ AI search platforms including ChatGPT, Perplexity, Gemini, Claude, and more.",
  },
  {
    icon: Zap,
    title: "Real-Time Alerts",
    description:
      "Instant notifications when your brand's AI visibility changes, sentiment shifts, or new mentions appear.",
  },
  {
    icon: Shield,
    title: "Competitor Intelligence",
    description:
      "Benchmark your AI search performance against competitors and discover gaps in your strategy.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to
            <br />
            <span className="gradient-text">Win AI Search</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A complete toolkit for monitoring, analyzing, and optimizing your
            brand&apos;s presence across AI-powered search engines.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-border bg-card/50 hover:bg-card/80 transition-all hover:border-primary/30"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
