import {
  ConformanceResult,
  TagsData,
  CodeownersData,
  Package,
} from '@commonalityco/types';
import path from 'node:path';

export const runFixes = async ({
  conformanceResults,
  packages,
  rootDirectory,
  tagsData,
  codeownersData,
}: {
  conformanceResults: ConformanceResult[];
  packages: Package[];
  rootDirectory: string;
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
}): Promise<void> => {
  const groupedResults: Record<string, ConformanceResult[]> = {};
  const tagsMap = new Map(
    tagsData.map((data) => [data.packageName, data.tags]),
  );
  const codeownersMap = new Map(
    codeownersData.map((data) => [data.packageName, data.codeowners]),
  );

  for (const result of conformanceResults) {
    if (result.fix && !result.isValid) {
      if (!groupedResults[result.name]) {
        groupedResults[result.name] = [];
      }
      groupedResults[result.name].push(result);
    }
  }

  for (const [name, groupResults] of Object.entries(groupedResults)) {
    await Promise.all(
      groupResults.map(async (result) => {
        if (!result.package.name) {
          return;
        }

        if (result.fix) {
          await result.fix({
            workspace: Object.freeze({
              path: path.join(rootDirectory, result.package.path),
              relativePath: result.package.path,
            }),
            allWorkspaces: packages.map((pkg) => ({
              path: path.join(rootDirectory, pkg.path),
              relativePath: pkg.path,
            })),
            rootWorkspace: {
              path: rootDirectory,
              relativePath: '.',
            },
            tags: tagsMap.get(result.package.name) ?? [],
            codeowners: codeownersMap.get(result.package.name) ?? [],
          });
        }
      }),
    );
  }
};
