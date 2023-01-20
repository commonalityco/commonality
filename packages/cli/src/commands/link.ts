import path from 'node:path';
import { Command } from 'commander';
import fs from 'fs-extra';
import type { ProjectConfig } from '@commonalityco/types';
import { getRootDirectory } from '../core/get-root-directory.js';

const program = new Command();

export const link = program
	.name('link')
	.description('Connect this repository to a project in Commonality')
	.requiredOption('--project <projectId>', 'The ID of the project to link to')
	.option(
		'--cwd <path>',
		"A relative path to the root of your monorepo. We will attempt to automatically detect this by looking for your package manager's lockfile."
	)
	.action(async ({ project, cwd }: { project: string; cwd?: string }) => {
		const { default: chalk } = await import('chalk');
		const { default: ora } = await import('ora');

		const rootDirectory = await getRootDirectory(cwd);
		const pathToFile = path.join(rootDirectory, '.commonality', 'config.json');
		const isConfigFilePresent = await fs.pathExists(pathToFile);

		const spinner = ora('Setting up configuration files...').start();

		const additionalOptions = isConfigFilePresent
			? ((await fs.readJSON(pathToFile)) as ProjectConfig)
			: {};

		await fs.outputJSON(
			pathToFile,
			{ ...additionalOptions, project },
			{ spaces: 2 }
		);

		if (isConfigFilePresent) {
			spinner.succeed('Updated configuration file');
		} else {
			spinner.succeed('Created configuration file');
		}

		console.log(chalk.dim(pathToFile));
	});
