import process from 'node:process';
import { Command } from 'commander';
import * as got from 'got';
import chalk from 'chalk';
import ora from 'ora';
import type { SnapshotResult } from '@commonalityco/types';
import { getPackageManager } from '../core/get-package-manager.js';
import { getWorkspaces } from '../core/get-workspaces.js';
import { getPackageDirectories } from '../core/get-package-directories.js';
import { ensureAuth } from '../core/ensure-auth.js';
import { config } from '../core/config.js';
import { getSnapshot } from '../core/get-snapshot.js';
import { getRootDirectory } from '../core/get-root-directory.js';

const program = new Command();

export const actionHandler = async (
	options: { publishKey?: string },
	action: Command
) => {
	if (!options.publishKey) {
		await ensureAuth();
	}

	const rootDirectory = await getRootDirectory();

	if (!rootDirectory) {
		console.log(chalk.red('Unable to deterimine root directory'));
		return;
	}

	const packageManager = await getPackageManager(rootDirectory);
	const workspaces = await getWorkspaces(rootDirectory, packageManager);
	const packageDirectories = await getPackageDirectories(
		rootDirectory,
		workspaces
	);

	const snapshot = await getSnapshot(rootDirectory, packageDirectories);

	const spinner = ora(
		`Publishing ${snapshot.packages.length} packages...`
	).start();

	const getAuthorizationHeaders = ():
		| {
				'X-API-KEY': string;
		  }
		| { authorization: string }
		| Record<never, never> => {
		const accessToken = config.get('accessToken') as string;

		if (options.publishKey) {
			return {
				'X-API-KEY': options.publishKey,
			};
		}

		if (accessToken) {
			return {
				authorization: `Bearer ${accessToken}`,
			};
		}

		return {};
	};

	const authorizationHeaders = getAuthorizationHeaders();

	try {
		const result = await got.got
			.post(
				`${
					process.env['COMMONALITY_API_ORIGIN'] ?? 'https://app.commonality.co'
				}/api/cli/publish`,
				{
					json: snapshot,
					headers: authorizationHeaders,
				}
			)
			.json<SnapshotResult>();

		spinner.succeed('Successfully published snapshot');

		console.log(`View your graph at ${chalk.bold.blue(result.url)}`);
	} catch (error: unknown) {
		spinner.fail('Failed to publish snapshot');

		if (error instanceof got.HTTPError) {
			action.error(error.message);
		}
	}
};

export const publish = program
	.name('publish')
	.description('Create and upload a snapshot of your monorepo')
	.option(
		'--publishKey <key>',
		'The key used to authenticate with Commonality APIs. By default this will be read from the COMMONALITY_PUBLISH_KEY environment variable.',
		process.env['COMMONALITY_PUBLISH_KEY']
	)
	.action(actionHandler);
