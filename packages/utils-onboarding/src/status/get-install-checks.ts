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
        type: 'text',
        name: 'installChecks',
        message: `Would you like to install our recommended checks that help scale most monorepos?`,
      },
    ]);

    return installChecks;
  }

  return false;
};
