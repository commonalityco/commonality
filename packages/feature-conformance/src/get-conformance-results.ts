import {
  Conformer,
  TagsData,
  ConformanceResult,
  CodeownersData,
  Package,
} from '@commonalityco/types';
import path from 'node:path';

export const getConformanceResults = async ({
  conformersByPattern,
  packages,
  tagsData,
  rootDirectory,
  codeownersData,
}: {
  conformersByPattern: Record<string, Conformer[]>;
  rootDirectory: string;
  packages: Package[];
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
}): Promise<ConformanceResult[]> => {
  const filters = Object.keys(conformersByPattern);
  const packagesMap = new Map(packages.map((pkg) => [pkg.name, pkg]));
  const tagsMap = new Map(
    tagsData.map((data) => [data.packageName, data.tags]),
  );
  const codeownersMap = new Map(
    codeownersData.map((data) => [data.packageName, data.codeowners]),
  );

  return await Promise.all(
    filters.flatMap((matchingPattern) =>
      conformersByPattern[matchingPattern].flatMap((conformer) =>
        tagsData
          .filter((data) => {
            if (matchingPattern === '*') return true;
            return data.tags.includes(matchingPattern);
          })
          .map((data) => packagesMap.get(data.packageName))
          .filter((pkg): pkg is Package => !!pkg)
          .map(async (pkg): Promise<ConformanceResult> => {
            const getValidationResult = async (): Promise<{
              isValid: boolean;
              error?: unknown;
            }> => {
              try {
                const result = await conformer.validate({
                  workspace: Object.freeze({
                    path: path.join(rootDirectory, pkg.path),
                    relativePath: pkg.path,
                  }),
                  allWorkspaces: packages.map((innerPkg) => ({
                    path: path.join(rootDirectory, innerPkg.path),
                    relativePath: innerPkg.path,
                  })),
                  rootWorkspace: {
                    path: rootDirectory,
                    relativePath: '.',
                  },
                  tags: tagsMap.get(pkg.name as string) ?? [],
                  codeowners: codeownersMap.get(pkg.name as string) ?? [],
                });

                return { isValid: Boolean(result) };
              } catch (error) {
                return { isValid: false, error };
              }
            };

            const getMessage = async () => {
              if (typeof conformer.message === 'string') {
                return { title: conformer.message };
              }

              try {
                return await conformer.message({
                  workspace: Object.freeze({
                    path: path.join(rootDirectory, pkg.path),
                    relativePath: pkg.path,
                  }),
                  allWorkspaces: packages.map((innerPkg) => ({
                    path: path.join(rootDirectory, innerPkg.path),
                    relativePath: innerPkg.path,
                  })),
                  rootWorkspace: {
                    path: rootDirectory,
                    relativePath: '.',
                  },
                  tags: tagsMap.get(pkg.name as string) ?? [],
                  codeowners: codeownersMap.get(pkg.name as string) ?? [],
                });
              } catch (error) {
                if (error instanceof Error) {
                  return {
                    title: error.message,
                    context: error.stack,
                  };
                }

                return {
                  title:
                    'An unknown error occured while running this conformer',
                };
              }
            };

            const validationResult = await getValidationResult();

            const message = await getMessage();

            return {
              name: conformer.name,
              pattern: matchingPattern,
              package: pkg,
              message,
              level: conformer.level ?? 'warning',
              fix: conformer.fix,
              isValid: validationResult.isValid,
            };
          }),
      ),
    ),
  );
};
