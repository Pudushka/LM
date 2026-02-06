import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "For small brands getting started with AI search optimization.",
    features: [
      "1 brand monitoring",
      "3 AI engines tracked",
      "Weekly reports",
      "Basic analytics dashboard",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For growing teams that need comprehensive AI search insights.",
    features: [
      "5 brands monitoring",
      "10+ AI engines tracked",
      "Daily reports & alerts",
      "Advanced analytics & insights",
      "Competitor benchmarking",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs and dedicated support.",
    features: [
      "Unlimited brands",
      "All AI engines",
      "Real-time monitoring",
      "Custom dashboards",
      "White-label reports",
      "Dedicated CSM",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-wide uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose the plan that fits your needs. All plans include a 14-day
            free trial.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border transition-all ${
                plan.highlighted
                  ? "border-primary bg-card glow scale-[1.02]"
                  : "border-border bg-card/50 hover:border-primary/30"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-5">
                {plan.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <Link
                href="/signup"
                className={`block text-center py-3 rounded-xl font-medium text-sm transition-colors mb-8 ${
                  plan.highlighted
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check size={16} className="text-primary shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
