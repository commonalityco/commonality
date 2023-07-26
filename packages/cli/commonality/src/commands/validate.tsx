import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import { getPackages } from '@commonalityco/data-packages';
import { getTagsData } from '@commonalityco/data-tags';
import { Command } from 'commander';
import { getViolationsData } from '@commonalityco/data-violations';
import chalk from 'chalk';
import path from 'node:path';
import { formatTagName } from '@commonalityco/utils-core';
import cliui from 'cliui';

const ui = cliui({});

export const validateAction = async () => {
  const rootDirectory = await getRootDirectory();
  const packages = await getPackages({ rootDirectory });
  const tagData = await getTagsData({ rootDirectory, packages });
  const projectConfig = await getProjectConfig({ rootDirectory });

  const violations = await getViolationsData({
    packages,
    projectConfig,
    tagData,
  });

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
      chalk.dim(path.join(rootDirectory, '.commonality/config.json'))
  );

  const constraintsWithViolationCount = constraints.filter((constraint) =>
    violations.some((violation) => violation.appliedTo === constraint.applyTo)
  ).length;

  for (const constraint of constraints) {
    const violationsForConstraint = violations.filter(
      (violation) => violation.appliedTo === constraint.applyTo
    );

    const hasViolations = Boolean(violationsForConstraint.length);

    if (hasViolations) {
      const tagText = chalk.inverse(
        chalk.red.bold(` ${formatTagName(constraint.applyTo)} `)
      );
      const violationsText = chalk.red(
        `${violationsForConstraint.length} violations`
      );
      console.log(`\n${tagText} ${violationsText}`);

      violationsForConstraint.forEach((violation) => {
        const sourcePackageLink = violation.sourcePackageName;

        const targetPackageLink = violation.targetPackageName;

        ui.div(`${sourcePackageLink} ${chalk.red('→')} ${targetPackageLink}`);

        const getText = (application?: string[] | '*'): string => {
          if (application === '*') {
            return 'All packages';
          } else if (application?.length === 0) {
            return 'No tags found';
          } else {
            return JSON.stringify(application);
          }
        };

        const allowedText = violation.allowed.length
          ? `${chalk.dim('Allowed')} \t${getText(violation.allowed)}\n`
          : '';
        const disallowedText = violation.disallowed.length
          ? `${chalk.dim('Disallowed')} \t${getText(violation.disallowed)}\n`
          : '';
        const foundText = violation.found
          ? `${chalk.red('Found')} \t${getText(violation.found)}\n`
          : '';

        ui.div(allowedText + disallowedText + foundText);
        console.log(ui.toString());
        ui.resetOutput();
      });
    } else {
      const tagText = chalk.green.inverse.bold(
        ` ${formatTagName(constraint.applyTo)} `
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

  const violationsText = violations.length
    ? chalk.red.bold(`${violations.length} violations`)
    : chalk.green.bold(`No violations`);

  ui.div(
    `\n${constraintPrefix}\t ${constraintPrimaryText} ${constraintSuffix}` +
      `\n${chalk.dim('Violations')}\t ${violationsText}`
  );

  console.log(ui.toString());

  process.exit(1);
};

const program = new Command();

export const validate = program
  .name('validate')
  .description('Validate that local dependencies adhere to your constraints')
  .action(validateAction);
