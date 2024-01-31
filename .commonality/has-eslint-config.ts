import * as recommended from 'commonality-checks-recommended';

export default recommended.hasJsonFile('.eslintrc.json', {
  root: true,
  extends: ['commonality'],
});
