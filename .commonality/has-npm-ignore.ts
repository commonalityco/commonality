import * as recommended from 'commonality-checks-recommended';

export default recommended.hasTextFile('.npmignore', ['*.test.*']);
