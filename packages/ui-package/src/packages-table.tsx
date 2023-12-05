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
  Popover,
  PopoverTrigger,
  PopoverContent,
  ScrollArea,
  cn,
} from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { PackageType, Status, formatTagName } from '@commonalityco/utils-core';
import { getIconForPackage } from '@commonalityco/utils-package';
import { ConformanceResult, Package } from '@commonalityco/types';
import { AlertTriangle, Check, ChevronDown, Plus, X } from 'lucide-react';

export type ColumnData = {
  package: Package;
  results: Omit<ConformanceResult, 'fix'>[];
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
  const type = row.original.package.type;
  const description = row.original.package.description || 'No description';

  const Icon = getIconForPackage(type);

  return (
    <div className="flex items-center gap-3 h-auto py-0 px-0 justify-start">
      <Icon />
      <div className="text-left space-y-1">
        <div className="flex flex-nowrap gap-2 items-center">
          <span className="font-semibold block">
            {row.original.package.name}
          </span>
          <div className="font-mono leading-none mt-px">
            {row.original.package.version}
          </div>
        </div>
        <span className="text-xs text-muted-foreground block">
          {description}
        </span>
      </div>
    </div>
  );
}

export function ConformanceCell<T extends ColumnData>({
  row,
}: {
  row: Row<T>;
}) {
  const results: ConformanceResult[] = row.getValue('results');

  if (!results || results.length === 0) {
    return (
      <span className="text-muted-foreground">No conformance results</span>
    );
  }

  const passCount = results.filter(
    (result) => result.status === Status.Pass,
  ).length;
  const failCount = results.filter(
    (result) => result.status === Status.Fail,
  ).length;
  const warnCount = results.filter(
    (result) => result.status === Status.Warn,
  ).length;

  return (
    <div className="flex gap-2 items-center">
      <div className="h-1.5 flex rounded-full overflow-hidden min-w-32 grow">
        {failCount > 0 ? (
          <div
            className="h-full bg-destructive"
            style={{
              flexBasis: `${(failCount / results.length) * 100}%`,
            }}
          />
        ) : undefined}
        {warnCount > 0 ? (
          <div
            className="h-full bg-yellow-500"
            style={{
              flexBasis: `${(warnCount / results.length) * 100}%`,
            }}
          />
        ) : undefined}
        {passCount > 0 ? (
          <div
            className="h-full bg-success"
            style={{
              flexBasis: `${(passCount / results.length) * 100}%`,
            }}
          />
        ) : undefined}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="flex gap-4 overflow-hidden shrink">
            <div className="font-mono flex gap-4 shrink-0">
              <span
                className={cn('shrink-0 flex flex-nowrap items-center gap-1', {
                  'text-desructive': failCount > 0,
                  'text-muted-foreground': failCount === 0,
                })}
              >
                <X className="h-4 w-4" />
                {failCount}
              </span>
              <span
                className={cn('shrink-0 flex flex-nowrap items-center gap-1', {
                  'text-yellow-500': warnCount > 0,
                  'text-muted-foreground': warnCount === 0,
                })}
              >
                <AlertTriangle className="h-4 w-4" />
                {warnCount}
              </span>
              <span
                className={cn('shrink-0 flex flex-nowrap items-center gap-1', {
                  'text-success': passCount > 0,
                  'text-muted-foreground': passCount === 0,
                })}
              >
                <Check className="h-4 w-4" />
                {passCount}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="end">
          <ScrollArea className="flex flex-col max-h-[500px]">
            <div className="p-4 flex flex-col gap-4">
              {results.map((result) => {
                const getIcon = () => {
                  switch (result.status) {
                    case Status.Pass: {
                      return (
                        <span className="text-success font-mono font-medium items-center flex flex-nowrap gap-2">
                          <Check className="h-4 w-4" />
                          pass
                        </span>
                      );
                    }
                    case Status.Warn: {
                      return (
                        <span className="text-yellow-500 font-mono font-medium items-center flex flex-nowrap gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          warn
                        </span>
                      );
                    }
                    case Status.Fail: {
                      return (
                        <span className="text-destructive font-mono font-medium items-center flex flex-nowrap gap-2">
                          <X className="h-4 w-4" />
                          pass
                        </span>
                      );
                    }
                  }
                };

                return (
                  <div className="flex gap-3">
                    <div>{getIcon()}</div>
                    <div className="grid gap-1">
                      <span className="text-sm">{result.message.title}</span>

                      {result.message.filepath ? (
                        <p className="text-muted-foreground font-mono text-xs">
                          {result.message.filepath}
                        </p>
                      ) : undefined}
                      {result.message.context ? (
                        <div className="bg-muted border border-border rounded-md overflow-auto">
                          <pre className="px-1">
                            <code className="text-muted-foreground font-mono text-xs">
                              {result.message.context}
                            </code>
                          </pre>
                        </div>
                      ) : undefined}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
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
    <Table className="table-auto relative">
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
