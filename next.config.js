const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Common brand logo sources
      {
        protocol: 'https',
        hostname: 'www.tvh.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
      // Allow any HTTPS image for development (remove in production)
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    // Fallback for unoptimized images
    unoptimized: false,
  },
  output: 'standalone',
};

module.exports = withNextIntl(nextConfig); 