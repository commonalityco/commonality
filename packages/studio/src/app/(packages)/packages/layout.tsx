import StudioPackageSheetLayout from 'components/studio-package-sheet-layout';
import React from 'react';

function PackagesLayout({
  children,
  packageSheet,
}: {
  children: React.ReactNode;
  packageSheet: React.ReactNode;
}) {
  return (
    <>
      {children}
      <StudioPackageSheetLayout>{packageSheet}</StudioPackageSheetLayout>
    </>
  );
}

export default PackagesLayout;
