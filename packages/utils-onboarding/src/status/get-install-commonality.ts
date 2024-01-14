import { resolveModule } from 'local-pkg';

export const getInstallCommonality = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<boolean> => {
  const resolvedCommonality = resolveModule('commonality', {
    paths: [rootDirectory],
  });

  return !resolvedCommonality;
};
