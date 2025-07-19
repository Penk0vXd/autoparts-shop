const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore during builds if you're confident about code quality
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Only ignore during builds if you're confident about types
    ignoreBuildErrors: true,
  },
  
  // Enhanced image configuration for production
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      // Allow specific trusted domains for product images
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
    // Optimize images but allow fallbacks
    unoptimized: false,
    // Add proper image formats
    formats: ['image/webp', 'image/avif'],
    // Set reasonable image limits
    minimumCacheTTL: 60,
    // Optimize for large images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Webpack configuration for better module resolution
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ensure proper path alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    // Optimize chunk splitting for better build stability
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            enforce: true,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Enhanced experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
  
  // Better error handling during build
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    // Enable compression
    compress: true,
    // Optimize build
    swcMinify: true,
    // Better performance
    poweredByHeader: false,
    // Ensure CSS is properly optimized
    optimizeFonts: true,
  }),
};

module.exports = withNextIntl(nextConfig); 