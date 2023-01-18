import path from 'node:path';
import fs from 'fs-extra';
import type { Package, PackageConfig, PackageJson } from '@commonalityco/types';
import { getOwnersForPath } from '@commonalityco/codeowners';

export const getPackages = async ({
	packageDirectories,
	rootDirectory,
}: {
	packageDirectories: string[];
	rootDirectory: string;
}) => {
	const packagesWithTags: Package[] = [];

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

		const owners = getOwnersForPath({ path: directory, rootDirectory });

		if (!fs.pathExistsSync(packageConfigPath)) {
			if (packageJson.name) {
				packagesWithTags.push({
					name: packageJson.name,
					path: directory,
					version: packageJson.version ?? '',
					tags: [],
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
				devDependencies: formattedDevDependencies,
				dependencies: formattedDependencies,
				peerDependencies: formattedPeerDependencies,
				owners,
			});
		}
	}

	return packagesWithTags;
};
