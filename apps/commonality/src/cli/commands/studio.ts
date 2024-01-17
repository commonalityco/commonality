#!/usr/bin/env node
import { Command } from 'commander';
import getPort from 'get-port';
import { validateProjectStructure } from '../utils/validate-project-structure.js';
import { getRootDirectory } from '@commonalityco/data-project';
import chalk from 'chalk';
import waitOn from 'wait-on';
import url from 'node:url';
import { resolveModule } from 'local-pkg';
import ora from 'ora';

const command = new Command();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const DEPENDENCY_NAME = '@commonalityco/studio';

const spinner = ora('Starting Commonality Studio...');

export const studio = command
  .name('studio')
  .description('Open Commonality Studio')
  .option('--verbose', 'Show additional logging output')
  .option(
    '--port <port>',
    'The port that Commonality Studio will run on',
    '8888',
  )
  .action(
    async (options: {
      verbose?: boolean;
      port?: string;
      install?: boolean;
    }) => {
      spinner.start();

      const preferredPort = Number(options.port);
      const verbose = Boolean(options.verbose);

      try {
        await validateProjectStructure({
          directory: process.cwd(),
          command,
        });

        const rootDirectory = await getRootDirectory();

        const resolved = resolveModule(DEPENDENCY_NAME, {
          paths: [rootDirectory, __dirname],
        });

        if (!resolved) {
          console.log(
            '\nCommonality Studio is not installed, try running the install command for your package manager.',
          );
          return;
        }

        const studio = await import(resolved);

        const port = await getPort({
          port: preferredPort,
        });

        const { kill } = studio.startStudio({
          port,
          rootDirectory,
          debug: verbose,
        });

        const handleExit = () => {
          kill();
          console.log('\nSuccessfully exited Commonality Studio');
          process.exit();
        };

        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);

        const url = `http://127.0.0.1:${port}`;

        await waitOn({ resources: [url], timeout: 10_000 });

        spinner.stopAndPersist({
          prefixText: `\n  ${chalk.bold.underline(
            'Welcome to Commonality Studio',
          )}`,
          text: `\n\n  Viewable at: ${chalk.blue.bold(url)}`,
          suffixText: chalk.dim('\n  (press ctrl-c to quit)'),
        });
      } catch (error) {
        spinner.fail('Failed to start Commonality Studio');

        if (debug) {
          console.log(error);
        }
      }
    },
  );
