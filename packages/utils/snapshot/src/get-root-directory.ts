import process from 'node:process';
import path from 'node:path';
import { Lockfile } from '@commonalityco/types';
import findUp from 'find-up';

export const getRootDirectory = async (cwd?: string) => {
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
