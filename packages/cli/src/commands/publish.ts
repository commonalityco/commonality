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

const program = new Command();

export const publish = program
  .name('publish')
  .description('Create and upload a snapshot of your monorepo')
  .action(async () => {
    await ensureAuth();

    const rootDirectory = await getRootDirectory();

    if (!rootDirectory) {
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
      const result = await fetch('http://localhost:3000/api/cli/publish', {
        method: 'POST',
        body: JSON.stringify(snapshot),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${config.get('accessToken')}`,
        },
      });

      if (!result.ok) {
        spinner.stopAndPersist({
          symbol: chalk.red('✖'),
          text: chalk.red('Failed to publish snapshot'),
        });
      } else {
        spinner.stopAndPersist({
          symbol: chalk.green('✔'),
          text: chalk.green('Successfully published snapshot'),
        });

        const resultData = (await result.json()) as { url: string };
        console.log(`View your graph at ${chalk.bold.blue(resultData.url)}`);
      }
    } catch (error) {
      console.log(error);
    }
  });
