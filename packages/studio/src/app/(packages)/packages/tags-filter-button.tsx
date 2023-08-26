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

export function TagsFilterButton({
  tags,
  onChange,
  defaultSelectedTags,
}: {
  tags: string[];
  defaultSelectedTags?: string[];
  onChange: (selectedTags: string[]) => void;
}) {
  const [value, setValue] = useState<string[]>(defaultSelectedTags ?? tags);

  const handleCheckedChange = ({
    checked,
    tag,
  }: {
    checked: boolean;
    tag: string;
  }) => {
    const newTags = checked
      ? Array.from(new Set([...value, tag]))
      : value.filter((selectedTag) => selectedTag !== tag);

    setValue(newTags);
    onChange(newTags);
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
                onSelect={(event) => event.preventDefault()}
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
