'use client';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  Badge,
} from '@commonalityco/ui-design-system';
import { useState } from 'react';
import { formatTagName } from '@commonalityco/utils-core';
import { Check, ChevronsUpDown, Tags } from 'lucide-react';

export function TagsFilterButton({ tags }: { tags: string[] }) {
  const [value, setValue] = useState<string[]>(tags);

  const handleCheckedChange = ({
    checked,
    tag,
  }: {
    checked: boolean;
    tag: string;
  }) => {
    if (checked) {
      const newTags = Array.from(new Set([...value, tag]));
      setValue(newTags);
    } else {
      const newTags = value.filter((selectedTag) => selectedTag !== tag);
      setValue(newTags);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={'justify-between'}>
          <div className="flex gap-2 items-center">
            <Tags className="h-4 w-4 text-muted-foreground" />
            <span>Tags</span>
            <Badge
              variant="outline"
              className="rounded-full"
            >{`${value.length}/${tags.length}`}</Badge>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {tags.length ? (
          tags.map((tag) => {
            return (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={value.some((selectedTag) => selectedTag === tag)}
                onCheckedChange={(checked) =>
                  handleCheckedChange({ checked, tag })
                }
              >
                {formatTagName(tag)}
              </DropdownMenuCheckboxItem>
            );
          })
        ) : (
          <div className="py-6 text-center">No tags found</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TagsFilterButton;
