const baseConfig = require('@commonalityco/config-tailwind');
const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
    './theme.config.tsx',
  ],
};
