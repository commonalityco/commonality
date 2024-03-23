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
        source: '/:path+',
        destination: '/',
        permanent: false, // Set to true if you want the redirect to be permanent
        basePath: false,
      },
    ];
  },
};
