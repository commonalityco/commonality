import process from 'node:process';
import { Command } from 'commander';
import type { SnapshotData, SnapshotResult } from '@commonalityco/types';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import chalk from 'chalk';
import { getDependencies, getPackages } from '@commonalityco/data-packages';
import { getTagsData } from '@commonalityco/data-tags';
import { getDocumentsData } from '@commonalityco/data-documents';
import { getCodeownersData } from '@commonalityco/data-codeowners';
import { getViolations } from '@commonalityco/data-violations';
import got, { HTTPError } from 'got';

const command = new Command();

export const actionHandler = async ({
  apiOrigin,
  snapshot,
  key,
  action,
}: {
  apiOrigin: string;
  key?: string;
  snapshot: SnapshotData;
  action: Command;
}) => {
  const { default: ora } = await import('ora');

  if (!snapshot.projectConfig.projectId) {
    action.error(
      chalk.red.bold('No projectId found') +
        `\nYou must include a projectId in your project configuration`,
    );
    return;
  }

  if (!key) {
    action.error(chalk.red.bold('Missing API key'));

    return;
  }

  const spinner = ora(
    `Publishing ${snapshot.packages.length} packages...`,
  ).start();

  try {
    const result = await got
      .post(`${apiOrigin ?? 'https://app.commonality.co'}/api/cli/publish`, {
        json: snapshot,
        headers: {
          'x-api-key': key,
        },
      })
      .json<SnapshotResult>();

    spinner.succeed('Successfully published snapshot');
    console.log(`View your graph at ${chalk.bold.blue(result.url)}`);
  } catch (error: unknown) {
    spinner.stop();
    if (error instanceof HTTPError) {
      const responseBody = error.response.body as string;

      try {
        const body = JSON.parse(responseBody) as Error;

        if (body.message) {
          action.error(
            `${chalk.red.bold('Failed to publish snapshot')}\n${chalk.reset(
              body.message,
            )}`,
          );
        }

        action.error(chalk.red.bold('Failed to publish snapshot'));
        return;
      } catch {
        action.error(chalk.red.bold('Failed to publish snapshot'));
        return;
      }
    }

    action.error(chalk.red.bold('Failed to publish snapshot'));
  }
};

export const publish = command
  .name('publish')
  .description('Create and upload a snapshot of your monorepo')
  .requiredOption(
    '--key <key>',
    'The key used to authenticate with Commonality APIs. By default this will be read from the COMMONALITY_API_KEY environment variable.',
    process.env['COMMONALITY_API_KEY'],
  )
  .option(
    '--cwd <path>',
    "A relative path to the root of your monorepo. We will attempt to automatically detect this by looking for your package manager's lockfile.",
  )
  .action(async (options: { key: string; cwd?: string }) => {
    const projectConfig = await getProjectConfig({
      rootDirectory: options.cwd,
    });

    if (!projectConfig || projectConfig.isEmpty) {
      return;
    }

    const rootDirectory = await getRootDirectory();
    const packages = await getPackages({ rootDirectory });
    const documentsData = await getDocumentsData({ rootDirectory });
    const dependencies = await getDependencies({ rootDirectory });

    const codeownersData = await getCodeownersData({ rootDirectory, packages });
    const tagsData = await getTagsData({ rootDirectory, packages });

    const violations = await getViolations({
      constraints: projectConfig.config.constraints,
      dependencies,
      tagsData,
    });

    const snapshot = {
      packages,
      violations,
      projectConfig: projectConfig.config,
      documentsData,
      codeownersData,
      tagsData,
      dependencies,
    } satisfies SnapshotData;

    await actionHandler({
      key: options.key,
      action: command,
      snapshot,
      apiOrigin:
        process.env['COMMONALITY_API_ORIGIN'] ?? 'https://app.commonality.co',
    });
  });
