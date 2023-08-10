const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const packageJSON = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@commonalityco/feature-graph'],
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['canvas', 'jsdom'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
