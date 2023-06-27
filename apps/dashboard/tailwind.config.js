// @ts-check
const path = require('path');
const packageJSON = require('./package.json');
const baseConfig = require('@commonalityco/config-tailwind');

const localPackageNames = Object.keys(packageJSON.dependencies).filter((it) =>
  it.includes('@commonalityco/ui-')
);

const pkgPaths = localPackageNames.map((pkgName) => {
  return path.join(
    require.resolve(pkgName).replace('/index.ts', ''),
    '**/*.{js,ts,jsx,tsx}'
  );
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    ...pkgPaths,
  ],
};
