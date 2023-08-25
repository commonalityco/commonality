'use client';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Column,
} from '@tanstack/react-table';
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableHeadSortButton,
} from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DependencyType,
  PackageType,
  formatTagName,
} from '@commonalityco/utils-core';
import { getIconForPackage } from '@commonalityco/utils-package';
import { Document } from '@commonalityco/types';

function SortableHeader<TData, TValue>(props: {
  column: Column<TData, TValue>;
  title: string;
}) {
  return (
    <TableHeadSortButton
      sort={props.column.getIsSorted()}
      onClick={() =>
        props.column.toggleSorting(props.column.getIsSorted() === 'asc')
      }
    >
      {props.title}
    </TableHeadSortButton>
  );
}

export const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <SortableHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      const name: PackageType = row.getValue('name');
      const type = row.original.type;

      const Icon = getIconForPackage(type);

      return (
        <div className="flex gap-2 flex-nowrap items-center">
          <Icon />
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: 'version',
    header: ({ column }) => {
      return <SortableHeader column={column} title="Version" />;
    },
  },

  {
    accessorKey: 'codeowners',
    header: 'Codeowners',
    cell: ({ row }) => {
      const codeowners: string[] = row.getValue('codeowners');

      if (!codeowners.length) {
        return <span className="text-muted-foreground">None</span>;
      }
      return (
        <div>
          {codeowners.map((codeowner) => (
            <Badge variant="outline" className="rounded-full" key={codeowner}>
              {codeowner}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags: string[] = row.getValue('tags');

      return (
        <div>
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {formatTagName(tag)}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'documents',
    header: 'Documents',
    cell: ({ row }) => {
      const documents: Document[] = row.getValue('documents');

      return (
        <div>
          {documents.map((document) => (
            <Badge key={document.filename}>{document.filename}</Badge>
          ))}
        </div>
      );
    },
  },
] satisfies ColumnDef<{
  type: PackageType;
  name: string;
  version: string;
  codeowners: string[];
  tags: string[];
  documents: Document[];
}>[];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function PackagesTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
