import path from 'node:path';
import fs from 'fs-extra';
import type { PackageJson } from '@commonalityco/types';
import yaml from 'yaml';
import { PackageManager } from '../constants/package-manager.js';

export const getWorkspaces = async (
	rootDirectory: string,
	packageManager: PackageManager
): Promise<string[]> => {
	if (
		packageManager === PackageManager.NPM ||
		packageManager === PackageManager.YARN
	) {
		const rootPackageJson = (await fs.readJson(
			path.join(rootDirectory, 'package.json')
		)) as PackageJson;

		return rootPackageJson.workspaces ?? [];
	}

	if (packageManager === PackageManager.PNPM) {
		const workspaceFilePath = path.join(rootDirectory, 'pnpm-workspace.yaml');

		if (!fs.existsSync(workspaceFilePath)) {
			throw new Error('No pnpm-workspace.yaml file found');
		}

		const yamlFile = fs.readFileSync(workspaceFilePath, 'utf8');

		const workspacesFile = (await yaml.parse(yamlFile)) as {
			packages: string[];
		};

		if (!workspacesFile?.packages) {
			throw new Error(
				'You must include the "packages" property in your pnpm-workspace.yaml file'
			);
		}

		return workspacesFile.packages;
	}

	throw new Error('Invalid package manager');
};
