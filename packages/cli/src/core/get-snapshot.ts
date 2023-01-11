import path from 'node:path';
import fs from 'fs-extra';
import type { Config, LocalPackage } from '@commonalityco/types';
import { getPackages } from './get-packages.js';
import { getTags } from './get-tags.js';
import { getCurrentBranch } from './get-current-branch.js';

export const getSnapshot = async (
	rootDirectory: string,
	packageDirectories: string[]
): Promise<{
	projectId: string;
	branch: string;
	packages: LocalPackage[];
	tags: string[];
}> => {
	const configFilePath = path.join(
		rootDirectory,
		'.commonality',
		'config.json'
	);

	const configFile = fs.readJSONSync(configFilePath) as Config;

	const packages = await getPackages({ packageDirectories, rootDirectory });

	const currentBranch = await getCurrentBranch();

	const tags = await getTags({ packageDirectories, rootDirectory });

	return {
		branch: currentBranch,
		projectId: configFile.project,
		packages,
		tags,
	};
};
