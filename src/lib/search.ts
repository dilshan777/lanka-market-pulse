import Fuse from "fuse.js";
import { Article, SearchResult } from "@/types";
import { getAllArticles } from "./data";

let fuseInstance: Fuse<Article> | null = null;

function getFuseInstance(): Fuse<Article> {
  if (!fuseInstance) {
    const articles = getAllArticles();
    fuseInstance = new Fuse(articles, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "excerpt", weight: 0.3 },
        { name: "content", weight: 0.2 },
        { name: "tags", weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
    });
  }
  return fuseInstance;
}

export function searchArticles(query: string, category?: string, dateFrom?: string, dateTo?: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const fuse = getFuseInstance();
  const results = fuse.search(query.trim());

  let filtered = results.map((result) => ({
    article: result.item,
    score: result.score || 1,
  }));

  if (category && category !== "all") {
    filtered = filtered.filter((r) => r.article.category === category);
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    filtered = filtered.filter((r) => new Date(r.article.publishedAt) >= fromDate);
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((r) => new Date(r.article.publishedAt) <= toDate);
  }

  return filtered;
}

export function getSearchSuggestions(query: string, limit = 5): string[] {
  if (!query || query.trim().length < 2) return [];

  const fuse = getFuseInstance();
  const results = fuse.search(query.trim(), { limit });

  return results.map((r) => r.item.title);
}
