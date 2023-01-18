import path from 'node:path';
import type { Config } from '@commonalityco/types';
import fs from 'fs-extra';

export const getConfig = async (rootDirectory: string): Promise<Config> => {
	const configFilePath = path.join(
		rootDirectory,
		'.commonality',
		'config.json'
	);

	try {
		const configFile = (await fs.readJson(configFilePath)) as Config;

		return configFile;
	} catch {
		throw new Error('No config file found.');
	}
};
