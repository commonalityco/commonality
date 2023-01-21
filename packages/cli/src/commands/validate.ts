import path from 'node:path';
import { getConstraintViolations } from '@commonalityco/constraints';
import { Command } from 'commander';
import groupBy from 'lodash.groupby';
import fs from 'fs-extra';
import type { ProjectConfig } from '@commonalityco/types';
import { getRootDirectory } from '../core/get-root-directory.js';
import { getWorkspaces } from '../core/get-workspaces.js';
import { getPackageManager } from '../core/get-package-manager.js';
import { getPackageDirectories } from '../core/get-package-directories.js';
import { getPackages } from '../core/get-packages.js';
import { getProjectConfig } from '../core/get-project-config.js';

const program = new Command();

const logNoDefinedConstraints = async () => {
  const { default: chalk } = await import('chalk');

  console.log(chalk.yellow('No constraints found'));

  console.log(
    'Define dependency constraints in your configuration file to control how packages are shared.'
  );
};

const logDependencyConstraintCount = async (
  config: ProjectConfig,
  path: string
) => {
  const { default: chalk } = await import('chalk');
  const { default: terminalLink } = await import('terminal-link');

  const constraintTags = config.constraints ?? [];

  const text =
    constraintTags.length > 1
      ? `${constraintTags.length} dependency constraints found`
      : `${constraintTags.length} dependency constraint found`;

  const link = terminalLink(text, path);

  console.log(chalk.blue(link));
};

const logDependencyName = async (packageName: string, path: string) => {
  const { default: chalk } = await import('chalk');
  const { default: terminalLink } = await import('terminal-link');

  const link = terminalLink(packageName, path);

  console.log(chalk(link));
};

export const validate = program
  .name('validate')
  .description(
    "Validate your project's package constraints and deprecation notices"
  )
  .option(
    '--cwd <path>',
    "A relative path to the root of your monorepo. We will attempt to automatically detect this by looking for your package manager's lockfile."
  )
  .action(
    async ({ cwd }: { project: string; cwd?: string }, action: Command) => {
      const { default: chalk } = await import('chalk');
      const { default: terminalLink } = await import('terminal-link');

      const rootDirectory = await getRootDirectory(cwd);
      const packageManager = await getPackageManager(rootDirectory);
      const workspaces = await getWorkspaces(rootDirectory, packageManager);
      const packageDirectories = await getPackageDirectories(
        rootDirectory,
        workspaces
      );
      const packages = await getPackages({ packageDirectories, rootDirectory });
      const projectConfig = await getProjectConfig(rootDirectory);

      if (!projectConfig) {
        action.error('No project configuration found');
      }

      const violations = getConstraintViolations({
        packages,
        config: projectConfig,
      });
      const violationsByPackageName = groupBy(violations, 'sourceName');
      const packageNames = Object.keys(violationsByPackageName);

      console.log();

      if (Object.keys(projectConfig.constraints ?? {}).length === 0) {
        logNoDefinedConstraints();
        return;
      }

      logDependencyConstraintCount(
        projectConfig,
        path.join(rootDirectory, '.commonality/config.json')
      );

      console.log();

      if (violations.length === 0) {
        console.log(chalk.green('No violations found'));
        return;
      }

      for (const packageName of packageNames) {
        const violations = violationsByPackageName[packageName];
        const package_ = packages.find(
          (package__) => package__.name === packageName
        );

        if (!violations || !package_) {
          continue;
        }

        logDependencyName(
          packageName,
          path.join(rootDirectory, package_.path, 'commonality.json')
        );

        for (let index = 0; index < violations.length; index++) {
          const violation = violations[index];

          if (!violation) {
            continue;
          }

          const isLastViolation =
            index === violations.length - 1 &&
            violations.indexOf(violation) === violations.length - 1;

          const topSpacer = isLastViolation ? '└──' : '├──';
          const middleSpacer = isLastViolation ? '   ' : '│  ';

          console.log('│  ');

          const dependencyPackage = packages.find(
            (package__) => package__.name === violation.targetName
          );

          if (!dependencyPackage) {
            continue;
          }

          const dependencyConfigurationPath = path.join(
            rootDirectory,
            dependencyPackage.path,
            'commonality.json'
          );
          const dependencyManifestPath = path.join(
            rootDirectory,
            dependencyPackage.path,
            'package.json'
          );

          const hasPackageConfigurationFile = fs.pathExistsSync(
            dependencyConfigurationPath
          );

          const dependencyNameLinkPath = hasPackageConfigurationFile
            ? dependencyConfigurationPath
            : dependencyManifestPath;

          console.log(
            topSpacer,
            terminalLink(dependencyPackage.name, dependencyNameLinkPath)
          );

          if (hasPackageConfigurationFile) {
            console.log(middleSpacer, chalk.red('Found tags:'));

            console.log(
              middleSpacer,
              chalk.red(JSON.stringify(violation.targetTags))
            );

            console.log(middleSpacer, chalk.green('Expected tags:'));
            console.log(
              middleSpacer,
              chalk.green(JSON.stringify(violation.allowedTags))
            );
          } else {
            console.log(
              middleSpacer,
              chalk.red('Missing package configuration')
            );

            action.error(chalk.bold.red('Missing package configuration'));
          }
        }

        console.log();
      }

      const violationMessage =
        violations.length > 1 ? 'violations found' : 'violation found';

      action.error(chalk.bold.red(`${violations.length} ${violationMessage}`));
    }
  );
