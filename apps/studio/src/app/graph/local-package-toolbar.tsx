'use client';
import { editingPackageAtom } from '@/atoms/graph-atoms';
import {
  PackageToolbar,
  ToolbarButton,
  selectedPackagesAtom,
} from '@commonalityco/feature-graph';
import { Separator } from '@commonalityco/ui-design-system';
import { useAtomValue, useSetAtom } from 'jotai';
import { Tags } from 'lucide-react';

function LocalPackageToolbar() {
  const setEditingPackage = useSetAtom(editingPackageAtom);
  const selectedPackages = useAtomValue(selectedPackagesAtom);

  return (
    <PackageToolbar>
      {selectedPackages.length === 1 ? (
        <>
          <Separator orientation="vertical" className="my-1 h-7" />
          <ToolbarButton
            text="Edit tags"
            onClick={() => {
              setEditingPackage(selectedPackages[0]);
            }}
          >
            <Tags className="h-4 w-4" />
          </ToolbarButton>
        </>
      ) : null}
    </PackageToolbar>
  );
}

export default LocalPackageToolbar;
