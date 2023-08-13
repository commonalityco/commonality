/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['canvas', 'jsdom'],
  },
  transpilePackages: ['@commonalityco/feature-graph'],
};

module.exports = nextConfig;
