import fs from 'fs-extra';
import path from 'path';
import lastCommit from 'git-last-commit';
import { getPackages } from './getPackages';
import { LocalPackage, LocalViolation } from '@commonalityco/types';
import { getConstraintViolations } from './getConstraintViolations';

const getLastCommit = (): Promise<lastCommit.Commit> =>
  new Promise((resolve, reject) => {
    return lastCommit.getLastCommit((err, commit) => {
      if (err) {
        reject(err);
      } else {
        resolve(commit);
      }
    });
  });

export const getSnapshot = async (
  rootDirectory: string,
  packageDirectories: string[]
): Promise<{
  projectId: string;
  branch: string;
  packages: LocalPackage[];
  violations: LocalViolation[];
}> => {
  const configFilePath = path.join(
    rootDirectory,
    '.commonality',
    'config.json'
  );

  const configFile = fs.readJSONSync(configFilePath);

  const packages = await getPackages({ packageDirectories, rootDirectory });

  const violations = getConstraintViolations(packages, configFile);

  const lastCommit = await getLastCommit();

  return {
    branch: lastCommit.branch,
    projectId: configFile.project,
    packages,
    violations,
  };
};
