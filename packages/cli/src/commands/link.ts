import path from 'node:path';
import { Command } from 'commander';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { type Config } from '@commonalityco/types';
import { getRootDirectory } from '../core/get-root-directory.js';

const program = new Command();

export const link = program
	.name('link')
	.description('Connect this repository to a project in Commonality')
	.requiredOption('--project <projectId>', 'The ID of the project to link to')
	.action(async ({ project }: { project: string }) => {
		const rootDirectory = await getRootDirectory();
		const pathToFile = path.join(rootDirectory, '.commonality', 'config.json');
		const isConfigFilePresent = await fs.pathExists(pathToFile);

		const spinner = ora('Setting up configuration files...').start();

		const additionalOptions = isConfigFilePresent
			? ((await fs.readJSON(pathToFile)) as Config)
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
