#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import { resolveModule } from 'local-pkg';
import { getRootDirectory } from '@commonalityco/data-project';
import url from 'node:url';
import ora from 'ora';

const command = new Command();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const getShouldInstallRecommendedChecks = async (): Promise<boolean> => {
  const rootDirectory = await getRootDirectory();

  const resolvedChecks = resolveModule('commonality-checks-recommended', {
    paths: [rootDirectory, __dirname],
  });

  if (!resolvedChecks) {
    const { installChecks } = await prompts([
      {
        type: 'text',
        name: 'installChecks',
        message: `Would you like to install our recommended checks that help scale most monorepos?`,
      },
    ]);

    return installChecks;
  }

  return false;
};

export const init = command
  .name('init')
  .description('Setup Commonality in your project')
  .action(async () => {
    console.log(`Let's set up Commonality...\n`);

    const shouldInstallRecommendedChecks =
      await getShouldInstallRecommendedChecks();

    const { typescript } = await prompts([
      {
        type: 'confirm',
        name: 'typescript',
        message: `Would you like to use TypeScript?`,
      },
    ]);

    if (shouldInstallRecommendedChecks) {
      const checksSpinner = ora();

      checksSpinner.start('Installing commonality-checks-recommended');

      checksSpinner.stop();
    }

    const configFileName = `commonality.config.${typescript ? 'ts' : 'js'}`;

    const configSpinner = ora();

    configSpinner.start(`Creating ${configFileName}`);

    configSpinner.stop();
  });
