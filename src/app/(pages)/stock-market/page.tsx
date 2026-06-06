import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, BarChart3, FileText, DollarSign } from "lucide-react";
import { StockTable } from "@/components/charts/StockTable";
import { MarketIndexChart } from "@/components/charts/MarketIndexChart";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArticleCard } from "@/components/news/ArticleCard";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { buildPageMetadata } from "@/lib/seo";
import {
  getMarketData,
  getStocks,
  getTopGainers,
  getTopLosers,
  getDividends,
  getArticlesByCategory,
} from "@/lib/data";
import { formatNumber, formatPercent, getMarketColor } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Stock Market",
  description:
    "Real-time Colombo Stock Exchange updates, top gainers, top losers, dividend announcements, company filings, and earnings reports.",
  path: "/stock-market/",
  keywords: ["CSE", "Colombo Stock Exchange", "ASPI", "S&P SL20", "Sri Lanka stocks", "dividends"],
});

function generateChartData(baseValue: number, points: number) {
  const data = [];
  let value = baseValue - 200;
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.4) * 40;
    data.push({
      time: `${i + 1}`,
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
}

export default function StockMarketPage() {
  const marketData = getMarketData();
  const stocks = getStocks();
  const gainers = getTopGainers(10);
  const losers = getTopLosers(10);
  const dividends = getDividends();
  const articles = getArticlesByCategory("stock-market");

  const aspiChartData = generateChartData(11245, 30);
  const sl20ChartData = generateChartData(3456, 30);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Stock Market" }]} />

      <h1 className="text-3xl font-bold text-lanka-text-primary mb-6">
        Colombo Stock Exchange
      </h1>

      {/* Market Indices */}
      <section className="mb-8">
        <SectionHeader
          title="Market Indices"
          subtitle="Real-time index performance"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketData.map((data) => (
            <div key={data.index} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-lanka-text-primary">{data.index}</h3>
                  <p className="text-xs text-lanka-text-muted">Colombo Stock Exchange</p>
                </div>
                <BarChart3 className="w-6 h-6 text-lanka-accent" />
              </div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold font-mono text-lanka-text-primary">
                    {formatNumber(data.value, 2)}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${getMarketColor(data.change)}`}>
                    {data.change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {data.change > 0 ? "+" : ""}
                      {formatNumber(data.change, 2)} ({formatPercent(data.changePercent)})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-lanka-text-muted">High</div>
                  <div className="text-sm font-mono text-lanka-text-primary">{formatNumber(data.high, 2)}</div>
                  <div className="text-xs text-lanka-text-muted mt-1">Low</div>
                  <div className="text-sm font-mono text-lanka-text-primary">{formatNumber(data.low, 2)}</div>
                </div>
              </div>
              <div className="h-48">
                <MarketIndexChart
                  data={data.index === "ASPI" ? aspiChartData : sl20ChartData}
                  color={data.change >= 0 ? "#00d4aa" : "#ff4d4d"}
                />
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-lanka-text-muted">
                <span>Volume: {formatNumber(data.volume)}</span>
                <span>Last updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Gainers & Losers */}
          <section>
            <SectionHeader
              title="Market Movers"
              subtitle="Top gainers and losers today"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StockTable stocks={gainers} title="Top Gainers" showVolume={true} limit={10} />
              <StockTable stocks={losers} title="Top Losers" showVolume={true} limit={10} />
            </div>
          </section>

          {/* All Stocks */}
          <section>
            <SectionHeader
              title="All Stocks"
              subtitle="Complete market overview"
            />
            <StockTable stocks={stocks} showVolume={true} showMarketCap={true} />
          </section>

          {/* Stock Market News */}
          {articles.length > 0 && (
            <section>
              <SectionHeader
                title="Stock Market News"
                subtitle="Latest updates from the CSE"
                action={
                  <Link
                    href="/business/"
                    className="text-sm text-lanka-accent hover:text-lanka-accent-dim flex items-center gap-1 transition-colors"
                  >
                    All News <ArrowRight className="w-4 h-4" />
                  </Link>
                }
              />
              <div className="space-y-4">
                {articles.slice(0, 4).map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="default" />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Dividend Announcements */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-lanka-accent" />
              <h3 className="text-sm font-semibold text-lanka-text-primary">
                Dividend Announcements
              </h3>
            </div>
            <div className="space-y-3">
              {dividends.map((dividend) => (
                <div
                  key={dividend.symbol}
                  className="p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-semibold text-lanka-accent">
                      {dividend.symbol}
                    </span>
                    <span className="text-xs text-lanka-text-muted">{dividend.dividendType}</span>
                  </div>
                  <div className="text-sm font-medium text-lanka-text-primary">
                    {dividend.company}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-lanka-text-secondary">
                    <span>LKR {dividend.amount.toFixed(2)}</span>
                    <span>Ex: {dividend.exDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdPlaceholder label="Advertisement" className="h-[250px]" />

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-lanka-text-primary mb-4">
              Market Statistics
            </h3>
            <div className="space-y-3">
              <StatRow label="Total Market Cap" value="LKR 4.2T" />
              <StatRow label="Total Turnover" value="LKR 2.5B" />
              <StatRow label="Total Trades" value="12,450" />
              <StatRow label="Advancing" value="85" positive />
              <StatRow label="Declining" value="62" negative />
              <StatRow label="Unchanged" value="28" />
              <StatRow label="Foreign Net Buy" value="LKR 125M" positive />
            </div>
          </div>

          {/* Earnings Calendar */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-lanka-accent" />
              <h3 className="text-sm font-semibold text-lanka-text-primary">
                Earnings Calendar
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { date: "Jun 15", company: "Commercial Bank", symbol: "COMB" },
                { date: "Jun 18", company: "HNB", symbol: "HNB" },
                { date: "Jun 22", company: "Dialog Axiata", symbol: "DIAL" },
                { date: "Jun 25", company: "John Keells", symbol: "JKH" },
                { date: "Jun 28", company: "Nestle Lanka", symbol: "NEST" },
              ].map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-lanka-text-primary">
                      {item.company}
                    </div>
                    <div className="text-xs font-mono text-lanka-accent">{item.symbol}</div>
                  </div>
                  <span className="text-xs text-lanka-text-muted">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          <AdPlaceholder label="Advertisement" className="h-[250px]" />
        </aside>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-lanka-text-secondary">{label}</span>
      <span
        className={`text-xs font-mono font-medium ${
          positive ? "text-lanka-green" : negative ? "text-lanka-red" : "text-lanka-text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
