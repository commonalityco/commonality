// @ts-check
const path = require('path');
const baseConfig = require('@commonalityco/config-tailwind');

const getPkgPattern = (pkgName) => {
  const rootPath = path
    .dirname(require.resolve(pkgName))
    .replace('/dist', '/src');

  return path.join(rootPath, '**/*.{js,jsx,ts,tsx}');
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,css}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,css}',
    getPkgPattern('@commonalityco/ui-design-system'),
    getPkgPattern('@commonalityco/ui-core'),
    getPkgPattern('@commonalityco/feature-graph'),
  ],
};
