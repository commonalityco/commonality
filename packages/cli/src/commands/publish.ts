import { getSnapshot } from './../core/getSnapshot';
import { getRootDirectory } from './../core/getRootDirectory';
import { Command } from 'commander';
import fetch from 'node-fetch';
import { getPackageManager } from '../core/getPackageManager';
import { getWorkspaces } from '../core/getWorkspaces';
import { getPackageDirectories } from '../core/getPackageDirectories';
import chalk from 'chalk';

const program = new Command();

export const publish = program
  .name('publish')
  .description('Create and upload a snapshot of your monorepo')
  .action(async () => {
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

    try {
      const result = await fetch('http://localhost:3000/api/cli/publish', {
        method: 'POST',
        body: JSON.stringify(snapshot),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!result.ok) {
        console.log(chalk.red.bold.underline('Failed to publish snapshot'));

        const json = (await result.json()) as {
          errors?: Array<{ message: string }>;
        };

        if (json.errors) {
          for (const error of json.errors) {
            console.log(error);
          }
        }
      } else {
        console.log(chalk.green('✔ Successfully published snapshot'));
      }
    } catch (error) {
      console.log(error);
    }
  });
