import Link from "next/link";
import { ArrowRight, TrendingUp, BarChart3, Newspaper, FileText, Zap } from "lucide-react";
import { ArticleCard } from "@/components/news/ArticleCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MarketIndexChart } from "@/components/charts/MarketIndexChart";
import { StockTable } from "@/components/charts/StockTable";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { buildPageMetadata, generateOrganizationJsonLd } from "@/lib/seo";
import {
  getLatestArticles,
  getFeaturedArticles,
  getBreakingNews,
  getDailyBriefing,
  getTopGainers,
  getTopLosers,
  getMarketData,
  getEconomicIndicators,
} from "@/lib/data";
import { formatDate, getMarketColor, formatPercent, formatNumber } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Lanka Market Pulse",
  description:
    "Sri Lanka's premier financial news platform. Real-time stock market updates, business news, economic reports, and AI-powered market briefings.",
  path: "/",
});

// Generate sample chart data
function generateChartData() {
  const data = [];
  let value = 11100;
  for (let i = 0; i < 30; i++) {
    value += (Math.random() - 0.45) * 50;
    data.push({
      time: `Day ${i + 1}`,
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
}

export default function HomePage() {
  const latestArticles = getLatestArticles(6);
  const featuredArticles = getFeaturedArticles(3);
  const breakingNews = getBreakingNews();
  const briefing = getDailyBriefing();
  const gainers = getTopGainers(5);
  const losers = getTopLosers(5);
  const marketData = getMarketData();
  const economicIndicators = getEconomicIndicators();
  const chartData = generateChartData();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationJsonLd()),
        }}
      />

      {/* Hero Section - Daily Briefing */}
      {briefing && (
        <section className="mb-8">
          <div className="bg-gradient-to-r from-lanka-accent/10 to-lanka-blue/10 border border-lanka-accent/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-lanka-accent" />
              <h2 className="text-lg font-bold text-lanka-text-primary">
                Daily AI Market Briefing - {formatDate(briefing.date)}
              </h2>
            </div>
            <p className="text-sm text-lanka-text-secondary leading-relaxed mb-4">
              {briefing.summary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold text-lanka-text-muted uppercase mb-2">
                  Key Highlights
                </h3>
                <ul className="space-y-1">
                  {briefing.keyHighlights.slice(0, 4).map((highlight, i) => (
                    <li key={i} className="text-sm text-lanka-text-secondary flex items-start gap-2">
                      <span className="text-lanka-accent mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-lanka-text-muted uppercase mb-2">
                  Economic Updates
                </h3>
                <ul className="space-y-1">
                  {briefing.economicUpdates.map((update, i) => (
                    <li key={i} className="text-sm text-lanka-text-secondary flex items-start gap-2">
                      <span className="text-lanka-blue mt-1">•</span>
                      {update}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-sm text-lanka-text-muted italic">
                <span className="font-medium text-lanka-text-secondary">Outlook:</span>{" "}
                {briefing.outlook}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Market Overview */}
      <section className="mb-8">
        <SectionHeader
          title="Market Overview"
          subtitle="Real-time Colombo Stock Exchange data"
          action={
            <Link
              href="/stock-market/"
              className="text-sm text-lanka-accent hover:text-lanka-accent-dim flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Indices */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {marketData.map((data) => (
                <div
                  key={data.index}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-lanka-text-primary">
                      {data.index}
                    </span>
                    <BarChart3 className="w-4 h-4 text-lanka-text-muted" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-lanka-text-primary">
                    {formatNumber(data.value, 2)}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${getMarketColor(data.change)}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">
                      {data.change > 0 ? "+" : ""}
                      {formatNumber(data.change, 2)} ({formatPercent(data.changePercent)})
                    </span>
                  </div>
                  <div className="mt-3 h-24">
                    <MarketIndexChart data={chartData} height={96} />
                  </div>
                </div>
              ))}
            </div>

            {/* Economic Indicators */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-lanka-text-primary mb-3">
                Key Economic Indicators
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {economicIndicators.map((indicator) => (
                  <div
                    key={indicator.name}
                    className="bg-muted/50 rounded-lg p-3"
                  >
                    <div className="text-xs text-lanka-text-muted mb-1">
                      {indicator.name}
                    </div>
                    <div className="text-lg font-bold font-mono text-lanka-text-primary">
                      {indicator.value}
                      <span className="text-xs ml-0.5">{indicator.unit}</span>
                    </div>
                    <div className={`text-xs ${getMarketColor(indicator.change)}`}>
                      {formatPercent(indicator.changePercent)} from prev
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Top Gainers */}
            <StockTable stocks={gainers} title="Top Gainers" showVolume={false} limit={5} />

            {/* Top Losers */}
            <StockTable stocks={losers} title="Top Losers" showVolume={false} limit={5} />

            {/* Ad Placeholder */}
            <AdPlaceholder label="Advertisement" className="h-[250px]" />
          </div>
        </div>
      </section>

      {/* Breaking News */}
      {breakingNews.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title="Breaking News"
            subtitle="Latest developments from Sri Lanka"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {breakingNews.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="breaking" />
            ))}
          </div>
        </section>
      )}

      {/* Featured Articles */}
      <section className="mb-8">
        <SectionHeader
          title="Featured Reports"
          subtitle="In-depth analysis and market insights"
          action={
            <Link
              href="/daily-reports/"
              className="text-sm text-lanka-accent hover:text-lanka-accent-dim flex items-center gap-1 transition-colors"
            >
              All Reports <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="featured" />
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="mb-8">
        <SectionHeader
          title="Latest News"
          subtitle="Stay updated with the latest market developments"
          action={
            <Link
              href="/business/"
              className="text-sm text-lanka-accent hover:text-lanka-accent-dim flex items-center gap-1 transition-colors"
            >
              All News <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main news column */}
          <div className="lg:col-span-2 space-y-4">
            {latestArticles.slice(0, 4).map((article) => (
              <ArticleCard key={article.slug} article={article} variant="default" />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-lanka-text-primary mb-3 flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-lanka-accent" />
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "IMF Review",
                  "Banking Earnings",
                  "5G Expansion",
                  "Tourism Recovery",
                  "Inflation",
                  "Exchange Rates",
                  "Dividends",
                  "CSE Updates",
                ].map((tag) => (
                  <Link
                    key={tag}
                    href={`/search/?q=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 bg-muted text-xs text-lanka-text-secondary rounded-full hover:bg-lanka-accent/10 hover:text-lanka-accent transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            <AdPlaceholder label="Advertisement" className="h-[250px]" />

            {/* Quick Links */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-lanka-text-primary mb-3">
                Quick Links
              </h3>
              <div className="space-y-2">
                <QuickLink href="/stock-market/" icon={<BarChart3 className="w-4 h-4" />}>
                  Stock Market
                </QuickLink>
                <QuickLink href="/business/" icon={<Newspaper className="w-4 h-4" />}>
                  Business News
                </QuickLink>
                <QuickLink href="/economic/" icon={<TrendingUp className="w-4 h-4" />}>
                  Economic News
                </QuickLink>
                <QuickLink href="/daily-reports/" icon={<FileText className="w-4 h-4" />}>
                  Daily Reports
                </QuickLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In-article Ad */}
      <AdPlaceholder label="Advertisement" className="h-[90px] w-full mb-8" />

      {/* More Articles */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestArticles.slice(4, 8).map((article) => (
            <ArticleCard key={article.slug} article={article} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm text-lanka-text-secondary hover:text-lanka-accent"
    >
      {icon}
      {children}
    </Link>
  );
}
