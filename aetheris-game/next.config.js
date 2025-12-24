/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // For base64 images and data URIs
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

