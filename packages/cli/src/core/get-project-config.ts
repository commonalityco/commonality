/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import path from 'node:path';
import fs from 'fs-extra';
import { register } from 'ts-node';
import type { ProjectConfig } from '@commonalityco/types';

const moduleName = 'commonality';

const configNames = [
	`${moduleName}.config.js`,
	`${moduleName}.config.cjs`,
	`${moduleName}.config.ts`,
];

export const getProjectConfig = async (
	rootDirectory: string
): Promise<ProjectConfig | undefined> => {
	const { findUp } = await import('find-up');

	const configFilePath = await findUp(configNames);

	if (!configFilePath) {
		return undefined;
	}

	const rootPackageJsonPath = path.join(rootDirectory, 'package.json');
	const rootPackageJson = await fs.readJson(rootPackageJsonPath);

	const isRootModule = rootPackageJson.type === 'module';
	const isModule = configFilePath.endsWith('.mjs');
	const isEsm = isModule || isRootModule;

	const isTypeScript = configFilePath.endsWith('.ts');

	try {
		if (isEsm) {
			return await import(configFilePath);
		} else if (isTypeScript) {
			register({
				compilerOptions: { module: 'commonjs' },
				swc: true,
			});

			return await require(configFilePath);
		} else {
			return await require(configFilePath);
		}
	} catch (error: unknown) {
		console.log({ error });
		throw new Error('Encountered an error reading your project configuration.');
	}
};
