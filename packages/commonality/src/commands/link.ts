import { Command } from 'commander';
import { getRootDirectory } from '@commonalityco/data-project';
import path from 'node:path';
import fs from 'fs-extra';

const command = new Command();

export const linkAction = async (options: { project: string }) => {
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
};

export const link = command
  .name('link')
  .description('Update your configuration file with a given projectId')
  .requiredOption(
    '--project <projectId>',
    'The id of the project you want to link to',
  )
  .action(linkAction);
