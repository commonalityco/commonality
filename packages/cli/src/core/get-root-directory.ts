import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findUp } from 'find-up';
import { Lockfile } from '../constants/lockfile.js';

export const getRootDirectory = async (cwd?: string) => {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
