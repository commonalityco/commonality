import React from 'react';
import { render } from '@testing-library/react';
import PackagesTablePaginator from '../src/packages-table-paginator.js';
import { describe, test, expect } from 'vitest';

describe('PackagesTablePaginator', () => {
  test('disables the previous button on the first page', () => {
    const { getByText } = render(
      <PackagesTablePaginator
        totalCount={100}
        pageCount={10}
        page={1}
        onNext={() => {}}
        onPrevious={() => {}}
        onPageCountChange={() => {}}
      />,
    );

    expect(getByText('Previous').closest('button')).toBeDisabled();
  });

  test('disables the next button on the last page', () => {
    const { getByText } = render(
      <PackagesTablePaginator
        totalCount={100}
        pageCount={10}
        page={10}
        onNext={() => {}}
        onPrevious={() => {}}
        onPageCountChange={() => {}}
      />,
    );

    expect(getByText('Next').closest('button')).toBeDisabled();
  });

  test('shows "1-<pageCount>" on the first page', () => {
    const { getByText } = render(
      <PackagesTablePaginator
        totalCount={100}
        pageCount={10}
        page={1}
        onNext={() => {}}
        onPrevious={() => {}}
        onPageCountChange={() => {}}
      />,
    );

    expect(getByText('1 - 10 of 100')).toBeInTheDocument();
  });

  test('shows "<count>-<totalCount>" on the last page even if the pageCount is higher than the totalCount', () => {
    const { getByText } = render(
      <PackagesTablePaginator
        totalCount={95}
        pageCount={10}
        page={10}
        onNext={() => {}}
        onPrevious={() => {}}
        onPageCountChange={() => {}}
      />,
    );

    expect(getByText('91 - 95 of 95')).toBeInTheDocument();
  });
});
