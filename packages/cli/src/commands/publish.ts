import { getSnapshot } from './../core/getSnapshot';
import { getRootDirectory } from './../core/getRootDirectory';
import { Command } from 'commander';
import got, { HTTPError } from 'got';
import { getPackageManager } from '../core/getPackageManager';
import { getWorkspaces } from '../core/getWorkspaces';
import { getPackageDirectories } from '../core/getPackageDirectories';
import chalk from 'chalk';
import { ensureAuth } from '../core/ensureAuth';
import { config } from '../core/config';
import ora from 'ora';
import type { SnapshotResult } from '@commonalityco/types';

const program = new Command();

export const actionHandler = async (
  options: { publishKey?: string } = {},
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
    const accessToken = config.get('accessToken');

    if (options.publishKey) {
      return {
        'X-API-KEY': options.publishKey,
      };
    } else if (accessToken) {
      return {
        authorization: `Bearer ${accessToken}`,
      };
    } else {
      return {};
    }
  };

  const authorizationHeaders = getAuthorizationHeaders();

  try {
    const result = await got
      .post(
        `${
          process.env['COMMONALITY_API_ORIGIN'] || 'https://app.commonality.co'
        }/api/cli/publish`,
        {
          json: {
            snapshot,
          },
          headers: authorizationHeaders,
        }
      )
      .json<SnapshotResult>();

    spinner.succeed('Successfully published snapshot');

    console.log(`View your graph at ${chalk.bold.blue(result.url)}`);
  } catch (error) {
    spinner.fail('Failed to publish snapshot');

    if (error instanceof HTTPError) {
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
