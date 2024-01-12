import baseConfig from '@commonalityco/config-tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    'theme.config.tsx',
    '../../packages/ui-design-system/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
