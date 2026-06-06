const fs = require("fs");
const path = require("path");
const RSSParser = require("rss-parser");

/**
 * fetchBusinessNews.js — Lanka Market Pulse
 * Fetches business news using rss-parser (handles CDATA, redirects, encoding)
 * Auto-detects sector: Banking, Tourism, Technology, Manufacturing, Energy
 */

const OUTPUT_DIR = path.join(process.cwd(), "content", "articles");

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const RSS_SOURCES = [
  // ── Google News (most reliable, always works) ──────────────────────────
  {
    name: "Google News — Sri Lanka Business",
    url: "https://news.google.com/rss/search?q=Sri+Lanka+business+corporate+banking&hl=en-LK&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },
  {
    name: "Google News — Sri Lanka Banking",
    url: "https://news.google.com/rss/search?q=Sri+Lanka+bank+HNB+ComBank+Sampath+NDB&hl=en-LK&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },
  {
    name: "Google News — Sri Lanka Tourism",
    url: "https://news.google.com/rss/search?q=Sri+Lanka+tourism+hotel+arrivals+2026&hl=en-LK&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },
  {
    name: "Google News — Sri Lanka Technology",
    url: "https://news.google.com/rss/search?q=Sri+Lanka+technology+telecom+Dialog+5G&hl=en-LK&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },

  // ── Direct SL Sources (work best from GitHub Actions) ─────────────────
  {
    name: "Lanka Business Online (LBO)",
    url: "https://www.lankabusinessonline.com/feed/",
    category: "business",
    priority: 2,
  },
  {
    name: "EconomyNext",
    url: "https://economynext.com/feed/",
    category: "business",
    priority: 2,
  },
  {
    name: "Daily FT — Front Page",
    url: "https://www.ft.lk/rss/front-page/1",
    category: "business",
    priority: 2,
  },
  {
    name: "Daily FT — Sectors",
    url: "https://www.ft.lk/rss/sectors/4",
    category: "business",
    priority: 2,
  },
  {
    name: "Google News — Daily FT",
    url: "https://news.google.com/rss/search?q=site:ft.lk+business+OR+corporate+OR+earnings&hl=en&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },
  {
    name: "Google News — LBO",
    url: "https://news.google.com/rss/search?q=site:lankabusinessonline.com&hl=en&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },
];

// Sector detection keywords
const SECTOR_KEYWORDS = {
  banking: [
    "bank", "banking", "CBSL", "central bank", "interest rate", "loan",
    "deposit", "NPL", "HNB", "ComBank", "Sampath", "NDB", "BOC", "NSB",
    "finance company", "leasing", "credit", "mortgage",
  ],
  tourism: [
    "tourism", "hotel", "resort", "tourist", "arrival", "aviation",
    "airport", "airline", "hospitality", "travel", "visitor",
  ],
  technology: [
    "tech", "technology", "5G", "digital", "software", "IT", "telecom",
    "Dialog", "SLT", "Mobitel", "startup", "fintech", "e-commerce",
    "cyber", "cloud", "AI", "app",
  ],
  manufacturing: [
    "manufacturing", "factory", "production", "industrial", "export",
    "apparel", "garment", "textile", "rubber", "ceramics", "BOI",
  ],
  energy: [
    "energy", "power", "electricity", "CEB", "renewable", "solar",
    "wind", "fuel", "petroleum", "gas", "CPC",
  ],
  retail: [
    "retail", "consumer", "supermarket", "Keells", "Cargills",
    "shopping", "FMCG", "sales",
  ],
};

// Only save articles with at least one of these keywords
const RELEVANT_KEYWORDS = [
  "sri lanka", "colombo", "LBO", "ft.lk", "CSE", "business",
  "corporate", "company", "profit", "revenue", "earnings",
  "quarterly", "annual", "results", "merger", "acquisition",
  "IPO", "listing", "dividend", "AGM", "EGM", "board",
  "bank", "banking", "tourism", "hotel", "technology", "telecom",
  "manufacturing", "export", "import", "trade", "investment",
  "JKH", "HNB", "COMB", "DIAL", "CTC", "NEST", "Aitken",
  "John Keells", "Hayleys", "Softlogic", "LOLC", "Seylan",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function pad(n) { return String(n).padStart(2, "0"); }

function todaySL() {
  const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

function isRelevant(title = "", summary = "") {
  const text = (title + " " + summary).toLowerCase();
  return RELEVANT_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

function detectSector(title = "", summary = "") {
  const text = (title + " " + summary).toLowerCase();
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return sector;
    }
  }
  return "corporate";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function articleExists(slug) {
  const filePath = path.join(OUTPUT_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) return true;
  const titlePart = slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const files = fs.existsSync(OUTPUT_DIR) ? fs.readdirSync(OUTPUT_DIR) : [];
  return files.some((f) => f.includes(titlePart) && f.endsWith(".md"));
}

function writeArticle(item, source) {
  const rawTitle = stripHtml(item.title || "");
  if (!rawTitle || rawTitle.length < 10) return null;

  const summary = stripHtml(
    item.contentSnippet || item.summary || item.content || ""
  );

  if (!isRelevant(rawTitle, summary)) return null;

  const today = todaySL();
  const slug = `${today}-${slugify(rawTitle)}`;
  if (articleExists(slug)) return null;

  const sector = detectSector(rawTitle, summary);
  const pubDate = item.isoDate || item.pubDate
    ? new Date(item.isoDate || item.pubDate).toISOString()
    : new Date().toISOString();

  const excerpt = summary.substring(0, 220).replace(/"/g, '\\"');
  const safeTitle = rawTitle.replace(/"/g, '\\"').replace(/\n/g, " ");
  const link = item.link || item.guid || "";

  const tags = ["Business", "Sri Lanka", capitalize(sector)];

  // Add company-specific tags
  const companyTags = {
    "JKH": "JKH", "john keells": "JKH",
    "HNB": "HNB", "hatton national": "HNB",
    "combank": "ComBank", "commercial bank": "ComBank",
    "dialog": "Dialog", "DIAL": "Dialog",
    "sampath": "Sampath", "SAMP": "Sampath",
    "hayleys": "Hayleys", "softlogic": "Softlogic",
    "LOLC": "LOLC", "seylan": "Seylan",
    "cargills": "Cargills", "aitken": "Aitken Spence",
  };
  const textLower = (rawTitle + " " + summary).toLowerCase();
  for (const [kw, tag] of Object.entries(companyTags)) {
    if (textLower.includes(kw.toLowerCase()) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }

  const frontmatter = `---
title: "${safeTitle}"
excerpt: "${excerpt}"
category: "business"
subcategory: "${sector}"
author: "Lanka Market Pulse"
publishedAt: "${pubDate}"
updatedAt: "${new Date().toISOString()}"
source: "${source.name}"
sourceUrl: "${link}"
tags: [${tags.slice(0, 6).map((t) => `"${t}"`).join(", ")}]
featured: false
breaking: false
---`;

  const body = summary
    ? `${summary}\n\n*Source: [${source.name}](${link})*`
    : `*Source: [${source.name}](${link})*`;

  const filePath = path.join(OUTPUT_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, `${frontmatter}\n\n${body}\n`, "utf8");
  return slug;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();
  console.log("=".repeat(58));
  console.log("  LANKA MARKET PULSE — fetchBusinessNews.js");
  console.log(`  ${new Date().toLocaleString("en-LK", { timeZone: "Asia/Colombo" })} (SL time)`);
  console.log("=".repeat(58));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  console.log(`\n📁 Output: ${OUTPUT_DIR}\n`);

  const parser = new RSSParser({
    timeout: 15000,
    headers: {
      "User-Agent": BROWSER_UA,
      "Accept": "application/rss+xml, application/xml, text/xml, */*",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  const stats = { fetched: 0, saved: 0, skipped: 0, errors: [] };

  for (const source of RSS_SOURCES) {
    process.stdout.write(`\n🔍 [P${source.priority}] ${source.name}\n   `);

    try {
      const feed = await parser.parseURL(source.url);
      const items = feed.items || [];
      console.log(`✅ ${items.length} items`);
      stats.fetched += items.length;

      let sourceSaved = 0;
      for (const item of items.slice(0, 10)) {
        const slug = writeArticle(item, source);
        if (slug) {
          const sector = detectSector(item.title, item.contentSnippet || "");
          console.log(`   💾 [${capitalize(sector).padEnd(13)}] ${slug.substring(11, 65)}`);
          stats.saved++;
          sourceSaved++;
        } else {
          stats.skipped++;
        }
      }
      if (sourceSaved === 0 && items.length > 0) {
        console.log("   ℹ️  All skipped (duplicates or not relevant)");
      }

    } catch (err) {
      const msg = err.message || String(err);
      let hint = "";
      if (msg.includes("404")) hint = " (URL changed)";
      else if (msg.includes("403")) hint = " (site blocks scrapers)";
      else if (msg.includes("ENOTFOUND")) hint = " (DNS fail)";
      else if (msg.includes("timeout")) hint = " (timeout)";
      console.log(`❌ ${msg.substring(0, 80)}${hint}`);
      stats.errors.push(source.name);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n" + "=".repeat(58));
  console.log("  RESULTS");
  console.log("=".repeat(58));
  console.log(`  Raw items fetched  : ${stats.fetched}`);
  console.log(`  Articles saved     : ${stats.saved}`);
  console.log(`  Skipped            : ${stats.skipped}`);
  console.log(`  Errors             : ${stats.errors.length} / ${RSS_SOURCES.length} sources`);
  console.log(`  Time               : ${elapsed}s`);
  if (stats.errors.length > 0) {
    console.log(`\n  Failed: ${stats.errors.join(", ")}`);
  }
  console.log("=".repeat(58));
}

if (require.main === module) {
  main().catch((err) => {
    console.error("💥 Fatal:", err.message);
    process.exit(1);
  });
}

module.exports = { main, detectSector, writeArticle };