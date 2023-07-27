import process from 'node:process';
import { Command } from 'commander';
import type { SnapshotData, SnapshotResult } from '@commonalityco/types';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import chalk from 'chalk';
import { getPackages } from '@commonalityco/data-packages';
import { getTagsData } from '@commonalityco/data-tags';
import { getDocumentsData } from '@commonalityco/data-documents';
import { getCodeownersData } from '@commonalityco/data-codeowners';
import { getViolationsData } from '@commonalityco/data-violations';

const program = new Command();

export const actionHandler = async (options: {
  rootDirectory: string;
  snapshot: SnapshotData;
  command: Command;
}) => {
  const { default: got, HTTPError } = await import('got');
  const { default: ora } = await import('ora');

  // const rootDirectory = await getRootDirectory(options.cwd);
  // if (!rootDirectory) {
  //   action.error('Unable to determine root directory');
  // }
  // const projectConfig = await getProjectConfig({ rootDirectory });
  // if (!projectConfig) {
  //   action.error('No project configuration found');
  // }
  // if (!projectConfig.projectId) {
  //   action.error('No projectId found');
  // }
  // const snapshot = await getSnapshot(rootDirectory, projectConfig.projectId);
  // const spinner = ora(
  //   `Publishing ${snapshot.packages.length} packages...`
  // ).start();
  // const getAuthorizationHeaders = ():
  //   | {
  //       'x-api-key': string;
  //     }
  //   | { authorization: string }
  //   | Record<never, never> => {
  //   const accessToken = store.get('auth:accessToken') as string;
  //   if (options.publishKey) {
  //     return {
  //       'x-api-key': options.publishKey,
  //     };
  //   }
  //   if (accessToken) {
  //     return {
  //       authorization: `Bearer ${accessToken}`,
  //     };
  //   }
  //   return {};
  // };
  // const authorizationHeaders = getAuthorizationHeaders();
  // try {
  //   const result = await got
  //     .post(
  //       `${
  //         process.env['COMMONALITY_API_ORIGIN'] ?? 'https://app.commonality.co'
  //       }/api/cli/publish`,
  //       {
  //         json: snapshot,
  //         headers: authorizationHeaders,
  //       }
  //     )
  //     .json<SnapshotResult>();
  //   spinner.succeed('Successfully published snapshot');
  //   console.log(`View your graph at ${chalk.bold.blue(result.url)}`);
  // } catch (error: unknown) {
  //   spinner.stop();
  //   if (error instanceof HTTPError) {
  //     const responseBody = error.response.body as string;
  //     try {
  //       const body = JSON.parse(responseBody) as Error;
  //       action.error(body.message);
  //     } catch {
  //       action.error('Failed to publish snapshot');
  //     }
  //   }
  //   action.error('Failed to publish snapshot');
  // }
};

export const publish = program
  .name('publish')
  .description('Create and upload a snapshot of your monorepo')
  .option(
    '--publishKey <key>',
    'The key used to authenticate with Commonality APIs. By default this will be read from the COMMONALITY_PUBLISH_KEY environment variable.',
    process.env['COMMONALITY_PUBLISH_KEY']
  )
  .option(
    '--cwd <path>',
    "A relative path to the root of your monorepo. We will attempt to automatically detect this by looking for your package manager's lockfile."
  )
  .action(async () => {
    const rootDirectory = await getRootDirectory();
    const packages = await getPackages({ rootDirectory });
    const documentsData = await getDocumentsData({ rootDirectory });
    const projectConfig = await getProjectConfig({ rootDirectory });
    const codeownersData = await getCodeownersData({ rootDirectory, packages });
    const tagsData = await getTagsData({ rootDirectory, packages });
    const violations = await getViolationsData({
      projectConfig,
      packages,
      tagsData,
    });

    const snapshot = {
      packages,
      violations,
      projectConfig,
      documentsData,
      codeownersData,
      tagsData,
    } satisfies SnapshotData;

    await actionHandler({ rootDirectory, snapshot, command });
  });
