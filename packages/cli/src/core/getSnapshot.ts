import fs from 'fs-extra';
import path from 'path';
import { getPackages } from './getPackages';
import { LocalPackage, LocalViolation } from '@commonalityco/types';
import { getConstraintViolations } from './getConstraintViolations';
import { getTags } from './getTags';
import { execa } from 'execa';

const getCurrentBranch = async () => {
  const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  console.log({ stdout });
  return stdout?.toString()?.replace(/[\n\r\s]+$/, '') || '';
};

export const getSnapshot = async (
  rootDirectory: string,
  packageDirectories: string[]
): Promise<{
  projectId: string;
  branch: string;
  packages: LocalPackage[];
  violations: LocalViolation[];
  tags: string[];
}> => {
  const configFilePath = path.join(
    rootDirectory,
    '.commonality',
    'config.json'
  );

  const configFile = fs.readJSONSync(configFilePath);

  const packages = await getPackages({ packageDirectories, rootDirectory });

  const violations = getConstraintViolations(packages, configFile);

  const currentBranch = await getCurrentBranch();

  const tags = await getTags({ packageDirectories, rootDirectory });

  return {
    branch: currentBranch,
    projectId: configFile.project,
    packages,
    violations,
    tags,
  };
};
