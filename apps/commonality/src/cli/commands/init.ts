#!/usr/bin/env node
import { Command } from 'commander';
import ora from 'ora';
import {
  getInstallChecks,
  getInstallCommonality,
  getUseTypeScript,
  getCreateConfig,
} from '@commonalityco/utils-onboarding';
import { getRootDirectory } from '@commonalityco/data-project';
import console from 'node:console';

const command = new Command();

const PROJECT_CONFIG_TS = `commonality.config.ts` as const;
const PROJECT_CONFIG_JS = `commonality.config.js` as const;

export const action = async ({ rootDirectory }: { rootDirectory: string }) => {
  // Prompts
  const installCommonality = await getInstallCommonality({ rootDirectory });
  const createConfig = await getCreateConfig({ rootDirectory });
  const typeScript = createConfig ? await getUseTypeScript() : false;
  const installChecks = await getInstallChecks({ rootDirectory });

  // Confirmation

  if (!installCommonality && !installChecks && !createConfig) {
    console.log(
      `You're already set up with Commonality\n\nHere's how to get started:`,
    );
    return;
  }

  const configFileName = typeScript ? PROJECT_CONFIG_TS : PROJECT_CONFIG_JS;

  console.log(`\nHere are the changes we'll make to your project:`);

  if (installCommonality) {
    console.log(`- Install commonality`);
  }

  if (createConfig) {
    console.log(`- Create a ${configFileName} file`);
  }

  if (installChecks) {
    console.log(`- Install and set up commonality-checks-recommended`);
  }

  // Generation

  if (installChecks) {
    const checksSpinner = ora();

    checksSpinner.start('Installing commonality-checks-recommended');

    checksSpinner.stop();
  }

  const configSpinner = ora();

  configSpinner.start(`Creating ${configFileName}`);

  configSpinner.stop();
};

export const init = command
  .name('init')
  .description('Setup Commonality in your project')
  .action(async () => {
    const rootDirectory = await getRootDirectory();

    action({ rootDirectory });
  });
