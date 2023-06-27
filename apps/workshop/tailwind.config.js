const path = require('path');
const baseConfig = require('@commonalityco/config-tailwind');
const packageJSON = require('./package.json');

const localPackageNames = Object.keys(packageJSON.dependencies).filter((it) =>
  it.includes('@commonalityco/ui-')
);

const pkgPaths = localPackageNames.map((pkgName) => {
  return path.join(
    require.resolve(pkgName).replace('/index.ts', ''),
    '**/*.{js,ts,jsx,tsx}'
  );
});

module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}', ...pkgPaths],
};
