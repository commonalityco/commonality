import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import { getPackages } from '@commonalityco/snapshot';
import { Command } from 'commander';
import { getViolations } from '@commonalityco/data-violations';
import chalk from 'chalk';
import { Violation } from '@commonalityco/types';
import terminalLink from 'terminal-link';
import path from 'node:path';

const program = new Command();

export const validate = program
  .name('validate')
  .description('Validate that packges adhere to your tag constraints')
  .action(async () => {
    const rootDirectory = await getRootDirectory();
    const packages = await getPackages({ rootDirectory });
    const projectConfig = await getProjectConfig({ rootDirectory });

    const violationsByPackageName: Record<string, Violation[]> = {};

    const violations = getViolations({ packages, projectConfig });

    for (let i = 0; i < violations.length; i++) {
      const violation = violations[i];

      const currentViolations = violationsByPackageName[violation.sourceName];

      violationsByPackageName[violation.sourceName] = currentViolations
        ? [...currentViolations, violation]
        : [violation];
    }

    Object.keys(violationsByPackageName).forEach((packageName) => {
      const pkg = packages.find((pkg) => pkg.name === packageName);

      const pkgNameText = `📦 ${chalk.blue.bold.underline(packageName)}`;

      const projectConfigPath = pkg
        ? path.join(path.resolve(rootDirectory, pkg.path), './commonality.json')
        : undefined;

      console.log(
        projectConfigPath
          ? terminalLink(
              pkgNameText,
              `file://${path.resolve(projectConfigPath)}`
            )
          : pkgNameText
      );

      const violations = violationsByPackageName[packageName];

      violations.forEach((violation) => {
        console.log(
          chalk.bold(`${violation.sourceName} -> ${violation.targetName}`)
        );
        console.log(
          `Constraint matching: ${JSON.stringify(violation.matchTags) ?? []}`
        );

        console.log(
          `${chalk.green('Allowed:')} ${
            violation.allowedTags?.length
              ? JSON.stringify(violation.allowedTags)
              : 'No packages allowed'
          }`
        );
        console.log(
          `${chalk.red('Found:')} ${
            violation.foundTags?.length
              ? JSON.stringify(violation.foundTags)
              : violation.allowedTags?.length
              ? chalk.dim('None')
              : 'Package found'
          }`
        );
        console.log('');
      });
    });

    console.log(
      chalk.red.bold(
        `Found ${violations.length} violations across ${
          Object.keys(violationsByPackageName).length
        } packages`
      )
    );
  });
