import { Command } from 'commander';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import fs from 'fs-extra';
import { validateProjectStructure } from '../utils/validate-project-structure.js';
import chalk from 'chalk';

const command = new Command();

export const linkAction = async (options: { project: string }) => {
  try {
    await validateProjectStructure({
      directory: process.cwd(),
      command,
    });

    const rootDirectory = await getRootDirectory();
    const projectConfig = await getProjectConfig({ rootDirectory });

    if (!projectConfig) return;

    const hasConfig = projectConfig && !projectConfig.isEmpty;

    await (hasConfig
      ? fs.writeJson(projectConfig.filepath, {
          ...projectConfig.config,
          projectId: options.project,
        })
      : fs.outputJson(projectConfig?.filepath, {
          projectId: options.project,
        }));

    console.log(chalk.green.bold('Successfully updated configuration file'));
    console.log(chalk.dim(projectConfig.filepath));
  } catch (error) {
    console.log(error);
    command.error('Failed to link project');
  }
};

export const link = command
  .name('link')
  .description('Update your configuration file with a given projectId')
  .requiredOption(
    '--project <projectId>',
    'The id of the project you want to link to',
  )
  .action(linkAction);
