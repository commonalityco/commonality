#!/usr/bin/env node
import { Command } from 'commander';
import getPort from 'get-port';
import { validateProjectStructure } from '../utils/validate-project-structure.js';
import {
  getPackageManager,
  getRootDirectory,
} from '@commonalityco/data-project';
import chalk from 'chalk';
import waitOn from 'wait-on';
import url from 'node:url';
import { createRequire } from 'node:module';
import c from 'chalk';
import { resolveModule } from 'local-pkg';
import { isCI } from 'std-env';
import prompts from 'prompts';
import ora from 'ora';

const command = new Command();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const writeMissingDependency = (dependency: string) => {
  process.stderr.write(
    c.red(
      `\n${c.inverse(
        c.red(' MISSING DEPENDENCY '),
      )} Cannot find dependency '${dependency}'\n\n`,
    ),
  );
};

export async function ensurePackageInstalled({
  dependency,
  root,
  forceInstall,
  onInstall,
  onPrompt,
}: {
  forceInstall?: boolean;
  dependency: string;
  root: string;
  onPrompt: () => void;
  onInstall: () => void;
}): Promise<string | undefined> {
  if (process.versions.pnp) {
    const targetRequire = createRequire(__dirname);
    try {
      return targetRequire.resolve(dependency, {
        paths: [root, __dirname],
      });
    } catch {
      return;
    }
  }

  const resolved = resolveModule(DEPENDENCY_NAME, {
    paths: [root, __dirname],
  });

  if (resolved) return resolved;

  const getShouldInstall = async () => {
    if (forceInstall) {
      writeMissingDependency(dependency);

      return true;
    }

    if (isCI) {
      writeMissingDependency(dependency);

      return false;
    }

    if (process.stdout.isTTY) {
      onPrompt();

      writeMissingDependency(dependency);

      const { install } = await prompts.prompt({
        type: 'confirm',
        name: 'install',
        message: c.reset(`Do you want to install ${c.green(dependency)}?`),
        stdout: process.stdout,
        stdin: process.stdin,
      });

      return install;
    } else {
      writeMissingDependency(dependency);

      return false;
    }
  };

  const shouldInstall = await getShouldInstall();

  if (shouldInstall) {
    const installPkg = await import('@antfu/install-pkg');
    const packageManager = await getPackageManager({ rootDirectory: root });

    const getAdditionalArgs = () => {
      switch (packageManager) {
        case 'pnpm': {
          return ['-w'];
        }
        case 'yarn': {
          return ['-W'];
        }
        default: {
          return [];
        }
      }
    };

    await installPkg.installPackage(`${dependency}@latest`, {
      dev: true,
      additionalArgs: getAdditionalArgs(),
    });

    const resolved = resolveModule(DEPENDENCY_NAME, {
      paths: [root, __dirname],
    });

    return resolved;
  }
}

const DEPENDENCY_NAME = '@commonalityco/studio';

const spinner = ora('Starting Commonality Studio...');

export const studio = command
  .name('studio')
  .description('Open Commonality Studio')
  .option('--debug', 'Show debug logs')
  .option('--install', 'Install Commonality Studio if not already installed')
  .option(
    '--port <port>',
    'The port that Commonality Studio will run on',
    '8888',
  )
  .action(
    async (options: { debug?: boolean; port?: string; install?: boolean }) => {
      spinner.start();

      const preferredPort = Number(options.port);
      const debug = Boolean(options.debug);

      try {
        await validateProjectStructure({
          directory: process.cwd(),
          command,
        });

        const rootDirectory = await getRootDirectory();

        const resolved = await ensurePackageInstalled({
          dependency: DEPENDENCY_NAME,
          root: rootDirectory,
          forceInstall: options.install,
          onInstall: () => spinner.stop(),
          onPrompt: () => spinner.stop(),
        });

        if (!resolved) {
          return;
        }

        const studio = await import(resolved);

        const port = await getPort({
          port: preferredPort,
        });

        const { kill } = studio.startStudio({
          port,
          rootDirectory,
          debug,
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
        console.log(chalk.red('Failed to start Commonality Studio'));

        if (debug) {
          console.log(error);
        }
      }
    },
  );
