import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/news/ArticleCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { buildPageMetadata } from "@/lib/seo";
import { getArticlesByCategory, getEconomicIndicators, getExchangeRates } from "@/lib/data";
import { getMarketColor, formatPercent } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Economic News",
  description:
    "Sri Lanka economic news including inflation updates, interest rates, exchange rates, government economic announcements, and IMF-related developments.",
  path: "/economic/",
  keywords: ["Sri Lanka economy", "inflation", "interest rates", "exchange rates", "IMF", "CBSL"],
});

export default function EconomicPage() {
  const articles = getArticlesByCategory("economic");
  const indicators = getEconomicIndicators();
  const exchangeRates = getExchangeRates();

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Economic News" }]} />

      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-8 h-8 text-lanka-accent" />
        <div>
          <h1 className="text-3xl font-bold text-lanka-text-primary">Economic News</h1>
          <p className="text-sm text-lanka-text-muted">Macroeconomic indicators and policy updates</p>
        </div>
      </div>

      {/* Economic Indicators Dashboard */}
      <section className="mb-8">
        <SectionHeader title="Key Economic Indicators" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {indicators.map((indicator) => (
            <div key={indicator.name} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs text-lanka-text-muted mb-2">{indicator.name}</div>
              <div className="text-2xl font-bold font-mono text-lanka-text-primary">
                {indicator.value}
                <span className="text-sm ml-0.5">{indicator.unit}</span>
              </div>
              <div className={`text-xs mt-1 ${getMarketColor(indicator.change)}`}>
                {formatPercent(indicator.changePercent)} from {indicator.previousValue} {indicator.unit}
              </div>
              <div className="text-[10px] text-lanka-text-muted mt-2">
                {indicator.period} • {indicator.source}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exchange Rates */}
      <section className="mb-8">
        <SectionHeader title="Exchange Rates" />
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-lanka-text-muted uppercase">
                  <th className="text-left px-4 py-3 font-medium">Currency</th>
                  <th className="text-right px-4 py-3 font-medium">Code</th>
                  <th className="text-right px-4 py-3 font-medium">Rate (LKR)</th>
                  <th className="text-right px-4 py-3 font-medium">Change</th>
                  <th className="text-right px-4 py-3 font-medium">% Change</th>
                </tr>
              </thead>
              <tbody>
                {exchangeRates.map((rate) => (
                  <tr key={rate.code} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-lanka-text-primary font-medium">{rate.currency}</td>
                    <td className="px-4 py-3 text-right font-mono text-lanka-text-secondary">{rate.code}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-lanka-text-primary">
                      {rate.rate.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-mono ${getMarketColor(rate.change)}`}>
                      {rate.change > 0 ? "+" : ""}{rate.change.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        rate.changePercent > 0
                          ? "bg-lanka-green/10 text-lanka-green"
                          : rate.changePercent < 0
                            ? "bg-lanka-red/10 text-lanka-red"
                            : "bg-gray-500/10 text-lanka-text-muted"
                      }`}>
                        {formatPercent(rate.changePercent)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles */}
        <div className="lg:col-span-2 space-y-6">
          {articles.length > 0 ? (
            <section>
              <SectionHeader title="Economic News & Analysis" />
              <div className="space-y-4">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="default" />
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center py-16">
              <TrendingUp className="w-12 h-12 text-lanka-text-muted mx-auto mb-4" />
              <p className="text-lanka-text-muted">No economic articles available yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <AdPlaceholder label="Advertisement" className="h-[250px]" />

          {/* Quick Links */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-lanka-text-primary mb-4">Economic Resources</h3>
            <div className="space-y-2">
              {[
                { label: "CBSL Policy Rates", href: "https://www.cbsl.gov.lk" },
                { label: "Department of Census", href: "https://www.statistics.gov.lk" },
                { label: "IMF Sri Lanka", href: "https://www.imf.org/srilanka" },
                { label: "Treasury Updates", href: "https://www.treasury.gov.lk" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-sm text-lanka-text-secondary hover:text-lanka-accent"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          <AdPlaceholder label="Advertisement" className="h-[250px]" />
        </aside>
      </div>
    </div>
  );
}
