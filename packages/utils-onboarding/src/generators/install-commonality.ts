import { installPackage } from '@antfu/install-pkg';

export const installCommonality = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<void> => {
  await installPackage('commonality@latest', {
    cwd: rootDirectory,
    silent: true,
  });
};
