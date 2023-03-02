import React, { useState } from 'react';
import { Icon } from '@commonalityco/ui-icon';
import clsx from 'clsx';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

export interface PaginatorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onValueChange?: (value: number) => any;
  value?: number;
  pageCount: number;
  pageSize: number;
}

const PageBookendButton = ({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      {...props}
      className={clsx(
        'flex cursor-pointer flex-nowrap items-center justify-center rounded border-none bg-transparent py-2 px-3 text-center font-sans text-sm font-medium no-underline outline-none transition hover:bg-zinc-100 active:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-zinc-400 disabled:hover:bg-transparent disabled:active:bg-transparent',
        className
      )}
    />
  );
};

export function Paginator({
  className,
  onValueChange = () => {},
  pageCount,
  pageSize,
  ...restProps
}: PaginatorProps) {
  const [controlledCurrentPage, setControlledCurrentPage] = useState(0);

  const roundedPageCount = Math.ceil(pageCount);
  const handleChange = (newIndex: number) => {
    setControlledCurrentPage(newIndex);
    onValueChange(newIndex);
  };

  if (!pageCount || !pageSize) {
    return null;
  }

  const getIndicies = () => {
    if (pageCount < pageSize && controlledCurrentPage < pageSize) {
      const filledArray = new Array(pageCount).fill(null);
      return filledArray.map((_value, index) => index);
    } else if (controlledCurrentPage < pageSize) {
      const arr = new Array(pageSize);
      return arr.map((_value, index) => index);
    } else if (controlledCurrentPage > pageCount - pageSize) {
      const arr = new Array(pageSize);
      return arr.map((_value, index) => pageCount - (arr.length - index));
    } else {
      return [
        controlledCurrentPage - 2,
        controlledCurrentPage - 1,
        controlledCurrentPage,
        controlledCurrentPage + 1,
        controlledCurrentPage + 2,
      ];
    }
  };

  const pageNumbers = getIndicies();

  const PageButtons: JSX.Element[] = [];

  pageNumbers.forEach((pageNumber) => {
    PageButtons.push(
      <button
        key={pageNumber}
        className={clsx(
          'mx-0.5 flex h-9 w-9 cursor-pointer appearance-none items-center justify-center rounded border-none font-sans text-sm font-medium outline-none',
          {
            'bg-zinc-100 text-zinc-800': controlledCurrentPage === pageNumber,
            'bg-transparent text-zinc-400 hover:bg-zinc-100 active:bg-zinc-200':
              controlledCurrentPage !== pageNumber,
          }
        )}
        onClick={() => {
          handleChange(pageNumber);
        }}
      >
        {pageNumber + 1}
      </button>
    );
  });

  return (
    <div
      className={clsx(
        'my-2 mx-0 flex w-full flex-wrap items-center justify-center',
        className
      )}
      {...restProps}
    >
      <PageBookendButton
        className="mr-2"
        disabled={controlledCurrentPage === 0}
        onClick={() => {
          handleChange(controlledCurrentPage - 1);
        }}
      >
        <Icon icon={faAngleLeft} size="sm" className="pr-1" />
        <span>Previous</span>
      </PageBookendButton>
      {PageButtons}
      <PageBookendButton
        className="ml-2"
        disabled={controlledCurrentPage === roundedPageCount - 1}
        onClick={() => handleChange(controlledCurrentPage + 1)}
      >
        <span>Next</span>
        <Icon icon={faAngleRight} size="sm" className="pl-1" />
      </PageBookendButton>
    </div>
  );
}
