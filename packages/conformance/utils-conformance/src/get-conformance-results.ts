import { TagsData, CodeownersData, Package } from '@commonalityco/types';
import {
  Status,
  ProjectConfig,
  Check,
  Message,
} from '@commonalityco/utils-core';
import path from 'pathe';
import { ZodError } from 'zod';

export type ConformanceResult = {
  name: string;
  filter: string;
  fix?: Check['fix'];
  status: Status;
  package: Package;
  message: Message;
};

export const getConformanceResults = async ({
  conformersByPattern,
  packages,
  tagsData,
  rootDirectory,
  codeownersData,
}: {
  conformersByPattern: ProjectConfig['checks'];
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
            const getStatus = async (): Promise<Status> => {
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

                if (result) {
                  return Status.Pass;
                } else {
                  return conformer.level === 'error'
                    ? Status.Fail
                    : Status.Warn;
                }
              } catch {
                return Status.Fail;
              }
            };

            const getMessage = async () => {
              if (typeof conformer.message === 'string') {
                return { title: conformer.message };
              }

              try {
                const message = await conformer.message({
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

                return {
                  ...message,
                  filePath: message.filePath ?? pkg.path,
                } satisfies Message;
              } catch (error) {
                if (error instanceof ZodError) {
                  return {
                    title: 'Invalid check configuration',
                    filePath: pkg.path,
                    suggestion: error.stack,
                  } satisfies Message;
                }
                if (error instanceof Error) {
                  return {
                    title: error.message,
                    filePath: pkg.path,
                    suggestion: error.stack,
                  } satisfies Message;
                }

                return {
                  title:
                    'An unknown error occured while running this conformer',
                };
              }
            };

            const status = await getStatus();

            const message = await getMessage();

            return {
              status,
              name: conformer.name,
              filter: matchingPattern,
              package: pkg,
              message,
              fix: conformer.fix,
            };
          }),
      ),
    ),
  );
};
