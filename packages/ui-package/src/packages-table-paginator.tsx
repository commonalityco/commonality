import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@commonalityco/ui-design-system';
import { ChevronDown } from 'lucide-react';
import React from 'react';

export function PackagesTablePaginator({
  totalCount,
  pageCount,
  page,
  onNext,
  onPrevious,
  onPageCountChange,
}: {
  totalCount: number;
  pageCount: number;
  page: number;
  onNext: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onPrevious: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onPageCountChange: (pageCount: string) => void;
}) {
  const isFirstPage = page === 0;
  const isLastPage = (page + 1) * pageCount > totalCount;
  const from = page * pageCount + 1;
  const to =
    (page + 1) * pageCount > totalCount
      ? totalCount
      : page * pageCount + pageCount;

  return (
    <div className="flex items-center justify-between">
      <div>
        {totalCount ? (
          <p className="text-muted-foreground">{`${from} - ${to} of ${totalCount}`}</p>
        ) : undefined}
      </div>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1">
              {`Packages per page: ${pageCount}`}{' '}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={String(pageCount)}
              onValueChange={(value) => onPageCountChange(value)}
            >
              <DropdownMenuRadioItem value="25">
                25 packages
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="50">
                50 packages
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="100">
                100 packages
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" disabled={isFirstPage} onClick={onPrevious}>
          Previous
        </Button>
        <Button variant="outline" disabled={isLastPage} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default PackagesTablePaginator;
