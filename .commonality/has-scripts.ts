import * as recommended from 'commonality-checks-recommended';

export default recommended.hasJsonFile('package.json', {
  scripts: {
    build: 'tsc --build',
    dev: 'tsc --watch',
    lint: 'eslint .',
    'type-check': 'tsc --noEmit',
  },
});
