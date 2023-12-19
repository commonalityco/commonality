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
import c from 'picocolors';
import { resolveModule } from 'local-pkg';
import { isCI } from 'std-env';
import prompts from 'prompts';

const command = new Command();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function ensurePackageInstalled({
  dependency,
  root,
  forceInstall,
}: {
  forceInstall?: boolean;
  dependency: string;
  root: string;
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

  process.stderr.write(
    c.red(
      `${c.inverse(
        c.red(' MISSING DEPENDENCY '),
      )} Cannot find dependency '${dependency}'\n\n`,
    ),
  );

  const getShouldInstall = async () => {
    if (forceInstall) return true;

    if (isCI) return false;

    if (process.stdout.isTTY) {
      const { install } = await prompts.prompt({
        type: 'confirm',
        name: 'install',
        message: c.reset(`Do you want to install ${c.green(dependency)}?`),
        stdout: process.stdout,
        stdin: process.stdin,
      });

      return install;
    } else {
      return false;
    }
  };

  const shouldInstall = await getShouldInstall();

  if (shouldInstall) {
    const installPkg = await import('@antfu/install-pkg');
    const packageManager = await getPackageManager({ rootDirectory: root });

    await installPkg.installPackage(dependency, {
      dev: true,
      additionalArgs: packageManager === 'pnpm' ? ['-w'] : [],
    });

    const resolved = resolveModule(DEPENDENCY_NAME, {
      paths: [root, __dirname],
    });

    return resolved;
  }
}

const DEPENDENCY_NAME = '@commonalityco/studio';

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
      console.log(`📦 Starting Commonality Studio...\n`);

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

        const url = `http://127.0.0.1:${port}`;

        await waitOn({ resources: [url] });

        const handleExit = () => {
          kill();
          console.log('Successfully exited Commonality Studio');
        };

        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);
        process.on('exit', handleExit);

        console.log(
          `Viewable at: ${chalk.blue.bold(url)} ${chalk.dim(
            '(press ctrl-c to quit)',
          )}`,
        );
      } catch (error) {
        console.log(chalk.red('Failed to start Commonality Studio'));

        if (debug) {
          console.log(error);
        }
      }
    },
  );
