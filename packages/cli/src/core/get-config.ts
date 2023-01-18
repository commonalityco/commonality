import path from 'node:path';
import type { ProjectConfig } from '@commonalityco/types';
import fs from 'fs-extra';

export const getConfig = async (rootDirectory: string): Promise<ProjectConfig> => {
	const configFilePath = path.join(
		rootDirectory,
		'.commonality',
		'config.json'
	);

	try {
		const configFile = (await fs.readJson(configFilePath)) as ProjectConfig;

		return configFile;
	} catch {
		throw new Error('No config file found.');
	}
};
