const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://lankamarketpulse.com";

function getAllArticles() {
  const articlesDir = path.join(process.cwd(), "content", "articles");
  if (!fs.existsSync(articlesDir)) return [];

  return fs.readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fileContents = fs.readFileSync(path.join(articlesDir, filename), "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        publishedAt: data.publishedAt || new Date().toISOString(),
        updatedAt: data.updatedAt || data.publishedAt || new Date().toISOString(),
      };
    });
}

function generateSitemap() {
  const articles = getAllArticles();
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/stock-market/", priority: "0.9", changefreq: "daily" },
    { url: "/business/", priority: "0.9", changefreq: "daily" },
    { url: "/economic/", priority: "0.9", changefreq: "daily" },
    { url: "/daily-reports/", priority: "0.8", changefreq: "daily" },
    { url: "/search/", priority: "0.7", changefreq: "weekly" },
    { url: "/newsletter/", priority: "0.6", changefreq: "monthly" },
    { url: "/about/", priority: "0.5", changefreq: "monthly" },
    { url: "/contact/", priority: "0.5", changefreq: "monthly" },
    { url: "/privacy/", priority: "0.3", changefreq: "yearly" },
    { url: "/disclaimer/", priority: "0.3", changefreq: "yearly" },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Static pages
  staticPages.forEach((page) => {
    sitemap += `  <url>
`;
    sitemap += `    <loc>${SITE_URL}${page.url}</loc>
`;
    sitemap += `    <lastmod>${today}</lastmod>
`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>
`;
    sitemap += `    <priority>${page.priority}</priority>
`;
    sitemap += `  </url>
`;
  });

  // Article pages
  articles.forEach((article) => {
    sitemap += `  <url>
`;
    sitemap += `    <loc>${SITE_URL}/blog/${article.slug}/</loc>
`;
    sitemap += `    <lastmod>${article.updatedAt.split("T")[0]}</lastmod>
`;
    sitemap += `    <changefreq>weekly</changefreq>
`;
    sitemap += `    <priority>0.8</priority>
`;
    sitemap += `  </url>
`;
  });

  sitemap += `</urlset>
`;

  // Write to public directory
  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
  console.log("Sitemap generated successfully!");
}

// RSS Feed generation
function generateRSS() {
  const articles = getAllArticles().slice(0, 20);

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
`;
  rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
`;
  rss += `  <channel>
`;
  rss += `    <title>Lanka Market Pulse</title>
`;
  rss += `    <link>${SITE_URL}</link>
`;
  rss += `    <description>Sri Lanka's premier financial news platform</description>
`;
  rss += `    <language>en</language>
`;
  rss += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
`;
  rss += `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
`;

  articles.forEach((article) => {
    const articlePath = path.join(process.cwd(), "content", "articles", `${article.slug}.md`);
    const fileContents = fs.readFileSync(articlePath, "utf8");
    const { data, content } = matter(fileContents);

    rss += `    <item>
`;
    rss += `      <title>${escapeXml(data.title)}</title>
`;
    rss += `      <link>${SITE_URL}/blog/${article.slug}/</link>
`;
    rss += `      <guid>${SITE_URL}/blog/${article.slug}/</guid>
`;
    rss += `      <pubDate>${new Date(data.publishedAt).toUTCString()}</pubDate>
`;
    rss += `      <description>${escapeXml(data.excerpt)}</description>
`;
    if (data.author) {
      rss += `      <author>${escapeXml(data.author)}</author>
`;
    }
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag) => {
        rss += `      <category>${escapeXml(tag)}</category>
`;
      });
    }
    rss += `    </item>
`;
  });

  rss += `  </channel>
`;
  rss += `</rss>
`;

  fs.writeFileSync(path.join(process.cwd(), "public", "rss.xml"), rss);
  console.log("RSS feed generated successfully!");
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

generateSitemap();
generateRSS();
