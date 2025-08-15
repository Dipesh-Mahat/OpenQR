/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // For static export
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  basePath: process.env.GITHUB_ACTIONS && process.env.NODE_ENV === 'production' ? '/OpenQR' : '',
  trailingSlash: true, // Recommended for GitHub Pages
}

module.exports = nextConfig
