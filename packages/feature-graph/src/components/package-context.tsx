'use client';
import {
  Badge,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Label,
  ScrollArea,
  Separator,
  cn,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@commonalityco/ui-design-system';
import { Status } from '@commonalityco/utils-core';
import { GradientFade, getIconForPackage } from '@commonalityco/ui-core';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { getConformanceScore } from '@commonalityco/utils-conformance/get-conformance-score';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  PackageCheck,
} from 'lucide-react';
import { ResponsivePie } from '@nivo/pie';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

const StatusSortValue = {
  [Status.Pass]: 2,
  [Status.Warn]: 1,
  [Status.Fail]: 0,
};

const columns: ColumnDef<ConformanceResult>[] = [
  {
    accessorKey: 'status',
    maxSize: 100,
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <Button
          variant="link"
          onClick={() => column.toggleSorting(isSorted === 'asc')}
          className="text-muted-foreground hover:text-primary px-0 hover:no-underline"
        >
          Status
          {!isSorted || isSorted === 'asc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status: Status = row.getValue('status');

      return (
        <div
          className={cn('font-mono font-medium', {
            'text-destructive': status === Status.Fail,
            'text-warning': status === Status.Warn,
            'text-success': status === Status.Pass,
          })}
        >
          {status}
        </div>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const statusA = rowA.original.status;
      const statusB = rowB.original.status;
      const statusAValue = StatusSortValue[statusA];
      const statusBValue = StatusSortValue[statusB];

      return statusAValue - statusBValue;
    },
  },
  {
    id: 'selector',
    header: 'Selector',
    accessorFn: (row) => row.filter,
    cell: ({ row }) => {
      const selector: string = row.getValue('selector');

      if (selector !== '*') {
        return <Badge variant="secondary">{selector}</Badge>;
      }

      return <p className="truncate">All packages</p>;
    },
  },
  {
    id: 'message',
    header: 'Message',
    accessorFn: (row) => row.message.message,
  },
];

export function ConformanceTable({ data }: { data: ConformanceResult[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="px-2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={cn({
                        '@xl:table-cell hidden': header.id === 'selector',
                      })}
                      key={header.id}
                      style={{
                        width:
                          header.getSize() === 100
                            ? header.getSize()
                            : undefined,
                      }}
                    >
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
                    <TableCell
                      key={cell.id}
                      className={cn({
                        '@xl:table-cell hidden': cell.column.id === 'selector',
                      })}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export function PackageContext({
  pkg,
  checkResults,
  codeownersData,
  tagsData,
  headerContent,
}: {
  pkg: Package;
  checkResults: ConformanceResult[];
  codeownersData: CodeownersData[];
  tagsData: TagsData[];
  headerContent: React.ReactNode;
}) {
  const packageResults = checkResults.filter(
    (result) => result.package.name === pkg.name,
  );
  const tags = tagsData.find((tag) => tag.packageName === pkg.name)?.tags ?? [];
  const Icon = getIconForPackage(pkg.type);

  const codeowners =
    codeownersData.find((data) => data.packageName === pkg.name)?.codeowners ??
    [];

  const passCount = packageResults.filter(
    (result) => result.status === Status.Pass,
  ).length;
  const warnCount = packageResults.filter(
    (result) => result.status === Status.Warn,
  ).length;
  const failCount = packageResults.filter(
    (result) => result.status === Status.Fail,
  ).length;

  const isTotalCount =
    passCount === packageResults.length ||
    warnCount === packageResults.length ||
    failCount === packageResults.length;
  return (
    <div className="@container flex h-full flex-col pt-4">
      <div className="mb-2 flex flex-nowrap items-center justify-between gap-3 pr-4">
        <Icon className="h-8 w-8" />
        {headerContent}
      </div>
      <p className="min-w-0 text-xl font-semibold">{pkg.name}</p>
      <ScrollArea className="h-full pr-4">
        <GradientFade placement="top" />
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4">
          <Label className="leading-1.5 text-muted-foreground">
            Description
          </Label>
          {pkg.description ? (
            <p>{pkg.description}</p>
          ) : (
            <p className="text-muted-foreground">No description</p>
          )}
          <Label className="leading-1.5 text-muted-foreground">Version</Label>
          <p>{pkg.version}</p>
          <Label className="leading-1.5 text-muted-foreground">
            Codeowners
          </Label>
          <div className="flex gap-2">
            {codeowners.length > 0 ? (
              codeowners.map((codeowner) => (
                <Badge
                  variant="outline"
                  className="rounded-full"
                  key={codeowner}
                >
                  {codeowner}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">No codeowners</span>
            )}
          </div>
          <Label className="leading-1.5 text-muted-foreground">Tags</Label>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <Badge variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Separator className="my-6" />
        <Label className="mb-4 inline-block">Checks</Label>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <Card className="col-span-2 flex flex-row items-center justify-start shadow-none">
            <div className="grow px-4 py-2">
              <Label className="mb-1 inline-block">Conformance</Label>
              <p className="text-muted-foreground">
                {packageResults.length > 0
                  ? `${packageResults.length} checks`
                  : 'No checks configured'}
              </p>
            </div>
            <div className="flex flex-nowrap items-center gap-2">
              <p className="text-2xl font-semibold">{`${getConformanceScore(packageResults)}%`}</p>
              <div className="h-16 w-16 p-3">
                <ResponsivePie
                  isInteractive={false}
                  innerRadius={0.8}
                  padAngle={isTotalCount ? 0 : 3}
                  cornerRadius={6}
                  enableArcLabels={false}
                  enableArcLinkLabels={false}
                  colors={{ datum: 'data.color' }}
                  data={[
                    {
                      id: 'fail',
                      value: failCount,
                      color: 'hsl(var(--destructive))',
                    },
                    {
                      id: 'warn',
                      value: warnCount,
                      color: 'hsl(var(--warning))',
                    },
                    {
                      id: 'pass',
                      value: passCount,
                      color: 'hsl(var(--success))',
                    },
                  ]}
                />
              </div>
            </div>
          </Card>
          <Card className="flex flex-row items-center justify-start px-4 py-2 shadow-none">
            <Label className="inline-block grow">Warnings</Label>
            <p
              className={cn('text-right text-2xl font-semibold', {
                'text-warning': warnCount > 0,
                'text-muted-foreground': warnCount === 0,
              })}
            >
              {warnCount}
            </p>
          </Card>
          <Card className="flex flex-row items-center justify-start px-4 py-2 shadow-none">
            <Label className="inline-block grow">Failures</Label>
            <p
              className={cn('text-right text-2xl font-semibold', {
                'text-destructive': failCount > 0,
                'text-muted-foreground': failCount === 0,
              })}
            >
              {failCount}
            </p>
          </Card>
          <div className="col-span-2">
            <ConformanceTable data={packageResults} />
          </div>
        </div>
        {packageResults.length === 0 && (
          <Card variant="secondary">
            <CardHeader>
              <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
                <div className="bg-secondary rounded-full p-1.5">
                  <PackageCheck className="h-5 w-5" />
                </div>
              </div>

              <CardTitle>Codify your best practices</CardTitle>
              <CardDescription>
                Scale a consistently amazing developer experience with dynamic
                conformance checks that are run like tests and shared like lint
                rules.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <a
                  href="https://docs.commonality.co/checks"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                  <ExternalLink className="ml-1 h-3 w-3 -translate-y-px" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        )}
        <GradientFade placement="bottom" />
      </ScrollArea>
    </div>
  );
}
