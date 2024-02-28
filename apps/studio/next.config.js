module.exports = {
  reactStrictMode: true,
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
