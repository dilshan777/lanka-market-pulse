const fs = require("fs");
const path = require("path");
const https = require("https");

/**
 * Fetch Business News
 * 
 * Fetches business news from multiple Sri Lankan sources
 * Categorizes by sector: Banking, Tourism, Technology, Manufacturing
 * 
 * Usage: node scripts/fetchBusinessNews.js
 */

const RSS_SOURCES = [
  { name: "Daily FT", url: "https://www.ft.lk/rss.xml", category: "business" },
  { name: "Sunday Times Business", url: "https://www.sundaytimes.lk/business/rss", category: "business" },
  { name: "LMD", url: "https://www.lmd.lk/feed", category: "business" },
];

const SECTOR_KEYWORDS = {
  banking: ["bank", "banking", "CBSL", "interest rate", "loan", "deposit", "NPL"],
  tourism: ["tourism", "hotel", "resort", "tourist", "arrival", "aviation"],
  technology: ["tech", "technology", "5G", "digital", "software", "IT", "telecom"],
  manufacturing: ["manufacturing", "factory", "production", "industrial", "export"],
};

const OUTPUT_DIR = path.join(process.cwd(), "content", "articles");

function detectSector(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return sector;
    }
  }
  return null;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

function generateFrontmatter(data) {
  const tags = data.tags || ["Business", "Sri Lanka"];
  return `---
title: "${data.title}"
excerpt: "${data.excerpt}"
category: "business"
${data.subcategory ? `subcategory: "${data.subcategory}"` : ""}
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
  console.log("=== Fetching Business News ===");

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
        const cleanContent = item.description.replace(/<[^>]*>/g, "");
        const sector = detectSector(item.title, cleanContent);

        const articleData = {
          title: item.title,
          excerpt: cleanContent.substring(0, 200),
          content: cleanContent,
          subcategory: sector,
          publishedAt: new Date(item.pubDate).toISOString(),
          source: source.name,
          sourceUrl: item.link,
          tags: ["Business", sector ? sector.charAt(0).toUpperCase() + sector.slice(1) : "Corporate"],
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

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, detectSector, saveArticle };
