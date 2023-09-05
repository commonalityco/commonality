'use client';
import React, { ComponentProps, Suspense, useMemo, useState } from 'react';
import {
  CodeownersCell,
  DocumentsCell,
  NameCell,
  PackageTableColumns,
  PackagesTable,
  SortableHeader,
  TagsCell,
  ColumnData,
} from '@commonalityco/ui-package/packages-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@commonalityco/ui-design-system/dropdown-menu';
import { Button } from '@commonalityco/ui-design-system';
import { MoreHorizontal } from 'lucide-react';
import { openEditorAction } from '@/actions/editor';
import {
  EditTagsDialog,
  EditTagsDialogContent,
} from '@/components/edit-tags-dialog';

export function ActionButton({
  existingTags,
  packageName,
  tags,
  packageJsonPath,
  projectConfigPath,
}: {
  packageName: string;
  existingTags: string[];
  tags: string[];
  packageJsonPath: string;
  projectConfigPath?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditTagsDialog open={open} onOpenChange={setOpen}>
        <EditTagsDialogContent
          tags={tags}
          existingTags={existingTags}
          packageName={packageName}
        />
      </EditTagsDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => openEditorAction(packageJsonPath)}>
            Open package.json
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!projectConfigPath}
            onSelect={
              projectConfigPath
                ? () => openEditorAction(projectConfigPath)
                : undefined
            }
          >
            Open commonality.json
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpen(true)}>
            Edit tags
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function StudioTagsCell<T extends ColumnData>({
  tags,
  ...rest
}: Omit<ComponentProps<typeof TagsCell<T>>, 'onAddTags'> & {
  tags: string[];
}) {
  const [open, setOpen] = useState(false);
  const data = rest.row.original;

  return (
    <>
      <EditTagsDialog open={open} onOpenChange={setOpen}>
        <EditTagsDialogContent
          tags={tags}
          existingTags={data.tags}
          packageName={data.name}
        />
      </EditTagsDialog>
      <TagsCell {...rest} onAddTags={() => setOpen(true)} />
    </>
  );
}

export type StudioColumnData = ColumnData & {
  packageJsonPath: string;
  projectConfigPath?: string;
};

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
        accessorKey: 'documents',
        header: 'Documents',
        cell: (props) => (
          <DocumentsCell {...props} onDocumentOpen={onEditorOpen} />
        ),
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
        id: 'actions',
        size: 64,
        cell: ({ row }) => {
          return (
            <Suspense fallback={null}>
              <ActionButton
                packageJsonPath={row.original.packageJsonPath}
                projectConfigPath={row.original.projectConfigPath}
                existingTags={row.original.tags}
                packageName={row.original.name}
                tags={props.tags}
              />
            </Suspense>
          );
        },
      },
    ] satisfies PackageTableColumns<StudioColumnData>;
  }, [onEditorOpen, props.tags]);

  return <PackagesTable {...props} columns={columns} />;
}

export default StudioPackagesTable;
