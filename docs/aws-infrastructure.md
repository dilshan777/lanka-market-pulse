# AWS Infrastructure Setup for Lanka Market Pulse

## Architecture

```
Users → CloudFront (CDN) → S3 (Static Website) → Route 53 (DNS)
                                    ↓
                            CloudWatch (Monitoring)
```

## S3 Bucket Configuration

### Create Bucket
```bash
aws s3 mb s3://lanka-market-pulse --region ap-southeast-1
```

### Enable Static Website Hosting
```bash
aws s3 website s3://lanka-market-pulse --index-document index.html --error-document 404.html
```

### Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::lanka-market-pulse/*"
    }
  ]
}
```

### CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## CloudFront Distribution

### Origin Settings
- **Origin Domain**: lanka-market-pulse.s3.amazonaws.com
- **Origin Access**: Public (with bucket policy)

### Default Cache Behavior
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Allowed HTTP Methods**: GET, HEAD, OPTIONS
- **Cache Policy**: Managed-CachingOptimized
- **Origin Request Policy**: Managed-CORS-S3Origin
- **Response Headers Policy**: Managed-SecurityHeadersPolicy

### Error Pages
- **404**: /404.html, HTTP 200
- **403**: /404.html, HTTP 200

### SSL Certificate
- Use AWS Certificate Manager (ACM)
- Request certificate for lankamarketpulse.com and www.lankamarketpulse.com
- Validate via DNS (Route 53)

## Route 53 Configuration

### Hosted Zone
- Domain: lankamarketpulse.com

### Records
```
A     lankamarketpulse.com     CloudFront Distribution
AAAA  lankamarketpulse.com     CloudFront Distribution
CNAME www.lankamarketpulse.com lankamarketpulse.com
```

## IAM Policy for Deployment

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::lanka-market-pulse",
        "arn:aws:s3:::lanka-market-pulse/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

## Cost Optimization

### S3
- Use S3 Standard for frequently accessed content
- Enable lifecycle policies for old reports
- Monitor storage costs via Cost Explorer

### CloudFront
- Use price class "Use Only US, Canada, Europe, Asia, Middle East, and Africa"
- Enable compression (Brotli/gzip)
- Set appropriate cache headers

### Estimated Monthly Costs
- S3 Storage: ~$1-5 (depending on content volume)
- CloudFront: ~$5-20 (depending on traffic)
- Route 53: ~$0.50 (hosted zone)
- **Total: ~$10-30/month**

## Security

### S3
- Block all public access (except via CloudFront)
- Enable server-side encryption (SSE-S3)
- Enable versioning for content recovery

### CloudFront
- Enable AWS WAF (Web Application Firewall)
- Configure geo-restrictions if needed
- Enable access logging

### HTTPS
- Force HTTPS via CloudFront
- HSTS headers via Response Headers Policy
- TLS 1.2+ minimum

## Monitoring

### CloudWatch
- CloudFront metrics (requests, errors, latency)
- S3 metrics (requests, errors)
- Set up alarms for 5xx errors

### AWS Budgets
- Set monthly budget alert at $50
- Email notification on threshold breach
