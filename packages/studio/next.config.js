/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['canvas', 'jsdom'],
  },
  transpilePackages: ['@commonalityco/feature-graph'],
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
    '@commonalityco/utils-graph': {
      transform: '@commonalityco/utils-graph/{{kebabCase member}}',
    },
    '@commonalityco/feature-graph': {
      transform: '@commonalityco/feature-graph/{{kebabCase member}}',
    },
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
