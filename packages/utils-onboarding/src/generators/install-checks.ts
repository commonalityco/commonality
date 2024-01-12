import { installPackage } from '@antfu/install-pkg';

export const installChecks = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<void> => {
  await installPackage('commonality-checks-recommended@latest', {
    cwd: rootDirectory,
    silent: true,
  });
};
