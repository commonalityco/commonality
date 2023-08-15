import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import { getDependencies, getPackages } from '@commonalityco/data-packages';
import { getTagsData } from '@commonalityco/data-tags';
import { Command } from 'commander';
import { getViolations } from '@commonalityco/data-violations';
import chalk from 'chalk';
import path from 'node:path';
import { formatTagName } from '@commonalityco/utils-core';
import cliuiUntyped from 'cliui';
import { ProjectConfig, Violation } from '@commonalityco/types';

const cliui = cliuiUntyped as unknown as typeof cliuiUntyped.default;
const ui = cliui({ width: process.stdout.columns });

const getText = (application?: string[] | '*'): string => {
  if (application === '*') {
    return 'All packages';
  } else if (application?.length === 0) {
    return 'No tags found';
  } else {
    return JSON.stringify(application);
  }
};

export const validateAction = async ({
  rootDirectory,
  projectConfig,
  violations,
  command,
}: {
  rootDirectory: string;
  projectConfig: ProjectConfig;
  violations: Violation[];
  command: Command;
}) => {
  const constraints = projectConfig.constraints;

  if (!constraints) {
    ui.div({
      text: 'No constraints found',
      padding: [1, 0, 1, 0],
    });
    console.log(ui.toString());
    return;
  }

  console.log(
    `Validating constraints...\n` +
      chalk.dim(path.join(rootDirectory, '.commonality/config.json')),
  );

  const constraintsWithViolationCount = constraints.filter((constraint) =>
    violations.some((violation) => violation.appliedTo === constraint.applyTo),
  ).length;

  for (const constraint of constraints) {
    const violationsForConstraint = violations.filter(
      (violation) => violation.appliedTo === constraint.applyTo,
    );

    const hasViolations = violationsForConstraint.length > 0;

    if (hasViolations) {
      const tagText = chalk.inverse(
        chalk.red.bold(
          ` ${
            constraint.applyTo === '*'
              ? getText(constraint.applyTo)
              : formatTagName(constraint.applyTo)
          } `,
        ),
      );

      const violationsText = chalk.red(
        `${violationsForConstraint.length} violations`,
      );
      console.log(`\n${tagText} ${violationsText}`);

      for (const violation of violationsForConstraint) {
        const sourcePackageLink = violation.sourcePackageName;

        const targetPackageLink = violation.targetPackageName;

        ui.div(`${sourcePackageLink} ${chalk.red('→')} ${targetPackageLink}`);

        const allowedText =
          violation.allowed.length > 0
            ? `${chalk.dim('Allowed')} \t${getText(violation.allowed)}\n`
            : '';
        const disallowedText =
          violation.disallowed.length > 0
            ? `${chalk.dim('Disallowed')} \t${getText(violation.disallowed)}\n`
            : '';
        const foundText = violation.found
          ? `${chalk.red('Found')} \t${getText(violation.found)}\n`
          : '';

        ui.div(allowedText + disallowedText + foundText);
        console.log(ui.toString());
        ui.resetOutput();
      }
    } else {
      const tagText = chalk.green.inverse.bold(
        ` ${
          constraint.applyTo === '*'
            ? 'All packages'
            : formatTagName(constraint.applyTo)
        } `,
      );

      console.log(`\n${tagText} ${chalk.dim('No violations')}`);
    }
  }
  ui.resetOutput();
  const constraintPrefix = chalk.dim('Constraints');
  const constraintPrimaryText = constraintsWithViolationCount
    ? `${chalk.red.bold(`${constraintsWithViolationCount} failed`)}`
    : `${chalk.green.bold(`${constraints.length} passed`)}`;

  const constraintSuffix = chalk.gray(`(${constraints.length})`);

  const violationsText =
    violations.length > 0
      ? chalk.red.bold(`${violations.length} violations`)
      : chalk.green.bold(`No violations`);

  ui.div(
    `\n${constraintPrefix}\t ${constraintPrimaryText} ${constraintSuffix}` +
      `\n${chalk.dim('Violations')}\t ${violationsText}`,
  );

  if (violations.length > 0) {
    command.error(ui.toString(), { exitCode: 1 });
  }

  console.log(ui.toString());
};

const command = new Command();

export const validate = command
  .name('validate')
  .description('Validate that local dependencies adhere to your constraints')
  .action(async () => {
    const rootDirectory = await getRootDirectory();
    const packages = await getPackages({ rootDirectory });
    const dependencies = await getDependencies({ rootDirectory });
    const tagsData = await getTagsData({ rootDirectory, packages });
    const projectConfig = await getProjectConfig({ rootDirectory });
    const violations = await getViolations({
      dependencies,
      constraints: projectConfig.constraints,
      tagsData,
    });

    await validateAction({
      rootDirectory,
      projectConfig,
      violations,
      command,
    });
  });
