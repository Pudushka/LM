import { Plug, Scan, LineChart, Rocket } from "lucide-react";

const steps = [
  {
    icon: Plug,
    step: "01",
    title: "Connect Your Brand",
    description:
      "Add your brand name, domain, and key products. GeoNexo begins scanning AI search engines immediately.",
  },
  {
    icon: Scan,
    step: "02",
    title: "Monitor AI Mentions",
    description:
      "Our engine queries AI platforms with thousands of relevant prompts to discover how they mention your brand.",
  },
  {
    icon: LineChart,
    step: "03",
    title: "Analyze Performance",
    description:
      "View detailed analytics on visibility scores, sentiment analysis, and competitive positioning.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Optimize & Grow",
    description:
      "Follow AI-powered recommendations to improve your brand's presence in AI search results.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Get Started in <span className="gradient-text">Minutes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Four simple steps to dominate AI search results and drive organic
            growth.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-card border border-border mb-6">
                  <item.icon size={28} className="text-primary" />
                  <span className="absolute -top-2 -right-2 text-xs font-bold bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
