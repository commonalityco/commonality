import { json } from '@commonalityco/utils-file/json';

const configWithChecks = {
  checks: {
    '*': [
      'recommended/has-readme',
      'recommended/has-codeowner',
      'recommended/has-valid-package-name',
      'recommended/has-unique-dependency-types',
      'recommended/has-sorted-dependencies',
      'recommended/has-matching-dev-peer-versions',
      'recommended/has-consistent-external-version',
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
  const configFileName = '.commonality/config.json';

  await json(rootDirectory, configFileName).set(
    includeChecks ? configWithChecks : configWithoutChecks,
  );
};
