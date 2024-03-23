'use client';
import {
  Card,
  Label,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Button,
  cn,
  Badge,
  Separator,
  ScrollArea,
} from '@commonalityco/ui-design-system';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { PackageManager, Status } from '@commonalityco/utils-core';
import { ResponsivePie } from '@nivo/pie';
import {
  BunLogo,
  GradientFade,
  NpmLogo,
  PnpmLogo,
  YarnLogo,
} from '@commonalityco/ui-core';
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
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const StatusSortValue = {
  [Status.Pass]: 2,
  [Status.Warn]: 1,
  [Status.Fail]: 0,
};

const IconByPackageManager = {
  [PackageManager.NPM]: NpmLogo,
  [PackageManager.PNPM]: PnpmLogo,
  [PackageManager.YARN]: YarnLogo,
  [PackageManager.BUN]: BunLogo,
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
    sortingFn: (rowA, rowB) => {
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
        return (
          <Badge variant="secondary" className="font-mono">
            {selector}
          </Badge>
        );
      }

      return <p className="truncate">All packages</p>;
    },
  },
  {
    id: 'message',
    accessorFn: (row) => row.message.message,
    header: 'Message',
    cell: ({ row }) => (
      <div>
        <p className="text-muted-foreground text-xs">
          {row.original.package?.name}
        </p>
        <p>{row.getValue('message')}</p>
      </div>
    ),
  },
];

function ProjectConformanceTable({ data }: { data: ConformanceResult[] }) {
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
    <div className="col-span-2">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn({
                        '@xl:table-cell hidden': header.id === 'selector',
                      })}
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
    </div>
  );
}

export function ProjectContext({
  packageCount,
  projectName,
  packageManager = PackageManager.NPM,
  checkCount,
  score,
  checkPassCount,
  checkWarnCount,
  checkFailCount,
  checkResults,
  constraintPassCount,
  constraintFailCount,
}: {
  packageManager: PackageManager;
  projectName: string;
  packageCount: number;
  checkCount: number;
  score: number;
  constraintPassCount: number;
  constraintFailCount: number;
  checkFailCount: number;
  checkWarnCount: number;
  checkPassCount: number;
  checkResults: ConformanceResult[];
}) {
  const PackageManagerIcon = IconByPackageManager[packageManager];
  const total = checkPassCount + checkWarnCount + checkFailCount;
  const isTotalCount =
    checkPassCount === total ||
    checkWarnCount === total ||
    checkFailCount === total;

  return (
    <div className="@container flex h-full flex-col pt-4">
      <PackageManagerIcon className="mb-2 h-8 w-8" />
      <p className="min-w-0 text-xl font-semibold">{projectName}</p>
      <ScrollArea className="h-full pr-4">
        <GradientFade placement="top" className="z-50" />
        <Label className="mb-4 inline-block">Constraints</Label>
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex grow flex-row items-center justify-start px-4 py-2 shadow-none">
            <Label className="inline-block grow">Valid</Label>
            <p
              className={cn('text-right text-2xl font-semibold', {
                'text-success': constraintPassCount > 0,
                'text-muted-foreground': constraintPassCount === 0,
              })}
            >
              {constraintPassCount}
            </p>
          </Card>
          <Card className="flex grow flex-row items-center justify-start px-4 py-2 shadow-none">
            <Label className="inline-block grow">Invalid</Label>
            <p
              className={cn('text-right text-2xl font-semibold', {
                'text-destructive': constraintFailCount > 0,
                'text-muted-foreground': constraintFailCount === 0,
              })}
            >
              {constraintFailCount}
            </p>
          </Card>
        </div>
        <Separator className="my-4" />
        <Label className="mb-4 inline-block">Checks</Label>
        <div className="grid gap-4">
          <Card className="col-span-2 flex flex-row items-center justify-start shadow-none">
            <div className="grow px-4 py-2">
              <Label className="mb-1 inline-block">Conformance</Label>
              <p className="text-muted-foreground">
                {checkCount > 0
                  ? `${checkCount} checks`
                  : 'No checks configured'}
              </p>
            </div>
            <div className="flex flex-nowrap items-center gap-2">
              <p className="text-2xl font-semibold">{`${score}%`}</p>
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
                      value: checkFailCount,
                      color: 'hsl(var(--destructive))',
                    },
                    {
                      id: 'warn',
                      value: checkWarnCount,
                      color: 'hsl(var(--warning))',
                    },
                    {
                      id: 'pass',
                      value: checkPassCount,
                      color: 'hsl(var(--success))',
                    },
                  ]}
                />
              </div>
            </div>
          </Card>

          <Card className="flex grow flex-row items-center justify-start px-4 py-2 shadow-none">
            <Label className="inline-block grow">Warnings</Label>
            <p
              className={cn('text-right text-2xl font-semibold', {
                'text-warning': checkWarnCount > 0,
                'text-muted-foreground': checkWarnCount === 0,
              })}
            >
              {checkWarnCount}
            </p>
          </Card>
          <Card className="flex grow flex-row items-center justify-start px-4 py-2 shadow-none">
            <Label className="inline-block grow">Failures</Label>
            <p
              className={cn('text-right text-2xl font-semibold', {
                'text-destructive': checkFailCount > 0,
                'text-muted-foreground': checkFailCount === 0,
              })}
            >
              {checkFailCount}
            </p>
          </Card>

          <ProjectConformanceTable data={checkResults} />
        </div>
        <GradientFade placement="bottom" className="z-50" />
      </ScrollArea>
    </div>
  );
}
