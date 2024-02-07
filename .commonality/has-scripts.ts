import { hasJsonFile } from 'commonality-checks-recommended';

export default hasJsonFile('package.json', {
  scripts: {
    build: 'tsc --build',
    dev: 'tsc --watch',
    lint: 'eslint .',
    'type-check': 'tsc --noEmit',
  },
});
