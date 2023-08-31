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
  CellContext,
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
  Button,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@commonalityco/ui-design-system';
import { useState } from 'react';
import {
  DocumentName,
  PackageType,
  formatTagName,
} from '@commonalityco/utils-core';
import { getIconForPackage } from '@commonalityco/utils-package';
import { Document, Package } from '@commonalityco/types';
import { File, FileDigit, FileText } from 'lucide-react';

export type ColumnData = Package & {
  codeowners: string[];
  tags: string[];
  documents: Document[];
};

export type PackageTableColumns = ColumnDef<ColumnData>[];

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

export function NameCell({ row }: CellContext<ColumnData, unknown>) {
  const name: PackageType = row.getValue('name');
  const type = row.original.type;
  const description = row.original.description || 'No description';

  const Icon = getIconForPackage(type);

  return (
    <Button
      asChild
      variant="link"
      className="gap-2 group hover:no-underline h-auto py-0 px-0 w-full justify-start"
    >
      <div>
        <Icon />
        <div className="text-left space-y-2">
          <div className="flex flex-nowrap gap-2 items-center">
            <span className="font-semibold block group-hover:underline">
              {name}
            </span>
            <div className="font-mono leading-none mt-px">
              {row.original.version}
            </div>
          </div>
          <span className="text-xs text-muted-foreground block group-hover:no-underline">
            {description}
          </span>
        </div>
      </div>
    </Button>
  );
}

export function DocumentsCell({
  row,
  onDocumentOpen,
}: CellContext<ColumnData, unknown> & {
  onDocumentOpen: (filePath: string) => Promise<void>;
}) {
  const documents: Document[] = row.getValue('documents');
  const readme = documents.find((doc) => doc.filename === DocumentName.README);
  const changelog = documents.find(
    (doc) => doc.filename === DocumentName.CHANGELOG,
  );
  const extraDocs = documents.filter(
    (doc) =>
      doc.filename !== DocumentName.README &&
      doc.filename !== DocumentName.CHANGELOG,
  );

  return (
    <div className="flex flex-nowrap gap-2 items-center">
      {readme ? (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onDocumentOpen(readme.path)}
              >
                <FileText className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Open </span>
              <span className="font-mono font-medium">README.md</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
      {changelog ? (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onDocumentOpen(changelog.path)}
              >
                <FileDigit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Open </span>
              <span className="font-mono font-medium">CHANGELOG.md</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
      {extraDocs.length ? (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Button
              variant="link"
              className="px-0"
            >{`+ ${extraDocs.length} document(s)`}</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            {extraDocs.map((document) => (
              <Button
                className="w-full justify-start"
                variant="ghost"
                key={document.filename}
              >
                {document.filename}
              </Button>
            ))}
          </HoverCardContent>
        </HoverCard>
      ) : null}
    </div>
  );
}

export function TagsCell({ row }: CellContext<ColumnData, unknown>) {
  const tags: string[] = row.getValue('tags');

  return (
    <div className="flex gap-1">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {formatTagName(tag)}
        </Badge>
      ))}
    </div>
  );
}

export function CodeownersCell({ row }: CellContext<ColumnData, unknown>) {
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
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tags: string[];
  codeowners: string[];
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
    <Table className="table-fixed relative">
      <TableHeader className="sticky top-0 z-10">
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
