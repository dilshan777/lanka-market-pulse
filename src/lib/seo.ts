import type { Metadata } from "next";

export const SITE_NAME = "Lanka Market Pulse";
export const SITE_URL = "https://lankamarketpulse.com";
export const SITE_DESCRIPTION = "Sri Lanka's premier financial news platform. Real-time stock market updates, business news, economic reports, and AI-powered market briefings.";
export const SITE_KEYWORDS = [
  "Sri Lanka stock market",
  "Colombo Stock Exchange",
  "CSE",
  "Sri Lanka business news",
  "Sri Lanka economy",
  "Sri Lanka financial news",
  "stock market Sri Lanka",
  "dividend news Sri Lanka",
  "exchange rates Sri Lanka",
  "IMF Sri Lanka",
];

export const DEFAULT_OG_IMAGE = "/og/default-og.jpg";
export const TWITTER_HANDLE = "@LankaMarketPulse";

export interface BuildMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: BuildMetadataOptions): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [...SITE_KEYWORDS, ...keywords],
    authors: authors?.map((name) => ({ name })) || [{ name: "Lanka Market Pulse" }],
    creator: "Lanka Market Pulse",
    publisher: "Lanka Market Pulse",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      images: [ogImageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    verification: {
      google: "YOUR_GOOGLE_VERIFICATION_CODE",
    },
  };

  if (type === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: authors || ["Lanka Market Pulse"],
      tags,
    };
  }

  return metadata;
}

export function generateArticleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image ? `${SITE_URL}${article.image}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    author: {
      "@type": "Person",
      name: article.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
    keywords: article.tags?.join(", ") || "Sri Lanka, stock market, finance",
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://twitter.com/LankaMarketPulse",
      "https://facebook.com/LankaMarketPulse",
      "https://linkedin.com/company/lanka-market-pulse",
    ],
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressCountry: "LK",
    },
  };
}
