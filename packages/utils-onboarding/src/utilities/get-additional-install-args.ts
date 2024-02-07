import { detectPackageManager } from '@antfu/install-pkg';

export const getAdditionalInstallArgs = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<string[]> => {
  try {
    const packageManager = await detectPackageManager(rootDirectory);

    if (packageManager === 'pnpm') {
      return ['--workspace-root'];
    }

    if (packageManager === 'yarn') {
      return ['--ignore-workspace-root-check'];
    }

    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
