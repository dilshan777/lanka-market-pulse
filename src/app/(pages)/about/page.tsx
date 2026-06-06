import { Info, Target, Eye, Users } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description:
    "Learn about Lanka Market Pulse - Sri Lanka's premier financial news platform providing real-time stock market updates, business news, and AI-powered market briefings.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "About Us" }]} />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lanka-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-lanka-accent" />
          </div>
          <h1 className="text-3xl font-bold text-lanka-text-primary mb-3">About Lanka Market Pulse</h1>
          <p className="text-lanka-text-secondary">
            Sri Lanka&apos;s premier financial news platform
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-lanka-accent" />
              <h2 className="text-xl font-semibold text-lanka-text-primary">Our Mission</h2>
            </div>
            <p className="text-lanka-text-secondary leading-relaxed">
              Lanka Market Pulse is dedicated to providing timely, accurate, and comprehensive financial 
              information to investors, businesses, and the general public in Sri Lanka. We aggregate news 
              from multiple sources, analyze market data, and deliver AI-powered insights to help our readers 
              make informed financial decisions.
            </p>
          </section>

          {/* What We Cover */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-lanka-accent" />
              <h2 className="text-xl font-semibold text-lanka-text-primary">What We Cover</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CoverageItem title="Stock Market" description="Real-time CSE updates, ASPI, S&P SL20, stock prices" />
              <CoverageItem title="Business News" description="Corporate announcements, sector updates, M&A" />
              <CoverageItem title="Economic Data" description="Inflation, interest rates, exchange rates, GDP" />
              <CoverageItem title="Dividends" description="Dividend announcements, ex-dates, payment dates" />
              <CoverageItem title="Earnings" description="Quarterly earnings reports, analyst estimates" />
              <CoverageItem title="AI Briefings" description="Daily AI-generated market summaries and outlook" />
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-lanka-accent" />
              <h2 className="text-xl font-semibold text-lanka-text-primary">How It Works</h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-lanka-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-lanka-accent">1</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-lanka-text-primary">Data Collection</h3>
                  <p className="text-sm text-lanka-text-secondary">
                    We collect data from Colombo Stock Exchange feeds, news agencies, government sources, 
                    and financial institutions using automated workflows.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-lanka-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-lanka-accent">2</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-lanka-text-primary">AI Processing</h3>
                  <p className="text-sm text-lanka-text-secondary">
                    Our AI systems analyze the data, generate summaries, create SEO-friendly headlines, 
                    and produce daily market briefings.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-lanka-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-lanka-accent">3</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-lanka-text-primary">Publication</h3>
                  <p className="text-sm text-lanka-text-secondary">
                    Content is automatically published to our static website, ensuring fast loading 
                    times and optimal SEO performance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Our Technology</h2>
            <p className="text-lanka-text-secondary leading-relaxed mb-4">
              Lanka Market Pulse is built on a modern, static website architecture designed for speed, 
              reliability, and scalability:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "AWS S3", "CloudFront", "n8n", "AI/LLM"].map(
                (tech) => (
                  <div
                    key={tech}
                    className="px-3 py-2 bg-muted rounded-lg text-sm text-lanka-text-secondary text-center"
                  >
                    {tech}
                  </div>
                )
              )}
            </div>
          </section>
        </div>

        <div className="mt-8">
          <AdPlaceholder label="Advertisement" className="h-[250px]" />
        </div>
      </div>
    </div>
  );
}

function CoverageItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <h3 className="text-sm font-semibold text-lanka-text-primary mb-1">{title}</h3>
      <p className="text-xs text-lanka-text-muted">{description}</p>
    </div>
  );
}
