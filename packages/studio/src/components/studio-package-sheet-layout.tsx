'use client';
import { useQueryParams } from 'hooks/use-query-params';
import { PackageSheetLayout } from '@commonalityco/ui-graph/package-sheet';
import { useEffect, useState } from 'react';

export function StudioPackageSheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { query, deleteQuery } = useQueryParams();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <PackageSheetLayout
      open={Boolean(query.get('package'))}
      onOpenChange={(open) => {
        if (!open) {
          deleteQuery('package');
        }
      }}
    >
      {children}
    </PackageSheetLayout>
  );
}

export default StudioPackageSheetLayout;
