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
  Accordion,
  AccordionItem,
  AccordionContent,
} from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { Status, formatTagName } from '@commonalityco/utils-core';
import { getIconForPackage } from '@commonalityco/utils-core/ui';
import { ConformanceResult, Package } from '@commonalityco/types';
import { ChevronDown, Plus, X } from 'lucide-react';
import { CheckContent, CheckTitle, FilterTitle, StatusCount } from '.';
import { getStatusForResults } from '../utils';

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
  const pkg: Package = row.original.package;
  const description = pkg.description || 'No description';

  const Icon = getIconForPackage(pkg.type);

  return (
    <div className="flex items-center gap-3 h-auto py-0 px-0 justify-start">
      <Icon />
      <div className="text-left space-y-1">
        <div className="flex flex-nowrap gap-2 items-center">
          <span className="font-semibold block">{pkg.name}</span>
          <div className="font-mono leading-none mt-px">{pkg.version}</div>
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
  const resultsForPackage = results.filter(
    (result) => result.package.name === row.original.package.name,
  );

  if (!resultsForPackage || resultsForPackage.length === 0) {
    return <span className="text-muted-foreground">No checks for package</span>;
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

  const resultsForPackageByFilter: Record<string, ConformanceResult[]> = {};
  for (const result of resultsForPackage) {
    const filter = result.filter;
    const existingResultsForFilter = resultsForPackageByFilter[filter];

    if (existingResultsForFilter) {
      existingResultsForFilter.push(result);
    } else {
      resultsForPackageByFilter[filter] = [result];
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="h-1.5 flex rounded-full overflow-hidden min-w-[100px] grow">
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
            <StatusCount
              failCount={failCount}
              warnCount={warnCount}
              passCount={passCount}
            />
            <ChevronDown className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="end">
          <ScrollArea className="flex flex-col max-h-[500px]">
            <div className="p-4 grid flex-col gap-4">
              {Object.entries(resultsForPackageByFilter).map(
                ([filter, resultsForFilter]) => {
                  const status = getStatusForResults(resultsForFilter);

                  return (
                    <Accordion
                      key={filter}
                      type="multiple"
                      className="w-full overflow-hidden"
                    >
                      <FilterTitle filter={filter} status={status} />
                      {resultsForFilter.map((result) => {
                        const key = `${result.name}-${result.package.name}`;

                        return (
                          <AccordionItem key={key} value={key}>
                            <CheckTitle result={result} />
                            <AccordionContent>
                              <CheckContent result={result} />
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  );
                },
              )}
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
