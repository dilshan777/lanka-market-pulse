"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, X, Calendar } from "lucide-react";
import { ArticleCard } from "@/components/news/ArticleCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { getAllArticles, getCategories } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const allArticles = getAllArticles();
  const categories = getCategories();

  useEffect(() => {
    performSearch();
  }, [query, selectedCategory, dateFrom, dateTo]);

  const performSearch = () => {
    let filtered = allArticles;

    if (query.trim().length >= 2) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((a) => new Date(a.publishedAt) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((a) => new Date(a.publishedAt) <= toDate);
    }

    setResults(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setDateFrom("");
    setDateTo("");
    setQuery("");
  };

  const hasActiveFilters = selectedCategory !== "all" || dateFrom || dateTo;

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Search" }]} />

      <h1 className="text-3xl font-bold text-lanka-text-primary mb-6">Search Articles</h1>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lanka-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, stocks, topics..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-lanka-text-muted focus:outline-none focus:ring-2 focus:ring-lanka-accent text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4 text-lanka-text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-lanka-text-secondary hover:bg-muted transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 bg-lanka-accent text-lanka-dark text-[10px] font-bold rounded-full">
              Active
            </span>
          )}
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-card border border-border rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-medium text-lanka-text-muted uppercase mb-2 block">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lanka-accent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="text-xs font-medium text-lanka-text-muted uppercase mb-2 block">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lanka-text-muted" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lanka-accent"
                  />
                </div>
              </div>

              {/* Date To */}
              <div>
                <label className="text-xs font-medium text-lanka-text-muted uppercase mb-2 block">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lanka-text-muted" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-lanka-accent"
                  />
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-lanka-accent hover:text-lanka-accent-dim transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-lanka-text-muted">
          {query || hasActiveFilters ? (
            <>
              Found <span className="font-medium text-lanka-text-primary">{results.length}</span> result
              {results.length !== 1 ? "s" : ""}
              {query && <> for &quot;<span className="font-medium text-lanka-text-primary">{query}</span>&quot;</>}
            </>
          ) : (
            <>Showing all <span className="font-medium text-lanka-text-primary">{results.length}</span> articles</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {results.length > 0 ? (
            results.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="default" />
            ))
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <Search className="w-12 h-12 text-lanka-text-muted mx-auto mb-4" />
              <p className="text-lanka-text-muted mb-2">No results found</p>
              <p className="text-sm text-lanka-text-muted">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <AdPlaceholder label="Advertisement" className="h-[250px]" />

          {/* Categories */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-lanka-text-primary mb-4">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "all" : cat.slug)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-lanka-accent/10 text-lanka-accent"
                      : "text-lanka-text-secondary hover:bg-muted"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-lanka-text-muted">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <AdPlaceholder label="Advertisement" className="h-[250px]" />
        </aside>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-14 bg-muted rounded max-w-2xl" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
