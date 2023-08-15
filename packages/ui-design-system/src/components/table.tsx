import * as React from 'react';
import { cn } from '../utils/cn';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...properties }, reference) => (
  <div className="w-full overflow-auto">
    <table
      ref={reference}
      className={cn(
        'w-full caption-bottom border-separate border-spacing-0 text-sm',
        className
      )}
      {...properties}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...properties }, reference) => (
  <thead ref={reference} className={cn(className)} {...properties} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...properties }, reference) => (
  <tbody
    ref={reference}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...properties}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...properties }, reference) => (
  <tfoot
    ref={reference}
    className={cn('bg-primary text-primary-foreground font-medium', className)}
    {...properties}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...properties }, reference) => (
  <tr
    ref={reference}
    className={cn(
      'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
      className
    )}
    {...properties}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...properties }, reference) => (
  <th
    ref={reference}
    className={cn(
      'text-muted-foreground bg-secondary h-9 border-y px-4 text-left align-middle text-xs font-medium first:rounded-l-md first:border-l last:rounded-r-md last:border-r [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...properties}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...properties }, reference) => (
  <td
    ref={reference}
    className={cn(
      'border-b p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...properties}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...properties }, reference) => (
  <caption
    ref={reference}
    className={cn('text-muted-foreground mt-4 text-sm', className)}
    {...properties}
  />
));
TableCaption.displayName = 'TableCaption';

const TableHeadSortButton = ({
  children,
  sort,
  ...properties
}: React.HTMLAttributes<HTMLButtonElement> & {
  sort: false | 'asc' | 'desc';
}) => {
  const getSortIcon = () => {
    if (!sort) {
      return <div className="h-4 w-4" />;
    }

    if (sort === 'asc') {
      return <ChevronUp className="h-4 w-4" />;
    }

    if (sort === 'desc') {
      return <ChevronDown className="h-4 w-4" />;
    }
  };

  const sortIcon = getSortIcon();

  return (
    <button
      className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
      {...properties}
    >
      <span>{children}</span>
      {sortIcon}
    </button>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableHeadSortButton,
  TableRow,
  TableCell,
  TableCaption,
};
