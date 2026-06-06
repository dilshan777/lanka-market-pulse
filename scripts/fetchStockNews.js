/**
 * fetchStockNews.js  —  Lanka Market Pulse
 *
 * Uses the `rss-parser` npm package (already installed) which handles:
 *   - CDATA sections
 *   - Atom + RSS 1.0 / 2.0
 *   - Redirects
 *   - Character encoding
 *
 * RSS sources ranked by reliability for Sri Lanka finance news.
 * Google News RSS is the most reliable — no login, no blocking, always fresh.
 */

const RSSParser = require("rss-parser");
const fs = require("fs");
const path = require("path");

// ─── Configuration ────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(process.cwd(), "content", "articles");

// User-agent that mimics a real browser (reduces 403s from picky servers)
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// ★ Feeds ranked: Google News first (most reliable), then direct SL sources
const RSS_SOURCES = [
  // ── Google News RSS ── free, no auth, always works ──────────────────────
  {
    name: "Google News — CSE",
    url: "https://news.google.com/rss/search?q=colombo+stock+exchange+CSE&hl=en-LK&gl=LK&ceid=LK:en",
    category: "stock-market",
    priority: 1,
  },
  {
    name: "Google News — ASPI",
    url: "https://news.google.com/rss/search?q=ASPI+Sri+Lanka+stock+market&hl=en&gl=LK&ceid=LK:en",
    category: "stock-market",
    priority: 1,
  },
  {
    name: "Google News — Sri Lanka Economy",
    url: "https://news.google.com/rss/search?q=Sri+Lanka+economy+CBSL+rupee&hl=en&gl=LK&ceid=LK:en",
    category: "economy",
    priority: 1,
  },
  {
    name: "Google News — Sri Lanka Business",
    url: "https://news.google.com/rss/search?q=Sri+Lanka+business+corporate+earnings&hl=en&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },

  // ── Direct SL Sources ── may need VPN / work from GitHub Actions ─────────
  {
    name: "Daily FT — Front Page",
    url: "https://www.ft.lk/rss/front-page/1",
    category: "stock-market",
    priority: 2,
  },
  {
    name: "Daily FT — Sectors",
    url: "https://www.ft.lk/rss/sectors/4",
    category: "business",
    priority: 2,
  },
  {
    name: "EconomyNext",
    url: "https://economynext.com/feed/",
    category: "economy",
    priority: 2,
  },
  {
    name: "Google News — Daily Mirror",
    url: "https://news.google.com/rss/search?q=site:dailymirror.lk+business+OR+finance&hl=en&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },
  {
    name: "Google News — Daily FT",
    url: "https://news.google.com/rss/search?q=site:ft.lk+stock+OR+CSE+OR+earnings&hl=en&gl=LK&ceid=LK:en",
    category: "stock-market",
    priority: 2,
  },
  {
    name: "Google News — Ada Derana Business",
    url: "https://news.google.com/rss/search?q=site:adaderana.lk+business+OR+economy&hl=en&gl=LK&ceid=LK:en",
    category: "business",
    priority: 1,
  },

// Add these entries to the RSS_SOURCES array:

{
  name: "Lanka Business Online (LBO)",
  url: "https://www.lankabusinessonline.com/feed/",
  category: "business",
  priority: 2,
},
{
  name: "Google News — InvestSriLanka",
  url: "https://news.google.com/rss/search?q=site:investsrilanka.biz+OR+%22invest+sri+lanka%22+stock+market&hl=en&gl=LK&ceid=LK:en",
  category: "stock-market",
  priority: 1,
},
];

// Keywords that make an article relevant to our site
const RELEVANT_KEYWORDS = [
  "CSE", "ASPI", "SL20", "colombo stock", "stock exchange",
  "share price", "shares", "stock market", "dividend", "IPO",
  "listing", "earnings", "profit", "revenue", "market cap",
  "CBSL", "central bank", "interest rate", "inflation", "rupee", "LKR",
  "JKH", "COMB", "HNB", "DIAL", "CTC", "NEST", "LOFC",
  "sri lanka economy", "sri lanka finance", "sri lanka business",
  "IMF", "bond", "treasury", "forex", "exchange rate",
  "banking", "insurance", "investment",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function padDate(n) { return String(n).padStart(2, "0"); }

function todaySL() {
  // UTC+5:30
  const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return `${d.getUTCFullYear()}-${padDate(d.getUTCMonth() + 1)}-${padDate(d.getUTCDate())}`;
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

function extractTags(title = "", summary = "") {
  const text = (title + " " + summary).toLowerCase();
  const tagMap = {
    "ASPI": "ASPI", "SL20": "SL20", "CSE": "CSE",
    "JKH": "JKH", "COMB": "ComBank", "HNB": "HNB",
    "DIAL": "Dialog", "CTC": "CTC",
    "dividend": "Dividends", "IPO": "IPO",
    "earnings": "Earnings", "profit": "Earnings",
    "inflation": "Inflation", "interest rate": "Interest Rates",
    "rupee": "LKR", "forex": "Forex", "exchange rate": "Forex",
    "CBSL": "CBSL", "central bank": "CBSL", "IMF": "IMF",
    "banking": "Banking", "insurance": "Insurance",
    "tourism": "Tourism", "technology": "Technology",
  };
  const found = ["Sri Lanka", "Stock Market"];
  for (const [kw, tag] of Object.entries(tagMap)) {
    if (text.includes(kw.toLowerCase()) && !found.includes(tag)) {
      found.push(tag);
    }
  }
  return found.slice(0, 7);
}

function articleExists(slug) {
  // Check exact file
  const filePath = path.join(OUTPUT_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) return true;
  // Check title slug already exists from today
  const today = todaySL();
  const titlePart = slug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const files = fs.existsSync(OUTPUT_DIR) ? fs.readdirSync(OUTPUT_DIR) : [];
  return files.some((f) => f.includes(titlePart) && f.endsWith(".md"));
}

function writeArticle(item, source) {
  const rawTitle = stripHtml(item.title || "");
  if (!rawTitle || rawTitle.length < 10) return null;

  const summary = stripHtml(item.contentSnippet || item.summary || item.content || "");

  if (!isRelevant(rawTitle, summary)) return null;

  const today = todaySL();
  const titleSlug = slugify(rawTitle);
  const slug = `${today}-${titleSlug}`;

  if (articleExists(slug)) return null;

  const pubDate = item.isoDate || item.pubDate
    ? new Date(item.isoDate || item.pubDate).toISOString()
    : new Date().toISOString();

  const excerpt = summary.substring(0, 220).replace(/"/g, '\\"');
  const safeTitle = rawTitle.replace(/"/g, '\\"').replace(/\n/g, " ");
  const tags = extractTags(rawTitle, summary);
  const link = item.link || item.guid || "";

  const frontmatter = `---
title: "${safeTitle}"
excerpt: "${excerpt}"
category: "${source.category}"
author: "Lanka Market Pulse"
publishedAt: "${pubDate}"
updatedAt: "${new Date().toISOString()}"
source: "${source.name}"
sourceUrl: "${link}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
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
  console.log("  LANKA MARKET PULSE — fetchStockNews.js");
  console.log(`  ${new Date().toLocaleString("en-LK", { timeZone: "Asia/Colombo" })} (SL time)`);
  console.log("=".repeat(58));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  console.log(`\n📁 Output: ${OUTPUT_DIR}\n`);

  // rss-parser with browser-like headers to avoid 403s
  const parser = new RSSParser({
    timeout: 15000,
    headers: {
      "User-Agent": BROWSER_UA,
      "Accept": "application/rss+xml, application/xml, text/xml, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
    },
    customFields: {
      item: [
        ["media:content", "mediaContent"],
        ["content:encoded", "contentEncoded"],
      ],
    },
  });

  const stats = { fetched: 0, saved: 0, skipped: 0, errors: [] };

  for (const source of RSS_SOURCES) {
    const label = `[Priority ${source.priority}] ${source.name}`;
    process.stdout.write(`\n🔍 ${label}\n   `);

    try {
      const feed = await parser.parseURL(source.url);
      const items = feed.items || [];
      console.log(`✅ ${items.length} items fetched`);
      stats.fetched += items.length;

      let sourceSaved = 0;
      for (const item of items.slice(0, 10)) {
        const slug = writeArticle(item, source);
        if (slug) {
          console.log(`   💾 ${slug}`);
          stats.saved++;
          sourceSaved++;
        } else {
          stats.skipped++;
        }
      }
      if (sourceSaved === 0 && items.length > 0) {
        console.log("   ℹ️  All items skipped (duplicates or not relevant)");
      }

    } catch (err) {
      const msg = err.message || String(err);
      // Friendly error message
      let hint = "";
      if (msg.includes("ENOTFOUND") || msg.includes("getaddrinfo")) {
        hint = " (DNS fail — check internet connection)";
      } else if (msg.includes("ECONNREFUSED")) {
        hint = " (connection refused — site may be down)";
      } else if (msg.includes("403") || msg.includes("Forbidden")) {
        hint = " (403 Forbidden — site blocks scrapers; try from GitHub Actions)";
      } else if (msg.includes("timeout") || msg.includes("ETIMEDOUT")) {
        hint = " (timeout — slow server)";
      } else if (msg.includes("404")) {
        hint = " (404 — feed URL has changed)";
      }
      console.log(`❌ FAILED: ${msg}${hint}`);
      stats.errors.push({ name: source.name, error: msg });
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("\n" + "=".repeat(58));
  console.log("  RESULTS");
  console.log("=".repeat(58));
  console.log(`  Raw items fetched  : ${stats.fetched}`);
  console.log(`  Articles saved     : ${stats.saved}`);
  console.log(`  Skipped            : ${stats.skipped} (duplicate or irrelevant)`);
  console.log(`  Errors             : ${stats.errors.length} / ${RSS_SOURCES.length} sources`);
  console.log(`  Time               : ${elapsed}s`);

  if (stats.errors.length > 0) {
    console.log("\n  Failed sources:");
    stats.errors.forEach(({ name, error }) => {
      console.log(`    ✗ ${name}`);
      console.log(`      ${error.substring(0, 120)}`);
    });
    console.log("\n  💡 Tips:");
    console.log("    • Google News feeds always work — they should have saved items");
    console.log("    • Direct SL sites (ft.lk, dailymirror.lk) may block local IPs");
    console.log("    • They work fine inside GitHub Actions (different IP range)");
    console.log("    • If even Google News fails: check your internet connection");
  }

  if (stats.saved === 0 && stats.fetched === 0) {
    console.log("\n  ⚠️  Zero articles saved AND zero fetched.");
    console.log("  This usually means ALL network requests failed.");
    console.log("  Check your internet / firewall / proxy settings.");
    process.exit(1);
  } else if (stats.saved === 0) {
    console.log("\n  ℹ️  Fetched items but saved 0 — all were duplicate or irrelevant.");
    console.log("  This is normal if you run the script twice in a short period.");
  }

  console.log("\n" + "=".repeat(58));
}

if (require.main === module) {
  main().catch((err) => {
    console.error("\n💥 Fatal error:", err.message);
    process.exit(1);
  });
}

module.exports = { main, writeArticle };
