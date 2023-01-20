import path from 'node:path';
import fs from 'fs-extra';
import type { ProjectConfig, SnapshotData } from '@commonalityco/types';
import { getPackages } from './get-packages';
import { getTags } from './get-tags';
import { getCurrentBranch } from './get-current-branch';

export const getSnapshot = async (
	rootDirectory: string,
	packageDirectories: string[]
): Promise<SnapshotData> => {
	const configFilePath = path.join(
		rootDirectory,
		'.commonality',
		'config.json'
	);

	const configFile = fs.readJSONSync(configFilePath) as ProjectConfig;

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
