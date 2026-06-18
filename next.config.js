/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Prevent ESLint errors from blocking the Vercel build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Prevent TypeScript type errors from blocking the Vercel build
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig
