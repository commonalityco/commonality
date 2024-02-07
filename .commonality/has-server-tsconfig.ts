import { hasJsonFile } from 'commonality-checks-recommended';

export default hasJsonFile('tsconfig.json', {
  extends: '@commonalityco/config-tsconfig/node.json',
  include: ['src/**/*.ts', 'src/**/*.tsx'],
  compilerOptions: {
    outDir: './dist',
    rootDir: './src',
    typeRoots: ['./node_modules/@types'],
  },
});
