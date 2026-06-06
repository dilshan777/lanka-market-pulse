import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { ArticleCard } from "@/components/news/ArticleCard";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { InArticleAd } from "@/components/ads/InArticleAd";
import { buildPageMetadata, generateArticleJsonLd } from "@/lib/seo";
import { getArticleBySlug, getAllArticles, getLatestArticles } from "@/lib/data";
import { formatDate, getRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}/`,
    keywords: article.tags,
    image: article.ogImage || article.image,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author],
    tags: article.tags,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getLatestArticles(4).filter((a) => a.slug !== slug).slice(0, 3);
  const categoryLabel = article.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const articleUrl = `https://lankamarketpulse.com/blog/${article.slug}/`;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateArticleJsonLd({
              title: article.title,
              description: article.excerpt,
              slug: article.slug,
              image: article.image,
              author: article.author,
              publishedAt: article.publishedAt,
              updatedAt: article.updatedAt,
              tags: article.tags,
            })
          ),
        }}
      />

      <Breadcrumb
        items={[
          { label: categoryLabel, href: `/${article.category}/` },
          { label: article.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-2">
          {/* Header */}
          <header className="mb-6">
            {article.image && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/${article.category}/`}
                className="px-3 py-1 bg-lanka-accent/10 text-lanka-accent text-xs font-medium rounded-full hover:bg-lanka-accent/20 transition-colors"
              >
                {categoryLabel}
              </Link>
              {article.breaking && (
                <span className="px-2 py-1 bg-lanka-red text-white text-xs font-bold rounded">
                  BREAKING
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-lanka-text-primary mb-4 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-lanka-text-muted mb-4">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {getRelativeTime(article.publishedAt)}
              </span>
            </div>

            <ShareButtons
              title={article.title}
              url={articleUrl}
              description={article.excerpt}
            />
          </header>

          {/* Excerpt */}
          <p className="text-lg text-lanka-text-secondary leading-relaxed mb-6 border-l-4 border-lanka-accent pl-4">
            {article.excerpt}
          </p>

          {/* In-article Ad */}
          <InArticleAd />

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-lanka-text-primary
              prose-h1:text-2xl prose-h1:font-bold
              prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-lg prose-h3:font-semibold
              prose-p:text-lanka-text-secondary prose-p:leading-relaxed
              prose-a:text-lanka-accent prose-a:no-underline hover:prose-a:underline
              prose-strong:text-lanka-text-primary
              prose-table:border-collapse prose-table:w-full
              prose-th:bg-muted prose-th:text-lanka-text-primary prose-th:font-semibold prose-th:p-3 prose-th:text-left prose-th:text-sm
              prose-td:border-t prose-td:border-border prose-td:p-3 prose-td:text-sm prose-td:text-lanka-text-secondary
              prose-blockquote:border-l-lanka-accent prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-ul:list-disc prose-ul:pl-6 prose-li:text-lanka-text-secondary
              prose-ol:list-decimal prose-ol:pl-6
              prose-hr:border-border
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-lanka-text-muted" />
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search/?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-muted text-xs text-lanka-text-secondary rounded-full hover:bg-lanka-accent/10 hover:text-lanka-accent transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Share at bottom */}
          <div className="mt-6 pt-6 border-t border-border">
            <ShareButtons
              title={article.title}
              url={articleUrl}
              description={article.excerpt}
            />
          </div>

          {/* Source */}
          {article.source && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-lanka-text-muted">
                Source: {article.sourceUrl ? (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lanka-accent hover:underline"
                  >
                    {article.source}
                  </a>
                ) : (
                  article.source
                )}
              </p>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <AdPlaceholder label="Advertisement" className="h-[250px]" />

          {/* Related Articles */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-lanka-text-primary mb-4">
              Related Articles
            </h3>
            <div className="space-y-3">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} variant="compact" />
              ))}
            </div>
          </div>

          <AdPlaceholder label="Advertisement" className="h-[250px]" />

          {/* Back to Category */}
          <Link
            href={`/${article.category}/`}
            className="flex items-center gap-2 text-sm text-lanka-accent hover:text-lanka-accent-dim transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {categoryLabel}
          </Link>
        </aside>
      </div>
    </div>
  );
}
