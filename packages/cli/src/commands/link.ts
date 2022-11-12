import { getRootDirectory } from './../core/getRootDirectory';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

export const link = program
  .name('link')
  .description('Connect this repository to a project in Commonality')
  .requiredOption('--project <projectId>', 'The ID of the project to link to')
  .action(async ({ project }) => {
    const rootDirectory = await getRootDirectory();
    const pathToFile = path.join(rootDirectory, '.commonality', 'config.json');
    const isConfigFilePresent = await fs.pathExists(pathToFile);

    const additionalOptions = isConfigFilePresent
      ? await fs.readJSON(pathToFile)
      : {};

    fs.outputJSON(pathToFile, { ...additionalOptions, project }, { spaces: 2 });

    console.log(chalk.green('✔ Successfully linked project'));
  });
