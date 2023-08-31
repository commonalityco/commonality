'use server';
import React, { Suspense } from 'react';
import { getPackagesData } from 'data/packages';
import { getDocumentsData } from 'data/documents';
import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import { Badge, Button } from '@commonalityco/ui-design-system';
import PackageTableFilters from './package-table-filters';
import StudioPackagesTable from './studio-packages-table';
import { z } from 'zod';
import StudioPackagesTablePaginator from './studio-packages-table-paginator';
import openEditor from 'open-editor';
import { openEditorAction } from 'actions/editor';
import {
  CreateTagsDialog,
  CreateTagsDialogContent,
} from 'components/create-tags-dialog';

function keyBy<Data extends Record<string, any>>(
  array: Data[],
  key: string,
): Record<string, Data> {
  return (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});
}

async function PackagesPage({ searchParams }: { searchParams: unknown }) {
  const [packages, documentsData, tagsData, codeownersData] = await Promise.all(
    [getPackagesData(), getDocumentsData(), getTagsData(), getCodeownersData()],
  );

  const parsedSearchParams = z
    .object({
      editTags: z.coerce.boolean().optional(),
      name: z.string().optional(),
      package: z.string().optional(),
      page: z.coerce.number().optional().default(0),
      pageCount: z.coerce.number().optional().default(25),
      tags: z
        .union([z.string().transform((arg) => [arg]), z.array(z.string())])
        .optional(),
      codeowners: z
        .union([z.string().transform((arg) => [arg]), z.array(z.string())])
        .optional(),
    })
    .parse(searchParams);

  const normalizedDocuments = keyBy(documentsData, 'packageName');
  const normalizedTags = keyBy(tagsData, 'packageName');
  const normalizedCodeowners = keyBy(codeownersData, 'packageName');
  const pageCount = parsedSearchParams.pageCount;
  const skip = parsedSearchParams.page
    ? parsedSearchParams.page * parsedSearchParams.pageCount
    : 0;

  const data = packages
    .map((pkg) => {
      return {
        ...pkg,
        documents: normalizedDocuments[pkg.name]?.documents ?? [],
        tags: normalizedTags[pkg.name]?.tags ?? [],
        codeowners: normalizedCodeowners[pkg.name]?.codeowners ?? [],
      };
    })
    .filter((pkg) => {
      if (parsedSearchParams.name) {
        return pkg.name
          .toLowerCase()
          .includes(parsedSearchParams.name.toLowerCase());
      }
      return true;
    })
    .filter((pkg) => {
      if (parsedSearchParams.tags) {
        return pkg.tags.some((pkgTag) => {
          if (!parsedSearchParams.tags) return;

          return parsedSearchParams.tags.some((tag) => tag === pkgTag);
        });
      }
      return true;
    })
    .filter((pkg) => {
      if (parsedSearchParams.codeowners) {
        return pkg.codeowners.some((pkgCodeowner) => {
          if (!parsedSearchParams.codeowners) return;

          return parsedSearchParams.codeowners.some(
            (codeowner) => codeowner === pkgCodeowner,
          );
        });
      }
      return true;
    });

  const paginatedData = data.slice(skip, pageCount);

  const uniqueTags = Array.from(new Set(tagsData.flatMap((pkg) => pkg.tags)));
  const uniqueCodeowners = Array.from(
    new Set(codeownersData.flatMap((codeowner) => codeowner.codeowners)),
  );

  return (
    <>
      <div className="grow p-6 w-full space-y-6 flex flex-col">
        <div className="w-full space-y-6">
          <div className="flex gap-4 items-center">
            <h1 className="font-medium text-2xl leading-none">Packages</h1>
            <Badge
              variant="secondary"
              className="text-muted-foreground"
            >{`${data.length}/${packages.length}`}</Badge>
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
            data={paginatedData}
            codeowners={uniqueCodeowners}
            tags={uniqueTags}
            onEditorOpen={openEditorAction}
          />
        </div>
        <StudioPackagesTablePaginator
          totalCount={data.length}
          pageCount={pageCount}
          page={parsedSearchParams.page}
        />
      </div>
    </>
  );
}

export default PackagesPage;
