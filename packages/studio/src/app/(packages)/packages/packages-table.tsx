'use client';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Column,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableHeadSortButton,
  Input,
  Card,
} from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { PackageType, formatTagName } from '@commonalityco/utils-core';
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
    size: 300,
    cell: ({ row }) => {
      const name: PackageType = row.getValue('name');
      const type = row.original.type;

      const Icon = getIconForPackage(type);

      return (
        <div className="flex gap-2 flex-nowrap items-center font-medium">
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
    cell: ({ row }) => {
      const version: string = row.getValue('version');

      return <div className="font-mono">{version}</div>;
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
            <span key={document.filename}>{document.filename}</span>
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
            <span key={codeowner}>{codeowner}</span>
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
  tags: string[];
  codeowners: string[];
}

export function PackagesTable<TData, TValue>({
  columns,
  data,
  tags,
  codeowners,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      hasCodeowners: (row, columnIds, filterValue: string[]) => {
        console.log({ columnIds });
        const codeowners: string[] = row.getValue('codeowners');

        return codeowners.some((codeowner) =>
          filterValue.some(
            (filteredCodeowner) => filteredCodeowner === codeowner,
          ),
        );
      },
      hasTags: (row, columnIds, filterValue: string[]) => {
        const tags: string[] = row.getValue('tags');

        return tags.some((tag) =>
          filterValue.some((filteredTag) => filteredTag === tag),
        );
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <Table className="table-fixed">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
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
            <TableCell colSpan={columns.length} className="h-36 text-center">
              No packages match your current filters
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
