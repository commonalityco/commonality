/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['canvas', 'jsdom'],
  },
};

module.exports = nextConfig;
