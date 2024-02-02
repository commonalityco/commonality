import { TagsData, CodeownersData, Package } from '@commonalityco/types';
import {
  Status,
  ProjectConfig,
  Check,
  Message,
} from '@commonalityco/utils-core';
import path from 'pathe';

export type ConformanceResult = {
  name: string;
  filter: string;
  fix?: Check['fix'];
  status: Status;
  package: Package;
  message: Message;
};

const filterPackages = ({
  packages,
  tagsData,
  matchingPattern,
}: {
  packages: Package[];
  tagsData: TagsData[];
  matchingPattern: string;
}): Package[] => {
  if (matchingPattern === '*') return packages;

  return packages.filter((pkg) => {
    const tagsDataForPackage = tagsData.find(
      (data) => data.packageName === pkg.name,
    );

    return tagsDataForPackage?.tags.includes(matchingPattern);
  });
};

const getStatus = async ({
  conformer,
  rootDirectory,
  pkg,
  tagsMap,
  codeownersMap,
  packages,
}: {
  conformer: Check;
  rootDirectory: string;
  pkg: Package;
  tagsMap: Map<string, string[]>;
  codeownersMap: Map<string, string[]>;
  packages: Package[];
}): Promise<Status> => {
  try {
    const result = await conformer.validate({
      package: Object.freeze({
        path: path.join(rootDirectory, pkg.path),
        relativePath: pkg.path,
      }),
      allPackages: packages.map((innerPkg) => ({
        path: path.join(rootDirectory, innerPkg.path),
        relativePath: innerPkg.path,
      })),
      rootPackage: {
        path: rootDirectory,
        relativePath: '.',
      },
      tags: tagsMap.get(pkg.name as string) ?? [],
      codeowners: codeownersMap.get(pkg.name as string) ?? [],
    });

    if (result) {
      return Status.Pass;
    } else {
      return conformer.level === 'error' ? Status.Fail : Status.Warn;
    }
  } catch {
    return Status.Fail;
  }
};

export const getMessage = async ({
  conformer,
  rootDirectory,
  pkg,
  tagsMap,
  codeownersMap,
  packages,
}: {
  conformer: Check;
  rootDirectory: string;
  pkg: Package;
  tagsMap: Map<string, string[]>;
  codeownersMap: Map<string, string[]>;
  packages: Package[];
}): Promise<Message & { filePath: string }> => {
  if (typeof conformer.message === 'string') {
    return { title: conformer.message, filePath: pkg.path };
  }

  try {
    const message = await conformer.message({
      package: Object.freeze({
        path: path.join(rootDirectory, pkg.path),
        relativePath: pkg.path,
      }),
      allPackages: packages.map((innerPkg) => ({
        path: path.join(rootDirectory, innerPkg.path),
        relativePath: innerPkg.path,
      })),
      rootPackage: {
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
    if (error instanceof Error) {
      return {
        title: error.message,
        filePath: pkg.path,
        suggestion: error.stack,
      } satisfies Message;
    }

    return {
      title: 'An unknown error occurred while running this conformer',
      filePath: pkg.path,
    };
  }
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
  const tagsMap = new Map(
    tagsData.map((data) => [data.packageName, data.tags]),
  );
  const codeownersMap = new Map(
    codeownersData.map((data) => [data.packageName, data.codeowners]),
  );

  return await Promise.all(
    filters.flatMap((matchingPattern) =>
      conformersByPattern[matchingPattern].flatMap((conformer) =>
        filterPackages({ packages, tagsData, matchingPattern })
          .filter((pkg): pkg is Package => !!pkg)
          .map(async (pkg): Promise<ConformanceResult> => {
            const status = await getStatus({
              conformer,
              rootDirectory,
              pkg,
              tagsMap,
              codeownersMap,
              packages,
            });

            const message = await getMessage({
              conformer,
              rootDirectory,
              pkg,
              tagsMap,
              codeownersMap,
              packages,
            });

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
