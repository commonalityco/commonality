import path from 'node:path';
import { getConstraintViolations } from '@commonalityco/constraints';
import { Command } from 'commander';
import chalk from 'chalk';
import groupBy from 'lodash.groupby';
import termialLink from 'terminal-link';
import fs from 'fs-extra';
import type { Config } from '@commonalityco/types';
import terminalLink from 'terminal-link';
import { getRootDirectory } from '../core/get-root-directory.js';
import { getWorkspaces } from '../core/get-workspaces.js';
import { getPackageManager } from '../core/get-package-manager.js';
import { getPackageDirectories } from '../core/get-package-directories.js';
import { getPackages } from '../core/get-packages.js';
import { getConfig } from '../core/get-config.js';

const program = new Command();

const logNoDefinedConstraints = () => {
	console.log(chalk.yellow('No constraints found'));
	console.log(
		'Define dependency constraints in your configuration file to control how packages are shared.'
	);
};

const logDependencyConstraintCount = (config: Config, path: string) => {
	const constraintTags = config.constraints ?? [];

	const text =
		constraintTags.length > 1
			? `${constraintTags.length} dependency constraints found`
			: `${constraintTags.length} dependency constraint found`;

	const link = termialLink(text, path);

	console.log(chalk.blue(link));
};

const logDependencyName = (packageName: string, path: string) => {
	const link = termialLink(`📦 ${packageName}`, path);

	console.log(chalk(link));
};

export const validate = program
	.name('validate')
	.description(
		"Validate your project's package constraints and deprecation notices"
	)
	.option(
		'--cwd <path>',
		"A relative path to the root of your monorepo. We will attempt to automatically detect this by looking for your package manager's lockfile."
	)
	.action(
		async ({ cwd }: { project: string; cwd?: string }, action: Command) => {
			const rootDirectory = await getRootDirectory(cwd);
			const packageManager = await getPackageManager(rootDirectory);
			const workspaces = await getWorkspaces(rootDirectory, packageManager);
			const packageDirectories = await getPackageDirectories(
				rootDirectory,
				workspaces
			);
			const packages = await getPackages({ packageDirectories, rootDirectory });
			const config = await getConfig(rootDirectory);
			const violations = getConstraintViolations({ packages, config });
			const violationsByPackageName = groupBy(violations, 'sourceName');
			const packageNames = Object.keys(violationsByPackageName);

			console.log();

			if (Object.keys(config.constraints ?? {}).length === 0) {
				logNoDefinedConstraints();
				return;
			}

			logDependencyConstraintCount(
				config,
				path.join(rootDirectory, '.commonality/config.json')
			);

			console.log();

			if (violations.length === 0) {
				console.log(chalk.green('No violations found'));
				return;
			}

			for (const packageName of packageNames) {
				const violations = violationsByPackageName[packageName];
				const pkg = packages.find((pkg) => pkg.name === packageName);

				if (!violations || !pkg) {
					continue;
				}

				logDependencyName(
					packageName,
					path.join(rootDirectory, pkg.path, 'commonality.json')
				);

				for (let index = 0; index < violations.length; index++) {
					const violation = violations[index];

					if (!violation) {
						continue;
					}

					const isLastViolation =
						index === violations.length - 1 &&
						violations.indexOf(violation) === violations.length - 1;

					const topSpacer = isLastViolation ? '└──' : '├──';
					const middleSpacer = isLastViolation ? '   ' : '│  ';

					console.log('│  ');

					const dependencyPkg = packages.find(
						(pkg) => pkg.name === violation.targetName
					);

					if (!dependencyPkg) {
						continue;
					}

					const dependencyConfigurationPath = path.join(
						rootDirectory,
						dependencyPkg.path,
						'commonality.json'
					);
					const dependencyManifestPath = path.join(
						rootDirectory,
						dependencyPkg.path,
						'package.json'
					);

					const hasPackageConfigurationFile = fs.pathExistsSync(
						dependencyConfigurationPath
					);

					const dependencyNameLinkPath = hasPackageConfigurationFile
						? dependencyConfigurationPath
						: dependencyManifestPath;

					console.log(
						topSpacer,
						terminalLink(dependencyPkg.name, dependencyNameLinkPath)
					);

					if (hasPackageConfigurationFile) {
						console.log(middleSpacer, chalk.red('Received tags:'));

						console.log(
							middleSpacer,
							chalk.red(JSON.stringify(violation.targetTags))
						);

						console.log(middleSpacer, chalk.green('Expected tags:'));
						console.log(
							middleSpacer,
							chalk.green(JSON.stringify(violation.allowedTags))
						);
					} else {
						console.log(
							middleSpacer,
							chalk.red('Missing package configuration')
						);
					}
				}

				console.log();
			}

			action.error(chalk.bold.red(`${violations.length} violations found`));
		}
	);
