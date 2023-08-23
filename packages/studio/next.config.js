/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['canvas', 'jsdom'],
  },
  transpilePackages: [
    '@commonalityco/data-codeowners',
    '@commonalityco/data-documents',
    '@commonalityco/data-graph',
    '@commonalityco/data-graph-worker',
    '@commonalityco/data-packages',
    '@commonalityco/data-project',
    '@commonalityco/data-tags',
    '@commonalityco/data-violations',
    '@commonalityco/feature-graph',
    '@commonalityco/types',
    '@commonalityco/ui-core',
    '@commonalityco/ui-design-system',
    '@commonalityco/ui-graph',
    '@commonalityco/utils-core',
    '@commonalityco/utils-graph',
    '@commonalityco/utils-package',
  ],
  modularizeImports: {
    '@commonalityco/feature-graph': {
      transform: '@commonalityco/feature-graph/{{kebabCase member}}',
    },
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);

// module.exports = nextConfig;
