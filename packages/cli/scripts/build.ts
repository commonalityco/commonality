import path from 'node:path';
import fs from 'fs-extra';
import execa from 'execa';
import { rimraf } from 'rimraf';

async function main() {
  const directoryRoot = path.join(__dirname, '..');

  const packageJson = await fs.readJSON(
    path.join(directoryRoot, 'package.json')
  );
  const dependencies = Object.keys(packageJson?.dependencies ?? {});

  // Do the initial `ncc` build
  console.log('Dependencies:', dependencies);
  const externalDependencies: Array<string> = [];

  for (const dep of dependencies) {
    externalDependencies.push('--external', dep);
  }

  const arguments_ = ['ncc', 'build', 'src/index.ts', ...externalDependencies];
  rimraf(path.join(directoryRoot, 'dist'));
  await execa('pnpm', arguments_, { stdio: 'inherit', cwd: directoryRoot });
}

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:');
  console.error(error);
  process.exit(1);
});

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
