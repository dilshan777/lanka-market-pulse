# n8n Automation Workflows for Lanka Market Pulse

This document outlines the n8n workflows designed to automate content collection, processing, and publishing for Lanka Market Pulse.

## Workflow 1: Stock Market News Collection

### Trigger
- Schedule: Every 15 minutes during market hours (9:30 AM - 2:30 PM SL time)
- Webhook: CSE data feed API

### Steps
1. **RSS Feed Reader**
   - Sources:
     - CSE official announcements RSS
     - Colombo Gazette business section
     - Daily Mirror business RSS
     - EconomyNext RSS
     - Ada Derana business RSS

2. **Filter & Deduplicate**
   - Remove duplicates based on title similarity
   - Filter by keywords: "CSE", "ASPI", "stock", "dividend", "earnings"
   - Exclude articles older than 24 hours

3. **AI Summarization (OpenAI/Claude API)**
   - Prompt: "Summarize this Sri Lankan stock market news article in 2-3 sentences. Focus on key facts, numbers, and market impact."
   - Output: Excerpt + key points

4. **SEO Headline Generation**
   - Prompt: "Generate 3 SEO-friendly headlines for this article about Sri Lankan stock market. Include relevant keywords."
   - Select best headline based on length and keyword density

5. **Content Formatting**
   - Generate frontmatter with metadata
   - Format as Markdown
   - Assign category: "stock-market"
   - Auto-generate tags based on content analysis

6. **Git Push**
   - Commit to content/articles/ directory
   - Trigger: "[AUTO] Stock market news - {headline}"

## Workflow 2: Business News Collection

### Trigger
- Schedule: Every 30 minutes
- RSS feeds from business sources

### Steps
1. **RSS Feed Reader**
   - Sources:
     - Daily FT
     - Sunday Times Business
     - LMD
     - Business Today
     - NewsFirst Business

2. **Categorization**
   - Banking sector keywords → category: "business", subcategory: "banking"
   - Tourism keywords → category: "business", subcategory: "tourism"
   - Technology keywords → category: "business", subcategory: "technology"
   - General business → category: "business"

3. **AI Processing**
   - Summarize article
   - Generate excerpt
   - Create SEO headline
   - Extract key entities (companies, people, numbers)

4. **Publish**
   - Save as Markdown to content/articles/
   - Git commit and push

## Workflow 3: Economic News Collection

### Trigger
- Schedule: Every 1 hour
- CBSL and government source monitoring

### Steps
1. **Data Sources**
   - CBSL website scraping
   - Department of Census and Statistics
   - Treasury.gov.lk announcements
   - IMF press releases for Sri Lanka

2. **Data Extraction**
   - Inflation rates
   - Interest rates
   - Exchange rates
   - GDP data
   - Foreign reserves
   - Trade balance

3. **Update JSON Files**
   - content/economic-indicators.json
   - content/exchange-rates.json

4. **Generate Article**
   - AI writes analysis of economic data
   - Compare with previous period
   - Include expert commentary template

5. **Publish**
   - Save article to content/articles/
   - Update data JSON files
   - Git commit

## Workflow 4: Daily Market Briefing Generation

### Trigger
- Schedule: Daily at 3:00 PM SL time (after market close)

### Steps
1. **Collect Market Data**
   - ASPI closing value
   - S&P SL20 closing value
   - Top 10 gainers
   - Top 10 losers
   - Total turnover
   - Foreign activity
   - Sector performance

2. **Collect News Summary**
   - Top 5 news stories of the day
   - Key corporate announcements
   - Economic updates

3. **AI Briefing Generation**
   - Prompt template:
     ```
     Generate a comprehensive daily market briefing for Sri Lanka based on the following data:

     Market Data: {market_data}
     News Summary: {news_summary}
     Economic Updates: {economic_updates}

     Include:
     1. Executive summary (2-3 sentences)
     2. Detailed market summary
     3. 5-6 key highlights as bullet points
     4. Top 3 gainers with brief context
     5. Top 3 losers with brief context
     6. 3-4 economic/policy updates
     7. Market outlook for tomorrow (1 paragraph)

     Tone: Professional, financial news style
     Audience: Sri Lankan investors and business professionals
     ```

4. **Format Output**
   - Save to content/daily-briefing.json
   - Generate Markdown report in content/reports/

5. **Notify Subscribers**
   - Send email via SendGrid/Mailgun
   - Include briefing summary + link to full report

## Workflow 5: Weekly Market Report

### Trigger
- Schedule: Every Friday at 4:00 PM SL time

### Steps
1. **Aggregate Weekly Data**
   - Daily market data for the week
   - Weekly index performance
   - Sector performance summary
   - Foreign activity summary
   - Key news events

2. **Technical Analysis**
   - Calculate weekly moving averages
   - Identify support/resistance levels
   - RSI and MACD indicators

3. **AI Report Generation**
   - Generate comprehensive weekly report
   - Include charts and tables
   - Analyst commentary
   - Outlook for next week

4. **Publish**
   - Save to content/reports/
   - Update website
   - Send to newsletter subscribers

## Workflow 6: Content Publishing Pipeline

### Trigger
- GitHub webhook on push to main branch

### Steps
1. **Build Trigger**
   - Call Vercel/Netlify build hook OR
   - Trigger GitHub Actions workflow

2. **Build Process**
   - npm run build (Next.js static export)
   - npm run generate-sitemap
   - npm run generate-rss

3. **Deploy to S3**
   - Sync out/ directory to S3 bucket
   - Set appropriate cache headers
   - Upload sitemap.xml and rss.xml

4. **Invalidate CloudFront**
   - Create invalidation for /*
   - Wait for propagation

5. **Notification**
   - Send Slack/Discord notification
   - Log deployment status

## Workflow 7: Social Media Automation

### Trigger
- New article published

### Steps
1. **Extract Content**
   - Article title
   - Excerpt
   - Featured image
   - URL

2. **Generate Social Posts**
   - Twitter: Concise summary + link + hashtags
   - Facebook: Longer summary + link
   - LinkedIn: Professional summary + link

3. **Schedule Posts**
   - Twitter: Immediate + 2 reposts (4h, 8h later)
   - Facebook: Immediate
   - LinkedIn: Immediate

## Workflow 8: Dividend Announcement Monitor

### Trigger
- Schedule: Every 2 hours during market days
- CSE announcements feed

### Steps
1. **Monitor CSE Announcements**
   - Filter for dividend-related announcements
   - Extract: Company, symbol, dividend type, amount, dates

2. **Update Data**
   - Append to content/dividends.json
   - Generate article about new dividend announcements

3. **Notify**
   - Send alert to newsletter subscribers
   - Post to social media

## n8n Configuration

### Required Credentials
1. **OpenAI API Key** - For AI summarization and content generation
2. **GitHub Personal Access Token** - For repository access
3. **AWS Access Keys** - For S3 deployment
4. **CloudFront Distribution ID** - For cache invalidation
5. **SendGrid/Mailgun API Key** - For email notifications
6. **Slack Webhook URL** - For notifications
7. **Twitter API Keys** - For social posting

### Environment Variables
```
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
CLOUDFRONT_DISTRIBUTION_ID=...
SENDGRID_API_KEY=SG...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
```

### Error Handling
- All workflows include error catch nodes
- Failed executions logged to Slack
- Retry logic with exponential backoff
- Dead letter queue for failed items

### Monitoring
- n8n execution logs reviewed daily
- Success rate tracking
- API quota monitoring
- Cost tracking for AI API usage
