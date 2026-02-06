import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground mb-8">
          <Sparkles size={14} className="text-primary" />
          <span>AI Search Optimization Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Dominate AI
          <br />
          <span className="gradient-text">Search Results</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Monitor and optimize how AI search engines like ChatGPT, Perplexity,
          and Gemini discover, interpret, and recommend your brand.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3.5 rounded-xl transition-all text-base"
          >
            Start Free Trial
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-2 border border-border text-foreground hover:bg-muted/50 font-medium px-8 py-3.5 rounded-xl transition-colors text-base"
          >
            See How It Works
          </Link>
        </div>

        {/* Social Proof */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-cyan-500/60"
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by <span className="text-foreground font-medium">2,000+</span> marketing teams worldwide
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="glow rounded-2xl">
            <div className="rounded-2xl border border-border bg-card/80 p-2">
              <div className="rounded-xl bg-surface overflow-hidden aspect-[16/9] flex items-center justify-center">
                <div className="w-full h-full p-6">
                  {/* Mock Dashboard */}
                  <div className="flex gap-4 h-full">
                    {/* Sidebar mock */}
                    <div className="hidden md:block w-48 bg-muted/30 rounded-lg p-3 space-y-2">
                      {["Overview", "Analytics", "Insights", "Settings"].map(
                        (item) => (
                          <div
                            key={item}
                            className="h-8 rounded bg-muted/40 flex items-center px-3 text-xs text-muted-foreground"
                          >
                            {item}
                          </div>
                        )
                      )}
                    </div>
                    {/* Main content mock */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "AI Visibility", value: "87%" },
                          { label: "Mentions", value: "1.2K" },
                          { label: "Sentiment", value: "+94%" },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="bg-muted/30 rounded-lg p-3"
                          >
                            <div className="text-xs text-muted-foreground">
                              {stat.label}
                            </div>
                            <div className="text-lg font-bold gradient-text">
                              {stat.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 bg-muted/20 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-3">
                          AI Search Trend
                        </div>
                        <div className="flex items-end gap-1 h-24">
                          {[40, 55, 35, 65, 50, 80, 70, 90, 75, 95, 85, 92].map(
                            (h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-sm bg-gradient-to-t from-primary/80 to-cyan-500/60"
                                style={{ height: `${h}%` }}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
