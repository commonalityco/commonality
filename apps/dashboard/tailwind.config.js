// @ts-check
const path = require('path');
const baseConfig = require('@commonalityco/config-tailwind');

const getPkgPattern = (pkgName) => {
  return path.join(
    path.dirname(require.resolve(pkgName)),
    '**/*.{js,jsx,ts,tsx}'
  );
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    getPkgPattern('@commonalityco/feature-graph'),
    getPkgPattern('@commonalityco/ui-design-system'),
    getPkgPattern('@commonalityco/ui-graph'),
    getPkgPattern('@commonalityco/ui-core'),
  ],
};
