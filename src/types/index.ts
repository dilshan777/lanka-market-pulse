export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  subcategory?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  image?: string;
  tags: string[];
  featured?: boolean;
  breaking?: boolean;
  views?: number;
  source?: string;
  sourceUrl?: string;
  ogImage?: string;
}

export interface MarketData {
  index: string;
  value: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  timestamp: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  sector: string;
  isGainer?: boolean;
  isLoser?: boolean;
}

export interface Dividend {
  company: string;
  symbol: string;
  dividendType: string;
  amount: number;
  exDate: string;
  recordDate: string;
  paymentDate: string;
}

export interface EconomicIndicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  period: string;
  previousValue: number;
  source: string;
}

export interface ExchangeRate {
  currency: string;
  code: string;
  rate: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface DailyBriefing {
  date: string;
  summary: string;
  marketSummary: string;
  keyHighlights: string[];
  topGainers: Stock[];
  topLosers: Stock[];
  economicUpdates: string[];
  outlook: string;
}

export interface Report {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly";
  date: string;
  summary: string;
  content: string;
  downloadUrl?: string;
}

export interface SearchResult {
  article: Article;
  score: number;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface AdSlot {
  id: string;
  position: "header" | "sidebar" | "in-article" | "footer";
  size: string;
  className?: string;
}
