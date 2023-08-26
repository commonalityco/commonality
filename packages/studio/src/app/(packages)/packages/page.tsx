import React from 'react';
import { PackagesTable, columns } from './packages-table';
import { getPackagesData } from 'data/packages';
import { getDocumentsData } from 'data/documents';
import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import { Card, CardContent, Input } from '@commonalityco/ui-design-system';

function keyBy<Data extends Record<string, any>>(
  array: Data[],
  key: string,
): Record<string, Data> {
  return (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});
}

async function PackagesPage() {
  const [packages, documentsData, tagsData, codeownersData] = await Promise.all(
    [getPackagesData(), getDocumentsData(), getTagsData(), getCodeownersData()],
  );

  const normalizedDocuments = keyBy(documentsData, 'packageName');
  const normalizedTags = keyBy(tagsData, 'packageName');
  const normalizedCodeowners = keyBy(codeownersData, 'packageName');

  const data = packages.map((pkg) => {
    return {
      name: pkg.name,
      version: pkg.version,
      type: pkg.type,
      documents: normalizedDocuments[pkg.name]?.documents ?? [],
      tags: normalizedTags[pkg.name]?.tags ?? [],
      codeowners: normalizedCodeowners[pkg.name]?.codeowners ?? [],
    };
  });

  const uniqueTags = Array.from(new Set(tagsData.flatMap((pkg) => pkg.tags)));
  const uniqueCodeowners = Array.from(
    new Set(codeownersData.flatMap((codeowner) => codeowner.codeowners)),
  );

  return (
    <div className="bg-secondary w-full px-6 py-4">
      <Card className="p-6">
        <PackagesTable
          columns={columns}
          data={data}
          codeowners={uniqueCodeowners}
          tags={uniqueTags}
        />
      </Card>
    </div>
  );
}

export default PackagesPage;
