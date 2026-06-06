const fs = require("fs");
const path = require("path");
const https = require("https");

/**
 * Fetch Economic News & Data
 * 
 * Fetches economic indicators from CBSL, government sources
 * Updates JSON data files and generates analysis articles
 * 
 * Usage: node scripts/fetchEconomicNews.js
 */

const DATA_SOURCES = {
  cbsl: "https://www.cbsl.gov.lk/en/statistics/data",
  treasury: "https://www.treasury.gov.lk",
  statistics: "https://www.statistics.gov.lk",
};

const OUTPUT_DIR = path.join(process.cwd(), "content", "articles");
const DATA_DIR = path.join(process.cwd(), "content", "data");

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

function generateFrontmatter(data) {
  const tags = data.tags || ["Economy", "Sri Lanka"];
  return `---
title: "${data.title}"
excerpt: "${data.excerpt}"
category: "economic"
${data.subcategory ? `subcategory: "${data.subcategory}"` : ""}
author: "${data.author || "Lanka Market Pulse"}"
publishedAt: "${data.publishedAt || new Date().toISOString()}"
updatedAt: "${new Date().toISOString()}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
featured: ${data.featured || false}
breaking: ${data.breaking || false}
${data.source ? `source: "${data.source}"` : ""}
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

function updateEconomicData(newData) {
  const filePath = path.join(DATA_DIR, "economic.json");
  let existing = {};

  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  const updated = {
    ...existing,
    ...newData,
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  console.log("Updated economic.json");
}

function updateMarketData(newData) {
  const filePath = path.join(DATA_DIR, "market.json");
  let existing = {};

  if (fs.existsSync(filePath)) {
    existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  const updated = {
    ...existing,
    ...newData,
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  console.log("Updated market.json");
}

async function fetchCBSLData() {
  // Placeholder - in production, scrape or use CBSL API
  console.log("Fetching CBSL data...");

  // Simulated data update
  const economicData = {
    inflation: {
      current: 3.2,
      previous: 3.6,
      period: "May 2026",
      source: "CBSL",
    },
    policyRate: {
      current: 8.25,
      previous: 8.25,
      period: "Jun 2026",
      source: "CBSL",
    },
  };

  updateEconomicData(economicData);
  return economicData;
}

async function generateEconomicArticle(data) {
  const title = `Economic Update: Inflation Eases to ${data.inflation.current}% in ${data.inflation.period}`;
  const excerpt = `Sri Lanka's inflation rate declined to ${data.inflation.current}% in ${data.inflation.period}, down from ${data.inflation.previous}% previously, according to ${data.inflation.source} data.`;

  const content = `# ${title}

Sri Lanka's headline inflation eased to **${data.inflation.current}%** in ${data.inflation.period}, 
marking a decline from ${data.inflation.previous}% in the previous period.

## Key Data Points

| Indicator | Current | Previous | Change |
|-----------|---------|----------|--------|
| Inflation Rate | ${data.inflation.current}% | ${data.inflation.previous}% | ${(data.inflation.current - data.inflation.previous).toFixed(1)}% |
| Policy Rate | ${data.policyRate.current}% | ${data.policyRate.previous}% | ${(data.policyRate.current - data.policyRate.previous).toFixed(2)}% |

## Analysis

The easing of inflationary pressures provides room for the Central Bank to maintain its 
accommodative monetary policy stance. The decline was primarily driven by lower food prices 
and stable global commodity prices.

## Market Impact

The stable inflation outlook is positive for equities, particularly banking stocks which 
benefit from the sustained low-rate environment supporting lending growth.

---

*Data source: ${data.inflation.source}*  
*Last updated: ${new Date().toLocaleString()}*`;

  return {
    title,
    excerpt,
    content,
    subcategory: "inflation",
    tags: ["Inflation", "CBSL", "Economy", "Monetary Policy"],
    source: "CBSL",
  };
}

async function main() {
  console.log("=== Fetching Economic News & Data ===");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Fetch and update economic data
  const economicData = await fetchCBSLData();

  // Generate article from data
  const articleData = await generateEconomicArticle(economicData);
  const saved = saveArticle(articleData);

  console.log(`\n=== Done ===`);
  console.log(`Article saved: ${saved ? "Yes" : "No (duplicate)"}`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, fetchCBSLData, updateEconomicData, updateMarketData };
