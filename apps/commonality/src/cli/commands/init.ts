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

const nextStepsText = `\n  ${c.underline.bold(
  `Here's what to check out next:`,
)}\n\n  Codify best practices with checks\n  ${c.dim(
  'https://www.commonality.co/docs/checks',
)}\n\n  Structure your dependency graph using constraints\n  ${c.dim(
  'https://www.commonality.co/docs/constraints',
)} \n\n  Explore your codebase with Commonality Studio\n  ${c.dim(
  'npx commonality studio',
)}`;

export const action = async ({ rootDirectory }: { rootDirectory: string }) => {
  // Prompts
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
    console.log(c.green(`\n  Your project is already set up with Commonality`));
    console.log(nextStepsText);
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

    await createConfig({ rootDirectory, typeScript });

    configSpinner.succeed(`Created ${configFileName}`);
  }

  console.log(c.green(`  You're all set up!`));

  console.log(nextStepsText);
};

export const init = command
  .name('init')
  .description('Setup Commonality in your project')
  .action(async () => {
    const rootDirectory = await getRootDirectory();

    action({ rootDirectory });
  });
