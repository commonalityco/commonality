const path = require('node:path');
const baseConfig = require('@commonalityco/config-tailwind');

const getPkgPattern = (pkgName) => {
  return path.join(
    path.dirname(require.resolve(pkgName)),
    '**/*.{js,jsx,ts,tsx}',
  );
};

module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    getPkgPattern('@commonalityco/ui-conformance'),
    getPkgPattern('@commonalityco/ui-design-system'),
    getPkgPattern('@commonalityco/ui-package'),
    getPkgPattern('@commonalityco/ui-core'),
    getPkgPattern('@commonalityco/feature-graph'),
  ],
};
