import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { formatDate, getRelativeTime, truncateText } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact" | "breaking";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/blog/${article.slug}/`} className="group block">
        <article className="relative overflow-hidden rounded-xl bg-card border border-border hover:border-lanka-accent/50 transition-all duration-300">
          <div className="aspect-video relative overflow-hidden">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-lanka-accent/20 to-lanka-blue/20 flex items-center justify-center">
                <span className="text-lanka-text-muted text-sm">No image</span>
              </div>
            )}
            {article.breaking && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-lanka-red text-white text-xs font-bold rounded">
                BREAKING
              </span>
            )}
            <span className="absolute top-3 right-3 px-2 py-1 bg-lanka-dark/80 text-lanka-text-primary text-xs font-medium rounded backdrop-blur">
              {article.category}
            </span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-lanka-text-primary group-hover:text-lanka-accent transition-colors line-clamp-2 mb-2">
              {article.title}
            </h3>
            <p className="text-sm text-lanka-text-secondary line-clamp-2 mb-3">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-lanka-text-muted">
              <div className="flex items-center gap-3">
                <span>{article.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getRelativeTime(article.publishedAt)}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "breaking") {
    return (
      <Link href={`/blog/${article.slug}/`} className="group block">
        <article className="flex gap-4 p-4 rounded-lg bg-lanka-red/5 border border-lanka-red/20 hover:bg-lanka-red/10 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 bg-lanka-red text-white text-[10px] font-bold rounded">
                BREAKING
              </span>
              <span className="text-xs text-lanka-text-muted">{article.category}</span>
            </div>
            <h3 className="text-sm font-semibold text-lanka-text-primary group-hover:text-lanka-red transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-lanka-text-secondary mt-1 line-clamp-1">
              {truncateText(article.excerpt, 80)}
            </p>
            <span className="text-xs text-lanka-text-muted mt-1 block">
              {getRelativeTime(article.publishedAt)}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/blog/${article.slug}/`} className="group block">
        <article className="flex gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
          <div className="w-20 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-lanka-accent/20 to-lanka-blue/20" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-lanka-accent font-medium uppercase tracking-wide">
              {article.category}
            </span>
            <h3 className="text-sm font-medium text-lanka-text-primary group-hover:text-lanka-accent transition-colors line-clamp-2">
              {article.title}
            </h3>
            <span className="text-xs text-lanka-text-muted">
              {getRelativeTime(article.publishedAt)}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${article.slug}/`} className="group block">
      <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-card border border-border hover:border-lanka-accent/30 transition-all">
        <div className="w-full sm:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-lanka-accent/20 to-lanka-blue/20 flex items-center justify-center">
              <span className="text-lanka-text-muted text-xs">No image</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-lanka-accent/10 text-lanka-accent text-xs font-medium rounded">
              {article.category}
            </span>
            {article.breaking && (
              <span className="px-1.5 py-0.5 bg-lanka-red text-white text-[10px] font-bold rounded">
                BREAKING
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-lanka-text-primary group-hover:text-lanka-accent transition-colors line-clamp-2 mb-1">
            {article.title}
          </h3>
          <p className="text-sm text-lanka-text-secondary line-clamp-2 mb-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-lanka-text-muted">
            <span>{article.author}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getRelativeTime(article.publishedAt)}
            </span>
            {article.views && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.views.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
