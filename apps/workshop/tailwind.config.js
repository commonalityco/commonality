const path = require('path');
const baseConfig = require('@commonalityco/config-tailwind');

const getPkgPattern = (pkgName) => {
  return path.join(
    path.dirname(require.resolve(pkgName)),
    '**/*.{js,jsx,ts,tsx}'
  );
};

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    getPkgPattern('@commonalityco/feature-graph'),
    getPkgPattern('@commonalityco/ui-design-system'),
    getPkgPattern('@commonalityco/ui-graph'),
    getPkgPattern('@commonalityco/ui-core'),
  ],
};
