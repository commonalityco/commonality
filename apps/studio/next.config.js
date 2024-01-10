/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@commonalityco/data-codeowners',
    '@commonalityco/data-graph',
    '@commonalityco/data-graph-worker',
    '@commonalityco/data-packages',
    '@commonalityco/data-project',
    '@commonalityco/data-tags',
    '@commonalityco/ui-conformance',
    '@commonalityco/utils-conformance',
    '@commonalityco/feature-graph',
    '@commonalityco/ui-core',
    '@commonalityco/ui-design-system',
    '@commonalityco/ui-graph',
    '@commonalityco/ui-package',
    '@commonalityco/utils-core',
    '@commonalityco/utils-graph',
    '@commonalityco/utils-package',
  ],
};

module.exports = nextConfig;

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// module.exports = withBundleAnalyzer(nextConfig);
