/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to allow dynamic API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
