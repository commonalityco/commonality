import path from 'node:path';
import fs from 'fs-extra';
import type { PackageJson } from '@commonalityco/types';
import yaml from 'yaml';
import { PackageManager } from '@commonalityco/utils-core';

const defaultWorkspaceGlobs = ['./**'];

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

    if (fs.pathExistsSync(packageJsonPath)) {
      const rootPackageJson = (await fs.readJson(
        path.join(rootDirectory, 'package.json')
      )) as PackageJson;

      if (!rootPackageJson?.workspaces) {
        return defaultWorkspaceGlobs;
      }

      return rootPackageJson.workspaces;
    }
  }

  if (packageManager === PackageManager.PNPM) {
    const workspaceFilePath = path.join(rootDirectory, 'pnpm-workspace.yaml');

    if (fs.existsSync(workspaceFilePath)) {
      const yamlFile = fs.readFileSync(workspaceFilePath, 'utf8');

      const workspacesFile = (await yaml.parse(yamlFile)) as {
        packages: string[];
      };

      if (!workspacesFile?.packages) {
        return defaultWorkspaceGlobs;
      }

      return workspacesFile.packages;
    }
  }

  return defaultWorkspaceGlobs;
};
