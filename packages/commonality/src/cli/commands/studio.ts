#!/usr/bin/env node
import { Command } from 'commander';
import getPort from 'get-port';
import { validateProjectStructure } from '../utils/validate-project-structure.js';
import { getRootDirectory } from '@commonalityco/data-project';
import chalk from 'chalk';
import waitOn from 'wait-on';
import killPort from 'kill-port';
import url from 'node:url';
import { createRequire } from 'node:module';
import c from 'picocolors';
import { isPackageExists } from 'local-pkg';
import { isCI } from 'std-env';
const EXIT_CODE_RESTART = 43;

const command = new Command();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function ensurePackageInstalled(dependency: string, root: string) {
  if (process.versions.pnp) {
    const targetRequire = createRequire(__dirname);
    try {
      targetRequire.resolve(dependency, { paths: [root, __dirname] });
      return true;
    } catch {
      return false;
    }
  }

  if (isPackageExists(dependency, { paths: [root, __dirname] })) return true;

  const promptInstall = !isCI && process.stdout.isTTY;

  process.stderr.write(
    c.red(
      `${c.inverse(
        c.red(' MISSING DEPENDENCY '),
      )} Cannot find dependency '${dependency}'\n\n`,
    ),
  );

  if (!promptInstall) return false;

  const prompts = await import('prompts');

  const { install } = await prompts.default.prompt({
    type: 'confirm',
    name: 'install',
    message: c.reset(`Do you want to install ${c.green(dependency)}?`),
  });

  if (install) {
    const installPkg = await import('@antfu/install-pkg');
    await installPkg.installPackage(dependency, { dev: true });
    process.stderr.write(
      c.yellow(
        `\nPackage ${dependency} installed, re-run the command to start.\n`,
      ),
    );
    process.exit(EXIT_CODE_RESTART);
  }

  return false;
}

const DEPENDENCY_NAME = '@commonalityco/studio';

export const studio = command
  .name('studio')
  .description('Open Commonality Studio')
  .option('--debug')
  .action(async (options: { debug?: boolean }) => {
    const debug = Boolean(options.debug);

    process.on('SIGINT', async function () {
      try {
        await killPort(8888);
      } finally {
        process.exit();
      }
    });

    try {
      await validateProjectStructure({
        directory: process.cwd(),
        command,
      });

      const rootDirectory = await getRootDirectory();

      await ensurePackageInstalled(DEPENDENCY_NAME, rootDirectory);
      console.log('prevent');
      const studio = await import(DEPENDENCY_NAME);

      const port = await getPort({ port: 8888 });

      const url = `http://127.0.0.1:${port}`;

      console.log(`📦 Starting Commonality Studio...\n`);

      studio.startStudio({ port, rootDirectory, debug });

      await waitOn({ resources: [url] });

      console.log(
        `Viewable at: ${chalk.blue.bold(url)} ${chalk.dim(
          '(press ctrl-c to quit)',
        )}`,
      );
    } catch (error) {
      if (debug) {
        console.log(error);
      }

      console.log(chalk.red('Failed to start Commonality Studio'));
    }
  });
