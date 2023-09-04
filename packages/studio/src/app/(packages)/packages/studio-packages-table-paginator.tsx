'use client';
import React, { ComponentProps } from 'react';
import { PackagesTablePaginator } from '@commonalityco/ui-package';
import { useQueryParams } from '@/hooks/use-query-params';

function StudioPackagesTablePaginator(
  props: Omit<
    ComponentProps<typeof PackagesTablePaginator>,
    'onNext' | 'onPrevious' | 'onPageCountChange'
  >,
) {
  const { setQuery } = useQueryParams();

  return (
    <PackagesTablePaginator
      {...props}
      onNext={() => setQuery('page', String(props.page + 1))}
      onPrevious={() => setQuery('page', String(props.page - 1))}
      onPageCountChange={(pageCount) => setQuery('pageCount', pageCount)}
    />
  );
}

export default StudioPackagesTablePaginator;
