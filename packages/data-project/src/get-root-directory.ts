import process from 'node:process';
import path from 'node:path';
import { Lockfile } from '@commonalityco/utils-core';
import { findUp } from 'find-up';
import { fileURLToPath } from 'node:url';

export const getRootDirectory = async (cwd?: string) => {
  const __filename = fileURLToPath(import.meta.url);

  const workingDirectory = cwd
    ? path.resolve(path.dirname(__filename), cwd)
    : process.cwd();

  const rootDirectory = await findUp(
    [Lockfile.NPM_LOCKFILE, Lockfile.YARN_LOCKFILE, Lockfile.PNPM_LOCKFILE],
    {
      cwd: workingDirectory,
    },
  );

  if (!rootDirectory) {
    throw new Error('No lockfile found');
  }

  return path.dirname(rootDirectory);
};
