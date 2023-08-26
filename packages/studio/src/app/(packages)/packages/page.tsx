import React from 'react';
import { PackagesTable, columns } from './packages-table';
import { getPackagesData } from 'data/packages';
import { getDocumentsData } from 'data/documents';
import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import { Card, CardContent, Input, cn } from '@commonalityco/ui-design-system';
import TagsFilterButton from './tags-filter-button';
import CodeownersFilterButton from './codeowners-filter-button';
import PackageTableFilters from './package-table-filters';

function keyBy<Data extends Record<string, any>>(
  array: Data[],
  key: string,
): Record<string, Data> {
  return (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});
}

async function PackagesPage({
  searchParams,
}: {
  searchParams: {
    name?: string;
    tags: string[] | string;
    codeowners: string[] | string;
  };
}) {
  const [packages, documentsData, tagsData, codeownersData] = await Promise.all(
    [getPackagesData(), getDocumentsData(), getTagsData(), getCodeownersData()],
  );

  const normalizedDocuments = keyBy(documentsData, 'packageName');
  const normalizedTags = keyBy(tagsData, 'packageName');
  const normalizedCodeowners = keyBy(codeownersData, 'packageName');

  const data = packages
    .map((pkg) => {
      return {
        name: pkg.name,
        version: pkg.version,
        type: pkg.type,
        documents: normalizedDocuments[pkg.name]?.documents ?? [],
        tags: normalizedTags[pkg.name]?.tags ?? [],
        codeowners: normalizedCodeowners[pkg.name]?.codeowners ?? [],
      };
    })
    .filter((pkg) => {
      if (searchParams.name) {
        return pkg.name.toLowerCase().includes(searchParams.name.toLowerCase());
      }
      return true;
    })
    .filter((pkg) => {
      if (typeof searchParams.tags === 'string') {
        return pkg.tags.includes(searchParams.tags);
      }
      if (Array.isArray(searchParams.tags)) {
        return pkg.tags.some((pkgTag) =>
          (searchParams.tags as string[]).some((tag) => tag === pkgTag),
        );
      }
      return true;
    })
    .filter((pkg) => {
      if (typeof searchParams.codeowners === 'string') {
        return pkg.codeowners.includes(searchParams.codeowners);
      }
      if (searchParams.codeowners) {
        return pkg.codeowners.some((pkgCodeowner) =>
          (searchParams.codeowners as string[]).some(
            (codeowner) => codeowner === pkgCodeowner,
          ),
        );
      }
      return true;
    });

  const uniqueTags = Array.from(new Set(tagsData.flatMap((pkg) => pkg.tags)));
  const uniqueCodeowners = Array.from(
    new Set(codeownersData.flatMap((codeowner) => codeowner.codeowners)),
  );

  return (
    <div className={cn('bg-secondary w-full px-6 py-4 grow')}>
      <Card className="p-6 min-h-full">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <PackageTableFilters
              tags={uniqueTags}
              codeowners={uniqueCodeowners}
            />
          </div>
          <PackagesTable
            columns={columns}
            data={data}
            codeowners={uniqueCodeowners}
            tags={uniqueTags}
          />
        </div>
      </Card>
    </div>
  );
}

export default PackagesPage;
