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
import { prompt } from 'prompts';

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

  const { install } = await prompt({
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
  .action(async (options: { debug?: boolean }) => {
    console.log(`📦 Starting Commonality Studio...\n`);

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

      const resolved = await ensurePackageInstalled(
        DEPENDENCY_NAME,
        rootDirectory,
      );

      if (!resolved) {
        return;
      }

      const studio = await import(resolved);

      const port = await getPort({ port: 8888 });

      const url = `http://127.0.0.1:${port}`;

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
