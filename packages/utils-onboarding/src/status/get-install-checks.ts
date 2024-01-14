import prompts from 'prompts';
import { resolveModule } from 'local-pkg';

export const getInstallChecks = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<boolean> => {
  const resolvedChecks = resolveModule('commonality-checks-recommended', {
    paths: [rootDirectory],
  });

  if (!resolvedChecks) {
    const { installChecks } = await prompts([
      {
        type: 'toggle',
        name: 'installChecks',
        message: `Would you like to install our recommended checks?`,
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
    ]);

    return installChecks;
  }

  return false;
};
