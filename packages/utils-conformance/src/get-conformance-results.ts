import { TagsData, CodeownersData, Package } from '@commonalityco/types';
import {
  Status,
  Check,
  Message,
  messageSchema,
  CheckOutput,
} from '@commonalityco/utils-core';
import path from 'pathe';
import { merge } from 'lodash-es';
import { nanoid } from 'nanoid';

export type ConformanceResult = {
  id: string;
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

const getResult = async ({
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
}): Promise<{ status: Status; message?: Message }> => {
  const errorStatus = conformer.level === 'error' ? Status.Fail : Status.Warn;

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

    if (result === true) {
      return { status: Status.Pass };
    } else {
      const message = messageSchema.parse(result);

      return {
        status: errorStatus,
        message,
      };
    }
  } catch {
    return { status: errorStatus };
  }
};

export const getConformanceResults = async ({
  conformersByPattern,
  packages,
  tagsData,
  rootDirectory,
  codeownersData,
}: {
  conformersByPattern: Record<string, CheckOutput[]>;
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
            const result = await getResult({
              conformer,
              rootDirectory,
              pkg,
              tagsMap,
              codeownersMap,
              packages,
            });

            return {
              status: result.status,
              id: conformer.id ?? nanoid(),
              filter: matchingPattern,
              package: pkg,
              message: merge(
                {
                  message: conformer.message,
                },
                {
                  message: result.message?.message,
                  path: result.message?.path
                    ? path.join(pkg.path, result.message.path)
                    : undefined,
                  suggestion: result.message?.suggestion,
                },
              ),
              fix: conformer.fix,
            };
          }),
      ),
    ),
  );
};
