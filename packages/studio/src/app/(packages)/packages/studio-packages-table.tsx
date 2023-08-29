'use client';
import React, { ComponentProps, useMemo } from 'react';
import {
  CodeownersCell,
  DocumentsCell,
  NameCell,
  PackageTableColumns,
  PackagesTable,
  SortableHeader,
  TagsCell,
  VersionCell,
  ColumnData,
} from './packages-table';
import { useQueryParams } from 'hooks/use-query-params';
import { slugifyPackageName } from '@commonalityco/utils-core';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function StudioPackagesTable({
  onDocumentClick,
  ...props
}: Omit<
  ComponentProps<typeof PackagesTable<ColumnData, unknown>>,
  'columns'
> & {
  onDocumentClick: ComponentProps<typeof DocumentsCell>['onDocumentClick'];
}) {
  const { setQuery } = useQueryParams();
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
        accessorKey: 'version',
        header: ({ column }) => {
          return <SortableHeader column={column} title="Version" />;
        },
        cell: VersionCell,
      },
      {
        accessorKey: 'documents',
        header: 'Documents',
        cell: (props) => (
          <DocumentsCell {...props} onDocumentClick={onDocumentClick} />
        ),
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: TagsCell,
      },
      {
        accessorKey: 'codeowners',
        header: 'Codeowners',
        cell: CodeownersCell,
      },
    ] satisfies PackageTableColumns;
  }, [onDocumentClick, searchParams, pathname]);

  return <PackagesTable {...props} columns={columns} />;
}

export default StudioPackagesTable;
