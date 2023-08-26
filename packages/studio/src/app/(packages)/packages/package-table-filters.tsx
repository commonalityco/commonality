'use client';
import { Input } from '@commonalityco/ui-design-system';
import React from 'react';
import TagsFilterButton from './tags-filter-button';
import CodeownersFilterButton from './codeowners-filter-button';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useQueryParams } from 'hooks/use-query-params';
import { debounce } from 'utils/debounce';

function PackageTableFilters({
  tags,
  codeowners,
}: {
  tags: string[];
  codeowners: string[];
}) {
  const { query, setQuery, deleteQuery } = useQueryParams();

  const setNameQuery = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value) {
        setQuery('name', event.target.value);
      } else {
        deleteQuery('name');
      }
    },
    100,
  );

  const setTagsQuery = (selectedTags: string[]) => {
    if (selectedTags.length) {
      setQuery('tags', selectedTags);
    } else {
      deleteQuery('tags');
    }
  };

  const setCodeownersQuery = (event: React.ChangeEvent<HTMLInputElement>) => {};

  const queryTags = query.getAll('tags');

  return (
    <>
      <Input
        placeholder="Search packages..."
        defaultValue={query.get('name') ?? undefined}
        onChange={setNameQuery}
      />
      <TagsFilterButton
        tags={tags}
        onChange={setTagsQuery}
        defaultSelectedTags={queryTags.length ? queryTags : undefined}
      />
      <CodeownersFilterButton codeowners={codeowners} />
    </>
  );
}

export default PackageTableFilters;
