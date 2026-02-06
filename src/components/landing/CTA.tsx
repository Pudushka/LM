import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative rounded-3xl border border-border bg-card/50 p-12 md:p-16 text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to Own
              <br />
              <span className="gradient-text">AI Search?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Join thousands of forward-thinking brands already optimizing their
              AI search presence with GeoNexo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3.5 rounded-xl transition-all"
              >
                Start Free Trial
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
