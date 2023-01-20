import process from 'node:process';
import path from 'node:path';
import { Lockfile } from '../constants/lockfile';

export const getRootDirectory = async (cwd?: string) => {
  const { findUp } = await import('find-up');
  const workingDirectory = cwd ? path.resolve(__dirname, cwd) : process.cwd();

  const rootDirectory = await findUp(
    [Lockfile.NPM_LOCKFILE, Lockfile.YARN_LOCKFILE, Lockfile.PNPM_LOCKFILE],
    {
      cwd: workingDirectory,
    }
  );

  if (!rootDirectory) {
    throw new Error('No lockfile found');
  }

  return path.dirname(rootDirectory);
};
