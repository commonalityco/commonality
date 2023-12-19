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
import killPort from 'kill-port';
import url from 'node:url';
import { createRequire } from 'node:module';
import c from 'picocolors';
import { resolveModule } from 'local-pkg';
import { isCI } from 'std-env';
import prompts from 'prompts';
import { ExecaChildProcess } from 'execa';

const EXIT_CODE_RESTART = 43;

const command = new Command();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function ensurePackageInstalled(
  dependency: string,
  root: string,
): Promise<string | undefined> {
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

  const promptInstall = !isCI && process.stdout.isTTY;

  process.stderr.write(
    c.red(
      `${c.inverse(
        c.red(' MISSING DEPENDENCY '),
      )} Cannot find dependency '${dependency}'\n\n`,
    ),
  );

  if (!promptInstall) return;

  const { install } = await prompts.prompt({
    type: 'confirm',
    name: 'install',
    message: c.reset(`Do you want to install ${c.green(dependency)}?`),
    stdout: process.stdout,
    stdin: process.stdin,
  });

  if (install) {
    const installPkg = await import('@antfu/install-pkg');
    const packageManager = await getPackageManager({ rootDirectory: root });

    await installPkg.installPackage(dependency, {
      dev: true,
      additionalArgs: packageManager === 'pnpm' ? ['-w'] : [],
    });

    process.stderr.write(
      c.yellow(
        `\nPackage ${dependency} installed, re-run the command to start.\n`,
      ),
    );

    process.exit(EXIT_CODE_RESTART);
  }
}

const DEPENDENCY_NAME = '@commonalityco/studio';

export const studio = command
  .name('studio')
  .description('Open Commonality Studio')
  .option('--debug')
  .option(
    '--port <port>',
    'The port that Commonality Studio will run on',
    '8888',
  )
  .action(async (options: { debug?: boolean; port?: string }) => {
    console.log(`📦 Starting Commonality Studio...\n`);

    const preferredPort = Number(options.port);
    const debug = Boolean(options.debug);

    try {
      await validateProjectStructure({
        directory: process.cwd(),
        command,
      });

      const rootDirectory = await getRootDirectory();

      const resolved = await ensurePackageInstalled(
        DEPENDENCY_NAME,
        rootDirectory,
      );

      if (!resolved) {
        return;
      }

      const studio = await import(resolved);

      const port = await getPort({
        port: preferredPort,
      });

      const url = `http://127.0.0.1:${port}`;

      const { kill } = await studio.startStudio({
        port,
        rootDirectory,
        debug,
        onExit: () => {
          console.log('Successfully exited Commonality Studio');
        },
      });

      const handleExit = () => {
        kill();
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
  });
