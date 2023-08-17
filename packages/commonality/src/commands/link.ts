import { Command } from 'commander';
import { getRootDirectory } from '@commonalityco/data-project';
import path from 'node:path';
import fs from 'fs-extra';
import { validateProjectStructure } from '../utils/validate-project-structure.js';

const command = new Command();

export const linkAction = async (options: { project: string }) => {
  try {
    await validateProjectStructure({
      directory: process.cwd(),
      command,
    });

    const rootDirectory = await getRootDirectory();
    const projectConfigPath = path.join(
      rootDirectory,
      '.commonality/config.json',
    );

    const hasConfigFile = await fs.exists(projectConfigPath);

    if (hasConfigFile) {
      const existingConfig = await fs.readJson(projectConfigPath);
      await fs.writeJson(projectConfigPath, {
        ...existingConfig,
        projectId: options.project,
      });
    } else {
      await fs.outputJson(projectConfigPath, {
        projectId: options.project,
      });
    }
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
