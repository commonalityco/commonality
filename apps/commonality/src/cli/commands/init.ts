#!/usr/bin/env node
import { Command } from 'commander';
import ora from 'ora';
import {
  installCommonality,
  getInstallChecks,
  getInstallCommonality,
  getUseTypeScript,
  getCreateConfig,
  installChecks,
  createConfig,
} from '@commonalityco/utils-onboarding';
import { getRootDirectory } from '@commonalityco/data-project';
import console from 'node:console';
import prompts from 'prompts';
import c from 'chalk';

const command = new Command();

const PROJECT_CONFIG_TS = `commonality.config.ts` as const;
const PROJECT_CONFIG_JS = `commonality.config.js` as const;

export const action = async ({ rootDirectory }: { rootDirectory: string }) => {
  // Prompts
  console.log(c.bold('\n  Welcome to Commonality!\n'));

  const shouldInstallCommonality = await getInstallCommonality({
    rootDirectory,
  });
  const shouldCreateConfig = await getCreateConfig({ rootDirectory });
  const typeScript = shouldCreateConfig ? await getUseTypeScript() : false;
  const shouldInstallChecks = await getInstallChecks({ rootDirectory });

  // Confirmation
  if (
    !shouldInstallCommonality &&
    !shouldInstallChecks &&
    !shouldCreateConfig
  ) {
    console.log(`You're already set up with Commonality`);
    console.log(`\n\nHere's how to get started:`);
    return;
  }

  const configFileName = typeScript ? PROJECT_CONFIG_TS : PROJECT_CONFIG_JS;

  console.log(`\n  Here are the changes we'll make to your project:\n`);

  if (shouldInstallCommonality) {
    console.log(`  • Install commonality`);
  }

  if (shouldCreateConfig) {
    console.log(`  • Create a ${configFileName} file`);
  }

  if (shouldInstallChecks) {
    console.log(`  • Install and set up commonality-checks-recommended`);
  }

  console.log();

  const response = await prompts([
    {
      type: 'confirm',
      name: 'setup',
      message: `Would you like to proceed?`,
      initial: true,
    },
  ]);

  if (!response.setup) {
    console.log('Sounds good, you can always run this again later.');
    return;
  }

  // Generation

  if (shouldInstallCommonality) {
    const commonalitySpinner = ora();

    commonalitySpinner.start('Installing commonality');

    await installCommonality({ rootDirectory });

    commonalitySpinner.succeed('Installed commonality');
  }

  if (shouldInstallChecks) {
    const checksSpinner = ora();

    checksSpinner.start('Installing commonality-checks-recommended');

    await installChecks({ rootDirectory });

    checksSpinner.succeed('Installed commonality-checks-recommended');
  }

  if (shouldCreateConfig) {
    const configSpinner = ora();

    configSpinner.start(`Creating ${configFileName}`);

    await createConfig({ rootDirectory, enableTypeScript: typeScript });

    configSpinner.start(`Created ${configFileName}`);

    configSpinner.stop();
  }

  console.log(`You're all set up!`);
};

export const init = command
  .name('init')
  .description('Setup Commonality in your project')
  .action(async () => {
    const rootDirectory = await getRootDirectory();

    action({ rootDirectory });
  });
