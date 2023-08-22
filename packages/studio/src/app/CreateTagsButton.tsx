'use client';
import {
  Button,
  CreatebleSelect,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from '@commonalityco/ui-design-system';
import { formatTagName } from '@commonalityco/utils-core';
import { TagsData, Package } from '@commonalityco/types';
import { sortBy } from 'lodash';
import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { metadataKey, tagsKeys } from '@commonalityco/utils-graph/query-keys';
import { setTagsAction } from 'actions/metadata';
import { getTagsData } from 'data/tags';
import { Plus } from 'lucide-react';

export const getCreateTagsButton = (pkg: Package) => {
  return <CreateTagsButton pkg={pkg} />;
};

function CreateTagsButton({ pkg }: { pkg: Package }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tagsData } = useQuery({
    queryKey: tagsKeys,
    queryFn: () => getTagsData(),
  });

  const onSetTags = async (options: {
    packageName: string;
    tags: string[];
  }) => {
    await setTagsAction(options);

    await queryClient.invalidateQueries({
      queryKey: [metadataKey],
    });
    toast({
      description: 'Successfully updated package configuration',
    });
  };

  const allTags: string[] = useMemo(() => {
    if (!tagsData?.length) {
      return [];
    }

    const uniqueTags = [
      ...new Set(
        tagsData
          ?.map((data) => data.tags)
          .flat()
          .filter(Boolean),
      ),
    ];

    return sortBy(uniqueTags, (item) => item);
  }, [tagsData]);

  const tagDataForPkg = useMemo(() => {
    return tagsData?.find((data) => data.packageName === pkg.name);
  }, [pkg, tagsData]);

  const value = useMemo(() => {
    return tagDataForPkg?.tags.map((pkgTag) => ({
      label: formatTagName(pkgTag),
      value: pkgTag,
    }));
  }, [tagDataForPkg]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="h-auto space-x-1 px-0 py-0">
          {tagDataForPkg?.tags.length ? (
            <>Edit tags</>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add tags</span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="end">
        <CreatebleSelect
          variant="inline"
          menuIsOpen={true}
          autoFocus={true}
          isMulti
          backspaceRemovesValue={false}
          closeMenuOnSelect={false}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          noOptionsMessage={() => 'Start typing to create a new tag'}
          formatCreateLabel={(inputValue) => {
            return `Create ${formatTagName(inputValue)}`;
          }}
          value={value}
          onChange={(options) => {
            const tags = options.map((opt) => opt.value);
            onSetTags({ packageName: pkg.name, tags });
          }}
          options={allTags.map((tag) => ({
            label: formatTagName(tag),
            value: tag,
          }))}
        />
      </PopoverContent>
    </Popover>
  );
}
