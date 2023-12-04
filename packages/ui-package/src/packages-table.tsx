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
  Row,
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
  Button,
} from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { PackageType, formatTagName } from '@commonalityco/utils-core';
import { getIconForPackage } from '@commonalityco/utils-package';
import { Package } from '@commonalityco/types';
import { Plus } from 'lucide-react';

export type ColumnData = Package & {
  codeowners: string[];
  tags: string[];
};

export type PackageTableColumns<Data> = ColumnDef<Data & ColumnData, unknown>[];

export function SortableHeader<TData, TValue>(props: {
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

export function NameCell<T extends ColumnData>({ row }: { row: Row<T> }) {
  const name: PackageType = row.getValue('name');
  const type = row.original.type;
  const description = row.original.description || 'No description';

  const Icon = getIconForPackage(type);

  return (
    <div className="flex items-center gap-3 h-auto py-0 px-0 w-full justify-start">
      <Icon />
      <div className="text-left space-y-1">
        <div className="flex flex-nowrap gap-2 items-center">
          <span className="font-semibold block">{name}</span>
          <div className="font-mono leading-none mt-px">
            {row.original.version}
          </div>
        </div>
        <span className="text-xs text-muted-foreground block">
          {description}
        </span>
      </div>
    </div>
  );
}

export function TagsCell<T extends ColumnData>({
  row,
  onAddTags,
}: {
  row: Row<T>;
  onAddTags: () => void;
}) {
  const tags: string[] = row.original.tags;

  if (tags.length === 0) {
    return (
      <Button
        variant="link"
        className="px-0"
        size="sm"
        onClick={() => onAddTags()}
      >
        <Plus className="h-3 w-3" />
        Add tags
      </Button>
    );
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {formatTagName(tag)}
        </Badge>
      ))}
    </div>
  );
}

export function CodeownersCell<T extends ColumnData>({ row }: { row: Row<T> }) {
  const codeowners: string[] = row.getValue('codeowners');

  if (codeowners.length === 0) {
    return <span className="text-muted-foreground">No codeowners</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {codeowners.map((codeowner) => (
        <Badge key={codeowner} variant="outline" className="rounded-full">
          {codeowner}
        </Badge>
      ))}
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function PackagesTable<TData, TValue>({
  columns,
  data,
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
        const codeowners: string[] = row.getValue('codeowners');

        return codeowners.some((codeowner) => filterValue.includes(codeowner));
      },
      hasTags: (row, columnIds, filterValue: string[]) => {
        const tags: string[] = row.getValue('tags');

        return tags.some((tag) => filterValue.includes(tag));
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <Table className="table-fixed relative">
      <TableHeader className="sticky top-0 z-10">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                    ? undefined
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
            <TableCell
              colSpan={columns.length}
              className="h-36 text-center font-medium"
            >
              No packages match your current filters
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
