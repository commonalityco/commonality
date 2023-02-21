const path = require('path');
const packageJSON = require('./package.json');
const { fontFamily } = require('tailwindcss/defaultTheme');

const transpilePackages = Object.keys(packageJSON.dependencies).filter((it) =>
  it.includes('@commonalityco/ui-')
);

const pkgPaths = transpilePackages.map((pkgName) => {
  return path.join(
    require.resolve(pkgName).replace('/index.ts', ''),
    '**/*.{js,ts,jsx,tsx}'
  );
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    // path.join(
    //   require.resolve('reactflow').replace('/umd/index.js', ''),
    //   '**/*.{css,js}'
    // ),
    ...pkgPaths,
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-inter)', ...fontFamily.sans],
      serif: ['var(--font-vollkorn)', ...fontFamily.serif],
      mono: ['var(--font-fira-code)', ...fontFamily.mono],
    },
    extend: {
      gridAutoColumns: {
        'tab-list': 'minmax(150px, 350px)',
      },
      gridTemplateColumns: {
        wizard: '250px 1fr',
        'tab-list': 'repeat(auto-fill, minmax(150px, 350px))',
      },
      aria: {
        invalid: 'invalid="true"',
      },
      transitionTimingFunction: {
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      keyframes: {
        slideDownAndFade: {
          '0%': { opacity: 0, transform: 'translateY(-2px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUpAndFade: {
          '0%': { opacity: 0, transform: 'translateY(2px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideLeftAndFade: {
          '0%': { opacity: 0, transform: 'translateX(2px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideRightAndFade: {
          '0%': { opacity: 0, transform: 'translateX(-2px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-up-fade': 'slideUpAndFade 150ms ease-in-out',
        'slide-down-fade': 'slideDownAndFade 150ms ease-in-out',
        'slide-left-fade': 'slideLeftAndFade 150ms ease-in-out',
        'slide-right-fade': 'slideRightAndFade 150ms ease-in-out',
      },
    },
  },
  plugins: [],
};
