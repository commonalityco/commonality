#!/usr/bin/env node
const [major, minor] = process.version.slice(1).split('.');

// We don't use the semver library here because:
//  1. it is already bundled to dist/pnpm.cjs, so we would load it twice
//  2. we want this file to support potentially older Node.js versions than what semver supports
if (major < 16 || (major == 16 && minor < 14)) {
  console.log(`ERROR: Commonality requires at least Node.js v16.14
The current version of Node.js is ${process.version}`);
  process.exit(1);
}

require('../dist/index.js');
