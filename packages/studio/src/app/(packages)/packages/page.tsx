import React from 'react';
import { PackagesTable, columns } from './packages-table';
import { getPackagesData } from 'data/packages';
import { getDocumentsData } from 'data/documents';
import { getTagsData } from 'data/tags';
import keyBy from 'lodash/keyBy';
import { getCodeownersData } from 'data/codeowners';
import { Input } from '@commonalityco/ui-design-system';

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

  return (
    <div className="container mx-auto w-full pt-6 space-y-6">
      <div>
        <Input />
      </div>
      <PackagesTable columns={columns} data={data} />
    </div>
  );
}

export default PackagesPage;
