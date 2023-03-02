import path from 'node:path';
import { Command } from 'commander';
import fs from 'fs-extra';
import type { ProjectConfig } from '@commonalityco/types';
import chalk from 'chalk';
import { store } from '../core/store';
import { ensureAuth } from '../core/ensure-auth.js';
import { getRootDirectory } from '@commonalityco/snapshot';

const program = new Command();

export const link = program
  .name('link')
  .description('Connect this repository to a project in Commonality')
  .requiredOption(
    '--org <organizationId>',
    'The ID of the organization you want to link this project to'
  )
  .option(
    '--cwd <path>',
    "A relative path to the root of your monorepo. We will attempt to automatically detect this by looking for your package manager's lockfile."
  )
  .action(
    async ({ org, cwd }: { org: string; cwd?: string }, action: Command) => {
      const { got, HTTPError } = await import('got');
      const { default: ora } = await import('ora');

      try {
        await ensureAuth(action);

        const accessToken = store.get('auth:accessToken') as string;

        const rootDirectory = await getRootDirectory(cwd);
        const rootPackageJsonPath = path.join(rootDirectory, 'package.json');
        const rootPackageJsonExists = await fs.pathExists(rootPackageJsonPath);

        if (!rootPackageJsonExists) {
          action.error('No package.json found in root directory');
        }

        const rootPackageJson = await fs.readJSON(rootPackageJsonPath);

        if (!rootPackageJson.name) {
          action.error('No project name found in root package.json');
        }

        const result = await got
          .post(
            `${
              process.env['COMMONALITY_API_ORIGIN'] ??
              'https://app.commonality.co'
            }/api/cli/link`,
            {
              json: { projectName: rootPackageJson.name, organizationId: org },
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .json<{ projectId: string }>();

        const pathToConfigFile = path.join(
          rootDirectory,
          '.commonality',
          'config.json'
        );
        const isConfigFilePresent = await fs.pathExists(pathToConfigFile);

        const spinner = ora('Setting up configuration files...').start();

        const additionalOptions = isConfigFilePresent
          ? ((await fs.readJSON(pathToConfigFile)) as ProjectConfig)
          : {};

        await fs.outputJSON(
          pathToConfigFile,
          { ...additionalOptions, projectId: result.projectId },
          { spaces: 2 }
        );

        if (isConfigFilePresent) {
          spinner.succeed('Updated configuration file');
        } else {
          spinner.succeed('Created configuration file');
        }
      } catch (error: unknown) {
        if (error instanceof HTTPError) {
          const responseBody = error.response.body as string;

          try {
            const body = JSON.parse(responseBody) as Error;

            console.log(chalk.red(body.message));
          } catch {
            console.log(chalk.red('Failed to link project'));
          }
        }
      }
    }
  );
