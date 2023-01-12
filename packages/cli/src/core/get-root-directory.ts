import process from 'node:process';
import path from 'node:path';
import { findUp } from 'find-up';
import { Lockfile } from '../constants/foo.js';

export const getRootDirectory = async (cwd = process.cwd()) => {
	const rootDirectory = await findUp(
		[Lockfile.NPM_LOCKFILE, Lockfile.YARN_LOCKFILE, Lockfile.PNPM_LOCKFILE],
		{
			cwd,
		}
	);

	if (!rootDirectory) {
		throw new Error('No lockfile found');
	}

	return path.dirname(rootDirectory);
};
