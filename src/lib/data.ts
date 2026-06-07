import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Article, MarketData, Stock, Dividend, EconomicIndicator, ExchangeRate, DailyBriefing, Report } from "@/types";

// Mark all functions as server-only (fixes "Can't resolve fs" error)
// This file must only be imported from Server Components or API routes

const contentDirectory = path.join(process.cwd(), "content");

// Load all articles
export function getAllArticles(): Article[] {
  const articlesDir = path.join(contentDirectory, "articles");
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      content,
      category: data.category || "general",
      subcategory: data.subcategory,
      author: data.author || "Lanka Market Pulse",
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
      image: data.image,
      tags: data.tags || [],
      featured: data.featured || false,
      breaking: data.breaking || false,
      views: data.views || 0,
      source: data.source,
      sourceUrl: data.sourceUrl,
      ogImage: data.ogImage,
    } as Article;
  });

  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Load single article
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = getAllArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;

  const processedContent = await remark().use(html).process(article.content);
  article.content = processedContent.toString();

  return article;
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getFeaturedArticles(limit = 5): Article[] {
  return getAllArticles().filter((a) => a.featured).slice(0, limit);
}

export function getBreakingNews(): Article[] {
  return getAllArticles().filter((a) => a.breaking);
}

export function getLatestArticles(limit = 10): Article[] {
  return getAllArticles().slice(0, limit);
}

// Load market data
function loadJSON<T>(filename: string, fallback: T): T {
  const filePath = path.join(contentDirectory, filename);
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

export function getMarketData(): MarketData[] {
  return loadJSON<MarketData[]>("market-data.json", []);
}

export function getStocks(): Stock[] {
  // Try both possible file locations
  const filePath1 = path.join(contentDirectory, "stocks.json");
  const filePath2 = path.join(contentDirectory, "data", "market.json");

  if (fs.existsSync(filePath1)) {
    try {
      return JSON.parse(fs.readFileSync(filePath1, "utf8"));
    } catch { return []; }
  }
  if (fs.existsSync(filePath2)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath2, "utf8"));
      return data.stocks || [];
    } catch { return []; }
  }
  return [];
}

export function getTopGainers(limit = 10): Stock[] {
  return getStocks()
    .filter((s) => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, limit);
}

export function getTopLosers(limit = 10): Stock[] {
  return getStocks()
    .filter((s) => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, limit);
}

export function getDividends(): Dividend[] {
  return loadJSON<Dividend[]>("dividends.json", []);
}

export function getEconomicIndicators(): EconomicIndicator[] {
  const filePath1 = path.join(contentDirectory, "economic-indicators.json");
  const filePath2 = path.join(contentDirectory, "data", "economic.json");

  if (fs.existsSync(filePath1)) {
    try {
      return JSON.parse(fs.readFileSync(filePath1, "utf8"));
    } catch { return []; }
  }
  if (fs.existsSync(filePath2)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath2, "utf8"));
      return data.indicators || [];
    } catch { return []; }
  }
  return [];
}

export function getExchangeRates(): ExchangeRate[] {
  const filePath1 = path.join(contentDirectory, "exchange-rates.json");
  const filePath2 = path.join(contentDirectory, "data", "economic.json");

  if (fs.existsSync(filePath1)) {
    try {
      return JSON.parse(fs.readFileSync(filePath1, "utf8"));
    } catch { return []; }
  }
  if (fs.existsSync(filePath2)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath2, "utf8"));
      return data.exchangeRates || [];
    } catch { return []; }
  }
  return [];
}

export function getDailyBriefing(): DailyBriefing | null {
  const filePath = path.join(contentDirectory, "daily-briefing.json");
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

export function getReports(): Report[] {
  const reportsDir = path.join(contentDirectory, "reports");
  if (!fs.existsSync(reportsDir)) return [];

  const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const id = filename.replace(/\.md$/, "");
      const filePath = path.join(reportsDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        id,
        title: data.title || "",
        type: data.type || "daily",
        date: data.date || new Date().toISOString(),
        summary: data.summary || "",
        content,
      } as Report;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCategories(): { slug: string; name: string; count: number }[] {
  const articles = getAllArticles();
  const categoryMap = new Map<string, number>();

  articles.forEach((article) => {
    const cat = article.category;
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  const categoryNames: Record<string, string> = {
    "stock-market": "Stock Market",
    business: "Business",
    economic: "Economic",
    dividend: "Dividend",
    earnings: "Earnings",
    banking: "Banking",
    tourism: "Tourism",
    technology: "Technology",
    general: "General",
  };

  return Array.from(categoryMap.entries()).map(([slug, count]) => ({
    slug,
    name: categoryNames[slug] || slug,
    count,
  }));
}

export function getAllTags(): { name: string; count: number }[] {
  const articles = getAllArticles();
  const tagMap = new Map<string, number>();

  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
