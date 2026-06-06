import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { ArticleCard } from "@/components/news/ArticleCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { buildPageMetadata } from "@/lib/seo";
import { getArticlesByCategory, getAllTags } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Business News",
  description:
    "Latest Sri Lankan business news, corporate announcements, banking sector updates, tourism sector updates, and technology sector updates.",
  path: "/business/",
  keywords: ["Sri Lanka business", "corporate news", "banking", "tourism", "technology"],
});

export default function BusinessPage() {
  const articles = getArticlesByCategory("business");
  const allTags = getAllTags();

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Business News" }]} />

      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-lanka-accent" />
        <div>
          <h1 className="text-3xl font-bold text-lanka-text-primary">Business News</h1>
          <p className="text-sm text-lanka-text-muted">Sri Lankan corporate and sector updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {articles.length > 0 ? (
            <>
              {/* Featured */}
              {articles.filter((a) => a.featured).length > 0 && (
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles
                      .filter((a) => a.featured)
                      .slice(0, 2)
                      .map((article) => (
                        <ArticleCard key={article.slug} article={article} variant="featured" />
                      ))}
                  </div>
                </section>
              )}

              {/* Article List */}
              <section>
                <SectionHeader title="Latest Business News" />
                <div className="space-y-4">
                  {articles.map((article) => (
                    <ArticleCard key={article.slug} article={article} variant="default" />
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="text-center py-16">
              <Building2 className="w-12 h-12 text-lanka-text-muted mx-auto mb-4" />
              <p className="text-lanka-text-muted">No business articles available yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <AdPlaceholder label="Advertisement" className="h-[250px]" />

          {/* Categories */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-lanka-text-primary mb-4">Sectors</h3>
            <div className="space-y-2">
              {["Banking", "Tourism", "Technology", "Manufacturing", "Consumer", "Telecommunication"].map(
                (sector) => (
                  <Link
                    key={sector}
                    href={`/search/?q=${encodeURIComponent(sector)}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-sm text-lanka-text-secondary hover:text-lanka-accent"
                  >
                    <span>{sector}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-lanka-text-primary mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 15).map((tag) => (
                <Link
                  key={tag.name}
                  href={`/search/?q=${encodeURIComponent(tag.name)}`}
                  className="px-3 py-1.5 bg-muted text-xs text-lanka-text-secondary rounded-full hover:bg-lanka-accent/10 hover:text-lanka-accent transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>

          <AdPlaceholder label="Advertisement" className="h-[250px]" />
        </aside>
      </div>
    </div>
  );
}
