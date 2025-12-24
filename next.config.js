/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    unoptimized: false, // Enable optimization for Vercel
  },
  
  // Compression
  compress: true,
  
  // Package optimization
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Asset optimization
  webpack: (config) => {
    config.optimization.minimize = true
    return config
  },
}

module.exports = nextConfig

