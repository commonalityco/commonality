import {
  CodeownersData,
  DocumentsData,
  Package,
  TagsData,
} from '@commonalityco/types';
import { ColumnData } from '@commonalityco/ui-package';
import path from 'node:path';
import fs from 'fs-extra';

function keyBy<Data extends Record<string, any>>(
  array: Data[],
  key: string,
): Record<string, Data> {
  return (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});
}

export const getTableData = async ({
  packages,
  documentsData,
  tagsData,
  codeownersData,
  filterName,
  filterTags,
  filterCodeowners,
  page = 1,
  pageCount,
  rootDirectory,
}: {
  packages: Package[];
  documentsData: DocumentsData[];
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
  filterName?: string;
  filterTags?: string[];
  filterCodeowners?: string[];
  page: number;
  pageCount: number;
  rootDirectory: string;
}): Promise<
  Array<
    ColumnData & {
      packageJsonPath: string;
      projectConfigPath?: string;
    }
  >
> => {
  const normalizedDocuments = keyBy(documentsData, 'packageName');
  const normalizedTags = keyBy(tagsData, 'packageName');
  const normalizedCodeowners = keyBy(codeownersData, 'packageName');

  const data = packages
    .map((pkg) => {
      return {
        ...pkg,
        documents: normalizedDocuments[pkg.name]?.documents ?? [],
        tags: normalizedTags[pkg.name]?.tags ?? [],
        codeowners: normalizedCodeowners[pkg.name]?.codeowners ?? [],
      } satisfies ColumnData;
    })
    .filter((pkg) => {
      if (filterName) {
        return pkg.name.toLowerCase().includes(filterName.toLowerCase());
      }

      return true;
    })
    .filter((pkg) => {
      if (filterTags?.length && filterTags.length > 0) {
        return pkg.tags.some((pkgTag) => {
          if (filterTags.length === 0) return;

          return filterTags.some((tag) => tag === pkgTag);
        });
      }

      return true;
    })
    .filter((pkg) => {
      if (filterCodeowners?.length && filterCodeowners.length > 0) {
        return pkg.codeowners.some((pkgCodeowner) => {
          if (filterCodeowners.length === 0) return;

          return filterCodeowners.some(
            (codeowner) => codeowner === pkgCodeowner,
          );
        });
      }

      return true;
    });

  const pageIndex = page - 1;
  const fromIndex = pageIndex !== 0 ? pageIndex * pageCount : 0;
  const toIndex = fromIndex + pageCount;

  const paginatedData = data.slice(fromIndex, toIndex);

  const dataWithFilePaths = await Promise.all(
    paginatedData.map(async (pkg) => {
      const projectConfigPath = path.join(pkg.path, 'commonality.json');
      const packageJsonPath = path.join(pkg.path, 'package.json');
      const projectConfigExists = await fs.pathExists(
        path.join(rootDirectory, projectConfigPath),
      );

      return {
        ...pkg,
        packageJsonPath,
        projectConfigPath: projectConfigExists ? projectConfigPath : undefined,
      } satisfies ColumnData & {
        packageJsonPath: string;
        projectConfigPath?: string;
      };
    }),
  );

  return dataWithFilePaths;
};
