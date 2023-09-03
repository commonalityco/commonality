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
import { slugifyPackageName } from '@commonalityco/utils-core';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@commonalityco/ui-design-system/dropdown-menu';
import { Button } from '@commonalityco/ui-design-system';
import { MoreHorizontal } from 'lucide-react';
import { Package } from '@commonalityco/types';
import { openEditorAction } from 'actions/editor';
import {
  EditTagsDialog,
  EditTagsDialogContent,
} from 'components/edit-tags-dialog';

function ActionButton({
  data,
  tags,
}: {
  data: Package & { tags: string[] };
  tags: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditTagsDialog open={open} onOpenChange={setOpen}>
        <EditTagsDialogContent
          tags={tags}
          existingTags={data.tags}
          packageName={data.name}
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
          <DropdownMenuItem onSelect={() => openEditorAction(data.path)}>
            Open package.json
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openEditorAction(data.path)}>
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

function StudioTagsCell({
  tags,
  ...rest
}: Omit<ComponentProps<typeof TagsCell>, 'onAddTags'> & {
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

function StudioPackagesTable({
  onEditorOpen,
  ...props
}: Omit<
  ComponentProps<typeof PackagesTable<ColumnData, unknown>>,
  'columns'
> & {
  tags: string[];
  onEditorOpen: (path: string) => Promise<void>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return <SortableHeader column={column} title="Name" />;
        },
        size: 300,
        cell: (props) => {
          const query = new URLSearchParams(Array.from(searchParams.entries()));
          query.append('package', slugifyPackageName(props.row.original.name));

          const href = `${pathname}?${query.toString()}`;

          return (
            <Link scroll={false} href={href} className="block">
              <NameCell {...props} />
            </Link>
          );
        },
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
              <ActionButton data={row.original} tags={props.tags} />
            </Suspense>
          );
        },
      },
    ] satisfies PackageTableColumns;
  }, [onEditorOpen, pathname, searchParams, props.tags]);

  return <PackagesTable {...props} columns={columns} />;
}

export default StudioPackagesTable;
