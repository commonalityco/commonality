import path from 'node:path';
import fs from 'fs-extra';
import type {
	LocalPackage,
	PackageConfig,
	PackageJson,
} from '@commonalityco/types';
import { getOwnersForPath } from '@commonalityco/codeowners';
import { getPackageType } from './get-package-type.js';

export const getPackages = async ({
	packageDirectories,
	rootDirectory,
}: {
	packageDirectories: string[];
	rootDirectory: string;
}) => {
	const packagesWithTags: LocalPackage[] = [];

	for (const directory of packageDirectories) {
		const packageJsonPath = path.join(rootDirectory, directory, 'package.json');
		const packageConfigPath = path.join(
			rootDirectory,
			directory,
			'commonality.json'
		);

		const packageJson = fs.readJSONSync(packageJsonPath) as PackageJson;

		const dependencies = packageJson.dependencies ?? {};
		const devDependencies = packageJson.devDependencies ?? {};
		const peerDependencies = packageJson.peerDependencies ?? {};

		const formattedDependencies = Object.entries(dependencies).map(
			([name, version]) => ({ name, version })
		);
		const formattedDevDependencies = Object.entries(devDependencies).map(
			([name, version]) => ({ name, version })
		);
		const formattedPeerDependencies = Object.entries(peerDependencies).map(
			([name, version]) => ({ name, version })
		);

		const allDeps = [
			...formattedDependencies,
			...formattedDevDependencies,
			...formattedPeerDependencies,
		];
		const type = getPackageType(allDeps);

		const owners = getOwnersForPath({ path: directory, rootDirectory });

		if (!fs.pathExistsSync(packageConfigPath)) {
			if (packageJson.name) {
				packagesWithTags.push({
					name: packageJson.name,
					path: directory,
					version: packageJson.version ?? '',
					tags: [],
					type,
					devDependencies: formattedDevDependencies,
					dependencies: formattedDependencies,
					peerDependencies: formattedPeerDependencies,
					owners,
				});
			}

			continue;
		}

		const pkgConfig = fs.readJSONSync(packageConfigPath) as PackageConfig;

		if (packageJson.name) {
			packagesWithTags.push({
				name: packageJson.name,
				path: directory,
				version: packageJson.version ?? '',
				tags: pkgConfig.tags ?? [],
				type: getPackageType([
					...formattedDependencies,
					...formattedDevDependencies,
					...formattedPeerDependencies,
				]),
				devDependencies: formattedDevDependencies,
				dependencies: formattedDependencies,
				peerDependencies: formattedPeerDependencies,
				owners,
			});
		}
	}

	return packagesWithTags;
};
