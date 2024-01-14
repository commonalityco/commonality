import { detectPackageManager } from '@antfu/install-pkg';

export const getAdditionalInstallArgs = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<string[]> => {
  const packageManager = await detectPackageManager(rootDirectory);

  if (packageManager === 'pnpm') {
    return ['--workspace-root'];
  }

  if (packageManager === 'yarn') {
    return ['--ignore-workspace-root-check'];
  }

  return [];
};
