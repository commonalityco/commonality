import packageJson from './package.json';

// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://0a6fce90f23b6dfe70043795a2038cd2@o503511.ingest.sentry.io/4506736522035200',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  environment: process.env.NODE_ENV,

  release: packageJson.version,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  enabled: false,
});
