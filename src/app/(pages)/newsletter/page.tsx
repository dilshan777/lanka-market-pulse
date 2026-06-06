import { Mail, CheckCircle, Bell, Zap, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Newsletter",
  description:
    "Subscribe to Lanka Market Pulse daily briefing. Get Sri Lankan stock market updates, business news, and economic reports delivered to your inbox.",
  path: "/newsletter/",
});

export default function NewsletterPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Newsletter" }]} />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lanka-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-lanka-accent" />
          </div>
          <h1 className="text-3xl font-bold text-lanka-text-primary mb-3">
            Daily Market Briefing
          </h1>
          <p className="text-lanka-text-secondary">
            Get Sri Lanka&apos;s most comprehensive financial newsletter delivered to your inbox every morning.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <BenefitCard
            icon={<Zap className="w-5 h-5" />}
            title="AI-Powered"
            description="AI-generated summaries of market movements"
          />
          <BenefitCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Market Data"
            description="Real-time CSE updates and analysis"
          />
          <BenefitCard
            icon={<Bell className="w-5 h-5" />}
            title="Breaking News"
            description="Instant alerts on major developments"
          />
        </div>

        {/* Signup Form */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-lanka-text-primary mb-4">
            Subscribe Now
          </h2>
          <form
            action="https://formspree.io/f/YOUR_FORM_ID"
            method="POST"
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-lanka-text-secondary mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-lanka-text-muted focus:outline-none focus:ring-2 focus:ring-lanka-accent"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-lanka-text-secondary mb-1">
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-lanka-text-muted focus:outline-none focus:ring-2 focus:ring-lanka-accent"
              />
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                required
                className="mt-1 w-4 h-4 rounded border-border text-lanka-accent focus:ring-lanka-accent"
              />
              <label htmlFor="consent" className="text-xs text-lanka-text-muted">
                I agree to receive the Lanka Market Pulse daily briefing and accept the{" "}
                <a href="/privacy/" className="text-lanka-accent hover:underline">Privacy Policy</a>.
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-lanka-accent text-lanka-dark rounded-lg font-semibold hover:bg-lanka-accent-dim transition-colors"
            >
              Subscribe to Daily Briefing
            </button>
          </form>
          <p className="text-xs text-lanka-text-muted mt-4 text-center">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>

        {/* What You Get */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-lanka-text-primary">What You&apos;ll Receive</h2>
          <div className="space-y-3">
            <FeatureItem text="Daily ASPI and S&P SL20 index summary" />
            <FeatureItem text="Top gainers and losers with analysis" />
            <FeatureItem text="Economic indicator updates (inflation, rates, reserves)" />
            <FeatureItem text="Breaking business and corporate news" />
            <FeatureItem text="Dividend announcements and earnings alerts" />
            <FeatureItem text="Weekly market outlook and technical analysis" />
          </div>
        </div>

        <AdPlaceholder label="Advertisement" className="h-[250px]" />
      </div>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <div className="text-lanka-accent mb-2 flex justify-center">{icon}</div>
      <h3 className="text-sm font-semibold text-lanka-text-primary mb-1">{title}</h3>
      <p className="text-xs text-lanka-text-muted">{description}</p>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-lanka-accent flex-shrink-0" />
      <span className="text-sm text-lanka-text-secondary">{text}</span>
    </div>
  );
}
