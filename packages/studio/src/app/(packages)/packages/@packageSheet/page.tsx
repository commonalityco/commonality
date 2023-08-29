import React from 'react';
import StudioPackageSheet from 'components/studio-package-sheet';

async function PackageSheetPage({
  searchParams,
}: {
  searchParams: { package?: string; editing?: string };
}) {
  return <StudioPackageSheet packageName={searchParams.package} />;
}

export default PackageSheetPage;
