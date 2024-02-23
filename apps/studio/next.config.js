const { withSentryConfig } = require('@sentry/nextjs');

module.exports = {
  reactStrictMode: true,

  transpilePackages: [
    //   '@commonalityco/data-codeowners',
    //   '@commonalityco/data-graph',
    //   '@commonalityco/data-graph-worker',
    //   '@commonalityco/data-packages',
    //   '@commonalityco/data-project',
    //   '@commonalityco/data-tags',
    //   // '@commonalityco/ui-constraints',
    //   '@commonalityco/ui-conformance',
    //   // '@commonalityco/utils-conformance',
    //   '@commonalityco/feature-graph',
    //   '@commonalityco/ui-core',
    //   '@commonalityco/ui-design-system',
    // '@commonalityco/ui-graph',
    //   '@commonalityco/ui-package',
    //   '@commonalityco/utils-core',
    //   '@commonalityco/utils-graph',
    //   '@commonalityco/utils-package',
  ],
};
// {
//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options

//   // Suppresses source map uploading logs during build
//   silent: true,
//   org: 'alec-ortega',
//   project: 'studio',
// },

//   {
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,

//     // Transpiles SDK to be compatible with IE11 (increases bundle size)
//     transpileClientSDK: true,

//     // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
//     tunnelRoute: '/monitoring',

//     // Hides source maps from generated client bundles
//     hideSourceMaps: true,

//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,
//   },
// );
