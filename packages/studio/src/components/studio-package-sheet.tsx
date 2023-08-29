import 'server-only';
import { PackageSheet } from '@commonalityco/ui-graph';
import React from 'react';
import { getPackagesData } from 'data/packages';
import { getDocumentsData } from 'data/documents';
import { getTagsData } from 'data/tags';
import { getCodeownersData } from 'data/codeowners';
import { slugifyPackageName } from '@commonalityco/utils-core';
import { CreateTagsButton } from 'components/create-tags-button';

async function StudioPackageSheet({ packageName }: { packageName?: string }) {
  const [packages, documentsData, tagsData, codeownersData] = await Promise.all(
    [getPackagesData(), getDocumentsData(), getTagsData(), getCodeownersData()],
  );

  const pkg = packages.find(
    (pkg) => slugifyPackageName(pkg.name) === packageName,
  );

  if (!pkg) {
    return null;
  }

  const tags =
    tagsData.find((data) => data.packageName === pkg.name)?.tags ?? [];
  const documents =
    documentsData.find((data) => data.packageName === pkg.name)?.documents ??
    [];
  const codeowners =
    codeownersData.find((data) => data.packageName === pkg.name)?.codeowners ??
    [];

  return (
    <PackageSheet
      pkg={pkg}
      tags={tags}
      codeowners={codeowners}
      documents={documents}
      createTagsButton={<CreateTagsButton pkg={pkg} tagsData={tagsData} />}
    />
  );
}

export default StudioPackageSheet;
