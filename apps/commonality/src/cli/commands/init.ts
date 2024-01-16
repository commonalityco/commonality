#!/usr/bin/env node
import { Command } from 'commander';
import ora from 'ora';
import {
  installCommonality,
  getInstallChecks,
  getInstallCommonality,
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

export const action = async ({
  rootDirectory,
  typeScriptFlag,
  installChecksFlag,
  verbose,
}: {
  rootDirectory: string;
  typeScriptFlag?: boolean;
  installChecksFlag?: boolean;
  verbose?: boolean;
}) => {
  console.log(
    `\n  ${c.bold.blue(
      'Welcome to Commonality!',
    )} \n\n  Let’s get you set up.\n`,
  );
  const getUseTypeScript = async (): Promise<boolean> => {
    if (typeScriptFlag !== undefined) return typeScriptFlag;

    const { typescript } = await prompts([
      {
        type: 'toggle',
        name: 'typescript',
        initial: true,
        message: `Would you like to use TypeScript?`,
        active: 'yes',
        inactive: 'no',
      },
    ]);

    return typescript;
  };

  // Prompts
  const shouldInstallCommonality = await getInstallCommonality({
    rootDirectory,
  });
  const shouldCreateConfig = await getCreateConfig({ rootDirectory });

  const typeScript = shouldCreateConfig ? await getUseTypeScript() : false;
  const shouldInstallChecks =
    installChecksFlag === undefined
      ? await getInstallChecks({ rootDirectory })
      : installChecksFlag;

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
  // Generation
  try {
    if (shouldInstallCommonality) {
      const commonalitySpinner = ora();

      commonalitySpinner.start('Installing commonality');

      await installCommonality({ rootDirectory, verbose });

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

      await createConfig({
        rootDirectory,
        typeScript,
        includeChecks: shouldInstallChecks,
      });

      configSpinner.succeed(`Created ${configFileName}`);
    }

    console.log();

    console.log(c.green(`  You're all set up!`));

    console.log(nextStepsText);
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
  .option('--typescript', 'Create a TypeScript configuration file')
  .option(
    '--install-checks',
    'Install commonality-checks-recommended if not already installed',
  )
  .action(
    async (options: {
      typescript?: boolean;
      installChecks?: boolean;
      verbose?: boolean;
    }) => {
      const rootDirectory = await safeGetRootDirectory();

      action({
        rootDirectory,
        verbose: options.verbose,
        typeScriptFlag: options.typescript,
        installChecksFlag: options.installChecks,
      });
    },
  );
