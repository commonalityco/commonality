module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    '@commonalityco/ui-design-system',
    '@commonalityco/ui-package',
    '@commonalityco/ui-core',
    '@commonalityco/feature-graph',
  ],
  async redirects() {
    return [
      {
        source: '/((?!graph|packages).*)',
        destination: '/graph',
        permanent: true,
      },
    ];
  },
};
