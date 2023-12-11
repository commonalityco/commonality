const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  transpilePackages: ['@commonalityco/ui-design-system'],
});

module.exports = withNextra();
