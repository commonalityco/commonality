import fs from 'fs-extra';
import path from 'pathe';

const configWithChecks = {
  checks: {
    '*': [
      'recommended/has-readme',
      'recommended/has-codeowner',
      'recommended/valid-package-name',
      'recommended/unique-dependency-types',
      'recommended/sorted-dependencies',
      'recommended/matching-dev-peer-versions',
      'recommended/consistent-external-version',
      'recommended/extends-repository-field',
    ],
  },
  constraints: {},
};

const configWithoutChecks = {
  checks: {},
  constraints: {},
};

export const createConfig = async ({
  rootDirectory,
  includeChecks,
}: {
  rootDirectory: string;
  includeChecks: boolean;
}) => {
  const configFileName = './.commonality/config.json';

  await fs.outputJSON(
    path.resolve(rootDirectory, configFileName),
    includeChecks ? configWithChecks : configWithoutChecks,
  );
};
