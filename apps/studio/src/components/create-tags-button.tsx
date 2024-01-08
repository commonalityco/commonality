'use client';
import React from 'react';
import {
  Button,
  CreatebleSelect,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from '@commonalityco/ui-design-system';
import { formatTagName } from '@commonalityco/utils-core';
import { Package, TagsData } from '@commonalityco/types';
import { useMemo } from 'react';
import { setTagsAction } from '@/actions/metadata';
import { Pencil, Plus } from 'lucide-react';

export function CreateTagsButton({
  pkg,
  tagsData,
}: {
  pkg: Package;
  tagsData: TagsData[];
}) {
  const onSetTags = async (tags: string[]) => {
    const configPath = await setTagsAction({ pkg, tags });

    toast.success('Tags updated', {
      description: configPath,
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

    return uniqueTags.sort((a, b) => a.localeCompare(b));
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
        <Button className="space-x-1" size="sm">
          {tagsData.length ? (
            <>
              <Pencil className="h-3 w-3" />
              <span>Edit tags</span>
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" />
              <span>Add tags</span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        onFocusOutside={(e) => e.preventDefault()}
        className="w-[300px] p-0"
        align="end"
      >
        <CreatebleSelect
          variant="inline"
          menuIsOpen={true}
          autoFocus={true}
          isMulti
          blurInputOnSelect={false}
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
            onSetTags(tags);
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
