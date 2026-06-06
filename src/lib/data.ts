import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Article, MarketData, Stock, Dividend, EconomicIndicator, ExchangeRate, DailyBriefing, Report } from "@/types";

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

  return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
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

// Get articles by category
export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

// Get featured articles
export function getFeaturedArticles(limit = 5): Article[] {
  return getAllArticles().filter((a) => a.featured).slice(0, limit);
}

// Get breaking news
export function getBreakingNews(): Article[] {
  return getAllArticles().filter((a) => a.breaking);
}

// Get latest articles
export function getLatestArticles(limit = 10): Article[] {
  return getAllArticles().slice(0, limit);
}

// Load market data from JSON
export function getMarketData(): MarketData[] {
  const filePath = path.join(contentDirectory, "market-data.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Load stocks
export function getStocks(): Stock[] {
  const filePath = path.join(contentDirectory, "stocks.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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

// Load dividends
export function getDividends(): Dividend[] {
  const filePath = path.join(contentDirectory, "dividends.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Load economic indicators
export function getEconomicIndicators(): EconomicIndicator[] {
  const filePath = path.join(contentDirectory, "economic-indicators.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Load exchange rates
export function getExchangeRates(): ExchangeRate[] {
  const filePath = path.join(contentDirectory, "exchange-rates.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Load daily briefing
export function getDailyBriefing(): DailyBriefing | null {
  const filePath = path.join(contentDirectory, "daily-briefing.json");
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Load reports
export function getReports(): Report[] {
  const reportsDir = path.join(contentDirectory, "reports");
  if (!fs.existsSync(reportsDir)) return [];

  const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith(".md"));

  return files.map((filename) => {
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
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get all unique categories
export function getCategories(): { slug: string; name: string; count: number }[] {
  const articles = getAllArticles();
  const categoryMap = new Map<string, number>();

  articles.forEach((article) => {
    const cat = article.category;
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  const categoryNames: Record<string, string> = {
    "stock-market": "Stock Market",
    "business": "Business",
    "economic": "Economic",
    "dividend": "Dividend",
    "earnings": "Earnings",
    "banking": "Banking",
    "tourism": "Tourism",
    "technology": "Technology",
    "general": "General",
  };

  return Array.from(categoryMap.entries()).map(([slug, count]) => ({
    slug,
    name: categoryNames[slug] || slug,
    count,
  }));
}

// Get all tags
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
