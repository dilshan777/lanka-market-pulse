#!/bin/bash

# Lanka Market Pulse - AWS S3 + CloudFront Deployment Script
# Prerequisites: AWS CLI configured with appropriate credentials

set -e

# Configuration
BUCKET_NAME="lanka-market-pulse"
DISTRIBUTION_ID="YOUR_CLOUDFRONT_DISTRIBUTION_ID"
REGION="ap-southeast-1"

echo "🚀 Starting deployment to AWS S3 + CloudFront..."

# Build the project
echo "📦 Building Next.js static export..."
npm run build

# Generate sitemap and RSS
echo "🗺️  Generating sitemap and RSS feed..."
node scripts/generate-sitemap.js

# Sync to S3
echo "☁️  Syncing to S3..."
aws s3 sync out/ s3://$BUCKET_NAME   --delete   --region $REGION   --cache-control "max-age=31536000,immutable"   --exclude "*.html"   --exclude "sitemap.xml"   --exclude "rss.xml"

# Sync HTML files with different cache headers
aws s3 sync out/ s3://$BUCKET_NAME   --region $REGION   --cache-control "max-age=0, must-revalidate"   --include "*.html"   --include "sitemap.xml"   --include "rss.xml"

# Set content types
aws s3 cp s3://$BUCKET_NAME/sitemap.xml s3://$BUCKET_NAME/sitemap.xml   --metadata-directive REPLACE   --content-type "application/xml"   --region $REGION

aws s3 cp s3://$BUCKET_NAME/rss.xml s3://$BUCKET_NAME/rss.xml   --metadata-directive REPLACE   --content-type "application/rss+xml"   --region $REGION

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation   --distribution-id $DISTRIBUTION_ID   --paths "/*"   --region $REGION

echo "✅ Deployment complete!"
echo "🌐 Website: https://lankamarketpulse.com"
