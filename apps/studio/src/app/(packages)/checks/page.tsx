import { getCodeownersData } from '@/data/codeowners';
import { getPackagesData } from '@/data/packages';
import { getTagsData } from '@/data/tags';
import { openEditorAction } from '@/actions/editor';
import { z } from 'zod';
import PackageTableFilters from './studio-package-table-filters';
import React from 'react';
import StudioPackagesTable from './studio-packages-table';
import StudioPackagesTablePaginator from './studio-packages-table-paginator';
import { getTableData } from './get-table-data';
import { getConformanceResultsData } from '@/data/conformance';
import omit from 'lodash-es/omit';
import stripAnsi from 'strip-ansi';
import { ConformanceHeader } from '@commonalityco/ui-conformance';

export const dynamic = 'force-dynamic';

async function PackagesPage({ searchParams = {} }: { searchParams: unknown }) {
  const [packages, tagsData, codeownersData, results] = await Promise.all([
    getPackagesData(),
    getTagsData(),
    getCodeownersData(),
    getConformanceResultsData(),
  ]);

  const resultsWithoutFix = results.map((result) => omit(result, ['fix']));

  const parsedSearchParams = z
    .object({
      editTags: z.coerce.boolean().optional(),
      name: z.string().optional(),
      package: z.string().optional(),
      page: z.coerce.number().optional().default(1),
      pageCount: z.coerce.number().optional().default(25),
      tags: z
        .union([z.string().transform((arg) => [arg]), z.array(z.string())])
        .optional(),
      codeowners: z
        .union([z.string().transform((arg) => [arg]), z.array(z.string())])
        .optional(),
    })
    .parse(searchParams);

  const data = await getTableData({
    packages,
    results: resultsWithoutFix.map((result) => {
      return result.message.suggestion
        ? {
            ...result,
            message: {
              ...result.message,
              suggestion: stripAnsi(result.message.suggestion),
            },
          }
        : result;
    }),
    tagsData,
    codeownersData,
    filterName: parsedSearchParams.name,
    filterTags: parsedSearchParams.tags,
    filterCodeowners: parsedSearchParams.codeowners,
    page: parsedSearchParams.page,
    pageCount: parsedSearchParams.pageCount,
  });

  const uniqueTags: string[] = Array.from(
    new Set(tagsData.flatMap((pkg) => pkg.tags)),
  ).sort();
  const uniqueCodeowners: string[] = Array.from(
    new Set(codeownersData.flatMap((codeowner) => codeowner.codeowners)),
  ).sort();

  return (
    <>
      <div className="grow px-6 py-4 w-full space-y-4 flex flex-col">
        <div className="w-full space-y-4">
          <ConformanceHeader
            results={resultsWithoutFix}
            totalCount={packages.length}
            shownCount={data.length}
          ></ConformanceHeader>
          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <PackageTableFilters
              tags={uniqueTags}
              codeowners={uniqueCodeowners}
            />
          </div>
        </div>
        <div className="grow">
          <StudioPackagesTable
            data={data}
            tags={uniqueTags}
            onEditorOpen={openEditorAction}
          />
        </div>
        <StudioPackagesTablePaginator
          totalCount={packages.length}
          pageCount={parsedSearchParams.pageCount}
          page={parsedSearchParams.page}
        />
      </div>
    </>
  );
}

export default PackagesPage;
