'use client';
import React, { ComponentProps, Suspense, useMemo, useState } from 'react';
import {
  CodeownersCell,
  ConformanceCell,
  NameCell,
  PackageTableColumns,
  PackagesTable,
  SortableHeader,
  TagsCell,
  ColumnData,
  PackageChecksDialog,
} from '@commonalityco/ui-conformance';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@commonalityco/ui-design-system/dropdown-menu';
import { Button, DialogTrigger } from '@commonalityco/ui-design-system';
import { MoreHorizontal } from 'lucide-react';
import { openPackageJson } from '@/actions/editor';
import {
  EditTagsDialog,
  EditTagsDialogContent,
} from '@/components/edit-tags-dialog';
import { Package } from '@commonalityco/types';
import { ConformanceResult } from '@commonalityco/utils-conformance';

export function ActionButton({
  existingTags,
  tags,
  pkg,
  results,
}: {
  pkg: Package;
  existingTags: string[];
  tags: string[];
  results: ConformanceResult[];
}) {
  const [tagsOpen, setTagsOpen] = useState(false);
  const [checksOpen, setChecksOpen] = useState(false);

  return (
    <>
      <EditTagsDialog open={tagsOpen} onOpenChange={setTagsOpen}>
        <EditTagsDialogContent
          tags={tags}
          existingTags={existingTags}
          pkg={pkg}
          onEdit={() => setTagsOpen(false)}
        />
      </EditTagsDialog>
      <div className="flex flex-nowrap gap-2 justify-end">
        <PackageChecksDialog
          results={results}
          pkg={pkg}
          open={checksOpen}
          onOpenChange={setChecksOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              View checks
            </Button>
          </DialogTrigger>
        </PackageChecksDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0" size="icon">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openPackageJson(pkg.path)}>
              Edit package.json
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTagsOpen(true)}>
              Edit tags
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export function StudioTagsCell<T extends ColumnData>({
  tags,
  ...rest
}: Omit<ComponentProps<typeof TagsCell<T>>, 'onAddTags'> & { tags: string[] }) {
  const [open, setOpen] = useState(false);
  const data = rest.row.original;

  return (
    <>
      <EditTagsDialog open={open} onOpenChange={setOpen}>
        <EditTagsDialogContent
          tags={tags}
          existingTags={data.tags}
          pkg={data.package}
          onEdit={() => setOpen(false)}
        />
      </EditTagsDialog>
      {data.tags.length > 0 ? (
        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
          className="p-0 m-0 h-auto bg-tranparent hover:bg-transparent"
        >
          <TagsCell {...rest} onAddTags={() => setOpen(true)} />
        </Button>
      ) : (
        <TagsCell {...rest} onAddTags={() => setOpen(true)} />
      )}
    </>
  );
}

export type StudioColumnData = ColumnData;

interface PackagesTableProps
  extends Omit<
    ComponentProps<typeof PackagesTable<StudioColumnData, unknown>>,
    'columns'
  > {}

interface StudioPackagesTableProps extends PackagesTableProps {
  tags: string[];
  onEditorOpen: (path: string) => Promise<void>;
}

function StudioPackagesTable({
  onEditorOpen,
  ...props
}: StudioPackagesTableProps) {
  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return <SortableHeader column={column} title="Name" />;
        },
        size: 300,
        cell: NameCell,
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: (cellProps) => (
          <StudioTagsCell {...cellProps} tags={props.tags} />
        ),
      },
      {
        accessorKey: 'codeowners',
        header: 'Codeowners',
        cell: CodeownersCell,
      },
      {
        accessorKey: 'results',
        header: 'Conformance',
        cell: ConformanceCell,
      },
      {
        id: 'actions',
        // size: 170,
        cell: ({ row }) => {
          return (
            <Suspense fallback={null}>
              <ActionButton
                existingTags={row.original.tags}
                pkg={row.original.package}
                results={row.original.results}
                tags={props.tags}
              />
            </Suspense>
          );
        },
      },
    ] satisfies PackageTableColumns<StudioColumnData>;
  }, [props.tags]);

  return <PackagesTable {...props} columns={columns} />;
}

export default StudioPackagesTable;
