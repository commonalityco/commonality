'use server';
import { Badge } from '@commonalityco/ui-design-system';
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
import omit from 'lodash/omit';
import stripAnsi from 'strip-ansi';
import { ConformanceResult } from '@commonalityco/types';

async function PackagesPage({ searchParams = {} }: { searchParams: unknown }) {
  const [packages, tagsData, codeownersData, results] = await Promise.all([
    getPackagesData(),
    getTagsData(),
    getCodeownersData(),
    getConformanceResultsData(),
  ]);

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
    results: results.map((result) => {
      const strippedResult = result.message.context
        ? {
            ...result,
            message: {
              ...result.message,
              context: stripAnsi(result.message.context),
            },
          }
        : result;

      return omit(strippedResult, ['fix']) as Omit<ConformanceResult, 'fix'>;
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
      <div className="grow p-6 w-full space-y-6 flex flex-col">
        <div className="w-full space-y-6">
          <div className="flex gap-4 items-center">
            <h1 className="font-medium text-2xl leading-none">Checks</h1>
            <Badge
              variant="secondary"
              className="text-muted-foreground"
            >{`${data.length} of ${packages.length} packages`}</Badge>
          </div>

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
