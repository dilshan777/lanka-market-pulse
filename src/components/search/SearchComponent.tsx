"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { debounce } from "@/lib/utils";
import type { Article } from "@/types";

interface SearchComponentProps {
  articles: Article[];
}

export function SearchComponent({ articles }: SearchComponentProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const searchArticles = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setResults([]);
        setSuggestions([]);
        return;
      }

      setLoading(true);
      const lowerQuery = searchQuery.toLowerCase();

      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );

      setResults(filtered);

      const uniqueSuggestions = Array.from(
        new Set(
          articles
            .filter((a) => a.title.toLowerCase().includes(lowerQuery))
            .map((a) => a.title)
        )
      ).slice(0, 5);

      setSuggestions(uniqueSuggestions);
      setLoading(false);
    },
    [articles]
  );

  const debouncedSearch = useCallback(debounce(searchArticles, 300), [searchArticles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/?q=${encodeURIComponent(query.trim())}`);
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".search-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-container relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-lanka-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search articles, stocks, market data..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-lanka-text-muted focus:outline-none focus:ring-2 focus:ring-lanka-accent focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-lanka-text-muted" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {showDropdown && (query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-lanka-accent" />
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-xs font-medium text-lanka-text-muted uppercase">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </div>
              {results.slice(0, 8).map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}/`}
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-2.5 hover:bg-muted transition-colors"
                >
                  <div className="text-sm font-medium text-lanka-text-primary line-clamp-1">
                    {article.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-lanka-accent">{article.category}</span>
                    <span className="text-xs text-lanka-text-muted">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
              {results.length > 8 && (
                <button
                  onClick={handleSubmit}
                  className="block w-full text-center px-4 py-2 text-sm text-lanka-accent hover:bg-muted transition-colors"
                >
                  View all {results.length} results
                </button>
              )}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-lanka-text-muted">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
