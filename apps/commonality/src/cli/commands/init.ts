#!/usr/bin/env node
import { Command } from 'commander';
import ora from 'ora';
import {
  installCommonality,
  getInstallChecks,
  getInstallCommonality,
  installChecks,
  createConfig,
} from '@commonalityco/utils-onboarding';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import console from 'node:console';
import c from 'chalk';

const command = new Command();

const logNextSteps = ({
  shouldInstallChecks,
}: {
  shouldInstallChecks: boolean;
}) => {
  console.log();

  console.log(`  ${c.bold(`You're all set up! Here's what to try next:`)}`);

  if (shouldInstallChecks) {
    console.log(
      `\n${c.blue(
        '  npm exec -- commonality check',
      )}\n  Try running the checks we've set up for you`,
    );
  }

  console.log(`\n  Check out our getting started guide for more info:`);
  console.log(
    `  ${c.underline('https://www.commonality.co/docs/getting-started')}\n`,
  );
};

export const action = async ({
  rootDirectory,
  verbose,
}: {
  rootDirectory: string;
  verbose?: boolean;
}) => {
  console.log(
    `\n  ${c.bold.blue(
      'Welcome to Commonality!',
    )} \n\n  Let’s get you set up.\n`,
  );

  // Prompts
  const shouldInstallCommonality = await getInstallCommonality({
    rootDirectory,
  });
  const projectConfig = await getProjectConfig({ rootDirectory });

  const shouldInstallChecks = await getInstallChecks({ rootDirectory });

  // Confirmation
  if (!shouldInstallCommonality && !shouldInstallChecks && !projectConfig) {
    console.log(c.green(`\n  Your project is already set up with Commonality`));
    logNextSteps({ shouldInstallChecks: true });
    return;
  }

  const configFileName = `config.json`;
  // Generation
  try {
    console.log();

    if (shouldInstallCommonality) {
      const commonalitySpinner = ora();

      commonalitySpinner.start(
        'Installing commonality, this might take a couple of minutes.',
      );

      await installCommonality({ rootDirectory, verbose });

      commonalitySpinner.succeed('Installed commonality');
    }

    if (shouldInstallChecks) {
      const checksSpinner = ora();

      checksSpinner.start(
        'Installing commonality-checks-recommended, this might take a couple of minutes.',
      );

      await installChecks({ rootDirectory });

      checksSpinner.succeed('Installed commonality-checks-recommended');
    }

    if (!projectConfig) {
      const configSpinner = ora();

      configSpinner.start(`Creating ${configFileName}`);

      await createConfig({
        rootDirectory,
        includeChecks: shouldInstallChecks,
      });

      configSpinner.succeed(`Created ${configFileName}`);
    }

    logNextSteps({ shouldInstallChecks });
  } catch (error) {
    if (verbose) {
      console.error(error);
      console.log(c.red(`  Something went wrong, please try again.`));
    }
  }
};

const safeGetRootDirectory = async () => {
  try {
    return await getRootDirectory();
  } catch {
    console.log(
      `${c.bold(
        '\nUnable to find a lockfile',
      )}\n\nThis command must be run within a project managed by a JavaScript package manager`,
    );
    process.exit(1);
  }
};

export const init = command
  .name('init')
  .description('Setup Commonality in your project')
  .option('--verbose', 'Show additional logging output')
  .action(async (options: { verbose?: boolean }) => {
    const rootDirectory = await safeGetRootDirectory();

    action({
      rootDirectory,
      verbose: options.verbose,
    });
  });
