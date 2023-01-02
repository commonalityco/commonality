import { getSnapshot } from './../core/getSnapshot';
import { getRootDirectory } from './../core/getRootDirectory';
import { Command } from 'commander';
import fetch from 'node-fetch';
import { getPackageManager } from '../core/getPackageManager';
import { getWorkspaces } from '../core/getWorkspaces';
import { getPackageDirectories } from '../core/getPackageDirectories';
import chalk from 'chalk';
import { ensureAuth } from '../core/ensureAuth';
import { config } from '../core/config';
import ora from 'ora';
import { SnapshotResult } from '@commonalityco/types';
import {
  InvalidSnapshotError,
  UnauthorizedError,
  GenericError,
} from '@commonalityco/errors';

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

  try {
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

    const result = await fetch(
      `${
        process.env.COMMONALITY_API_ORIGIN || 'https://app.commonality.co'
      }/api/cli/publish`,
      {
        method: 'POST',
        body: JSON.stringify(snapshot),
        headers: {
          'Content-Type': 'application/json',
          ...authorizationHeaders,
        },
      }
    );

    if (!result.ok) {
      switch (result.status) {
        case 400:
          throw new InvalidSnapshotError();
        case 403:
          throw new UnauthorizedError();
        case 500:
          throw new GenericError();
        default:
          throw new Error('Failed to publish snapshot');
      }
    } else {
      spinner.stopAndPersist({
        symbol: chalk.green('✔'),
        text: chalk.green('Successfully published snapshot'),
      });

      const resultData = (await result.json()) as SnapshotResult;

      console.log(`View your graph at ${chalk.bold.blue(resultData.url)}`);
    }
  } catch (error) {
    spinner.stopAndPersist({
      symbol: chalk.red('✖'),
      text: chalk.red('Failed to publish snapshot'),
    });
    const isKnownError =
      error instanceof InvalidSnapshotError ||
      error instanceof UnauthorizedError ||
      error instanceof GenericError;

    if (isKnownError) {
      action.error(error.message);
    }

    action.error('Failed to publish snapshot');
  }
};

export const publish = program
  .name('publish')
  .description('Create and upload a snapshot of your monorepo')
  .option(
    '--publishKey <key>',
    'The key used to authenticate with Commonality APIs. By default this will be read from the COMMONALITY_PUBLISH_KEY environment variable.',
    process.env.COMMONALITY_PUBLISH_KEY
  )
  .action(actionHandler);
