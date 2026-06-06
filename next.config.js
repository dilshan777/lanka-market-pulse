/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable image optimization for static export
  // Images must be served from public/ or external CDN
  compress: true,
  // Generate static params for all dynamic routes
  generateBuildId: () => 'lanka-market-pulse-' + Date.now(),
};

module.exports = nextConfig;
