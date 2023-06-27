import path from 'node:path';
import fs from 'fs-extra';
import type { PackageJson } from '@commonalityco/types';
import yaml from 'yaml';
import { PackageManager } from '@commonalityco/utils-core';

export const getWorkspaceGlobs = async ({
  rootDirectory,
  packageManager,
}: {
  rootDirectory: string;
  packageManager: PackageManager;
}): Promise<string[]> => {
  if (
    packageManager === PackageManager.NPM ||
    packageManager === PackageManager.YARN
  ) {
    const packageJsonPath = path.join(rootDirectory, 'package.json');

    if (!fs.pathExistsSync(packageJsonPath)) {
      throw new Error(
        'Unable to determine workspaces, no package.json file found'
      );
    }

    const rootPackageJson = (await fs.readJson(
      path.join(rootDirectory, 'package.json')
    )) as PackageJson;

    if (!rootPackageJson?.workspaces) {
      throw new Error(
        'You must include the "packages" property in your root package.json file'
      );
    }

    return rootPackageJson.workspaces;
  }

  if (packageManager === PackageManager.PNPM) {
    const workspaceFilePath = path.join(rootDirectory, 'pnpm-workspace.yaml');

    if (!fs.existsSync(workspaceFilePath)) {
      throw new Error(
        'Unable to determine workspaces, no pnpm-workspace.yaml file found'
      );
    }

    const yamlFile = fs.readFileSync(workspaceFilePath, 'utf8');

    const workspacesFile = (await yaml.parse(yamlFile)) as {
      packages: string[];
    };

    if (!workspacesFile?.packages) {
      throw new Error(
        'You must include the "packages" property in your pnpm-workspace.yaml file'
      );
    }

    return workspacesFile.packages;
  }

  throw new Error('Invalid package manager');
};
