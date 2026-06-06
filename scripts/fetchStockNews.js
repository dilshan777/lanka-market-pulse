const fs = require("fs");
const path = require("path");
const https = require("https");

/**
 * Fetch Stock Market News
 * 
 * This script fetches stock market news from RSS feeds and news APIs,
 * then saves them as Markdown articles in content/articles/
 * 
 * Usage: node scripts/fetchStockNews.js
 * Or called by n8n/GitHub Actions
 */

const RSS_SOURCES = [
  { name: "CSE Announcements", url: "https://www.cse.lk/announcements/rss" },
  { name: "Daily Mirror Business", url: "https://www.dailymirror.lk/business/rss" },
  { name: "EconomyNext", url: "https://economynext.com/rss.xml" },
];

const OUTPUT_DIR = path.join(process.cwd(), "content", "articles");

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

function generateFrontmatter(data) {
  const tags = data.tags || ["CSE", "Stock Market", "Sri Lanka"];
  return `---
title: "${data.title}"
excerpt: "${data.excerpt}"
category: "stock-market"
author: "${data.author || "Lanka Market Pulse"}"
publishedAt: "${data.publishedAt || new Date().toISOString()}"
updatedAt: "${new Date().toISOString()}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
featured: ${data.featured || false}
breaking: ${data.breaking || false}
${data.source ? `source: "${data.source}"` : ""}
${data.sourceUrl ? `sourceUrl: "${data.sourceUrl}"` : ""}
---`;
}

function saveArticle(data) {
  const slug = generateSlug(data.title);
  const filePath = path.join(OUTPUT_DIR, `${slug}.md`);

  // Check if article already exists
  if (fs.existsSync(filePath)) {
    console.log(`Article already exists: ${slug}`);
    return null;
  }

  const content = `${generateFrontmatter(data)}

${data.content || data.excerpt}`;
  fs.writeFileSync(filePath, content);
  console.log(`Saved article: ${slug}`);
  return slug;
}

async function fetchRSSFeed(source) {
  return new Promise((resolve, reject) => {
    https.get(source.url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ source: source.name, xml: data }));
    }).on("error", reject);
  });
}

function parseRSSItems(xml) {
  // Simple RSS parser - in production use a proper RSS parser library
  const items = [];
  const itemRegex = /<item>[\s\S]*?<\/item>/g;
  const itemsMatch = xml.match(itemRegex);

  if (!itemsMatch) return items;

  itemsMatch.forEach((itemXml) => {
    const title = itemXml.match(/<title>(.*?)<\/title>/)?.[1] || "";
    const description = itemXml.match(/<description>(.*?)<\/description>/)?.[1] || "";
    const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || "";
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString();

    if (title) {
      items.push({ title, description, link, pubDate });
    }
  });

  return items;
}

async function main() {
  console.log("=== Fetching Stock Market News ===");
  console.log(`Output directory: ${OUTPUT_DIR}`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let savedCount = 0;

  for (const source of RSS_SOURCES) {
    try {
      console.log(`\nFetching from: ${source.name}`);
      const feed = await fetchRSSFeed(source);
      const items = parseRSSItems(feed.xml);
      console.log(`Found ${items.length} items`);

      for (const item of items.slice(0, 5)) {
        const articleData = {
          title: item.title,
          excerpt: item.description.replace(/<[^>]*>/g, "").substring(0, 200),
          content: item.description.replace(/<[^>]*>/g, ""),
          publishedAt: new Date(item.pubDate).toISOString(),
          source: source.name,
          sourceUrl: item.link,
          tags: ["CSE", "Stock Market"],
        };

        const saved = saveArticle(articleData);
        if (saved) savedCount++;
      }
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error.message);
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Total articles saved: ${savedCount}`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, saveArticle, fetchRSSFeed };
