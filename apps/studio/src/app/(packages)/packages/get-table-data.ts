import {
  CodeownersData,
  ConformanceResult,
  Package,
  TagsData,
} from '@commonalityco/types';
import { ColumnData } from '@commonalityco/feature-conformance/ui';

function keyBy<Data extends Record<string, any>>(
  array: Data[],
  key: string,
): Record<string, Data> {
  return (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});
}

export const getTableData = async ({
  packages,
  tagsData,
  codeownersData,
  filterName,
  filterTags,
  filterCodeowners,
  page = 1,
  pageCount,
  results,
}: {
  packages: Package[];
  results: Omit<ConformanceResult, 'fix'>[];
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
  filterName?: string;
  filterTags?: string[];
  filterCodeowners?: string[];
  page: number;
  pageCount: number;
}): Promise<ColumnData[]> => {
  const normalizedTags = keyBy(tagsData, 'packageName');
  const normalizedCodeowners = keyBy(codeownersData, 'packageName');

  const data = packages
    .map((pkg) => {
      const resultsForPackage = results.filter(
        (result) => result.package.name === pkg.name,
      );
      return {
        package: pkg,
        tags: normalizedTags[pkg.name]?.tags ?? [],
        codeowners: normalizedCodeowners[pkg.name]?.codeowners ?? [],
        results: resultsForPackage,
      } satisfies ColumnData;
    })
    .filter((data) => {
      if (filterName) {
        return data.package.name
          .toLowerCase()
          .includes(filterName.toLowerCase());
      }

      return true;
    })
    .filter((data) => {
      if (filterTags?.length && filterTags.length > 0) {
        return data.tags.some((pkgTag) => {
          if (filterTags.length === 0) return;

          return filterTags.some((tag) => tag === pkgTag);
        });
      }

      return true;
    })
    .filter((data) => {
      if (filterCodeowners?.length && filterCodeowners.length > 0) {
        return data.codeowners.some((pkgCodeowner) => {
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

  return paginatedData;
};
