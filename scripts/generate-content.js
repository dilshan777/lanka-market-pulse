const fs = require("fs");
const path = require("path");

// This script would be called by n8n workflows to generate content
// For now, it's a placeholder showing the structure

function generateArticle(data) {
  const {
    slug,
    title,
    excerpt,
    content,
    category,
    author,
    tags,
    featured = false,
    breaking = false,
  } = data;

  const frontmatter = `---
title: "${title}"
excerpt: "${excerpt}"
category: "${category}"
author: "${author || "Lanka Market Pulse"}"
publishedAt: "${new Date().toISOString()}"
updatedAt: "${new Date().toISOString()}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
featured: ${featured}
breaking: ${breaking}
---`;

  const filePath = path.join(process.cwd(), "content", "articles", `${slug}.md`);
  fs.writeFileSync(filePath, `${frontmatter}

${content}`);
  console.log(`Article generated: ${slug}`);
}

function generateDailyBriefing(data) {
  const filePath = path.join(process.cwd(), "content", "daily-briefing.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("Daily briefing updated");
}

function updateMarketData(data) {
  const filePath = path.join(process.cwd(), "content", "market-data.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("Market data updated");
}

function updateStocks(data) {
  const filePath = path.join(process.cwd(), "content", "stocks.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log("Stock data updated");
}

// Export functions for n8n integration
module.exports = {
  generateArticle,
  generateDailyBriefing,
  updateMarketData,
  updateStocks,
};

// If run directly, show usage
if (require.main === module) {
  console.log("Content generation script for Lanka Market Pulse");
  console.log("Usage: Call functions from n8n workflows or other automation tools");
}
