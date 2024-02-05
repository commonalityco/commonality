import { hasJsonFile } from 'commonality-checks-recommended';

export default hasJsonFile('.eslintrc.json', {
  root: true,
  extends: ['commonality'],
});
