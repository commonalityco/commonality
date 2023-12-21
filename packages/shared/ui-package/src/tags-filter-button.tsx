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
import { ChevronsUpDown, ExternalLink, Tags } from 'lucide-react';

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
      ? [...new Set([...value, tag])]
      : value.filter((selectedTag) => selectedTag !== tag);

    setValue(newTags);
    onChange(newTags);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between shrink-0 w-56">
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
        {tags.length > 0 ? (
          tags.map((tag) => {
            return (
              <DropdownMenuCheckboxItem
                key={tag}
                onSelect={(event) => event.preventDefault()}
                checked={value.includes(tag)}
                onCheckedChange={(checked) =>
                  handleCheckedChange({ checked, tag })
                }
              >
                <Badge variant="secondary">{formatTagName(tag)}</Badge>
              </DropdownMenuCheckboxItem>
            );
          })
        ) : (
          <div className="p-3">
            <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
              <div className="bg-secondary rounded-full p-1.5">
                <Tags className="h-5 w-5" />
              </div>
            </div>

            <p className="font-medium mb-1">Get started with tags</p>
            <p className="text-muted-foreground text-xs">
              Add tags to a package to enforce dependency constraints and
              categorize packages in your ecosystem.
            </p>

            <Button asChild variant="secondary" className="w-full mt-3">
              <a
                className="space-x-1"
                target="_blank"
                rel="noopener noreferrer"
                href="https://commonality.co/docs/tags"
              >
                <span>Learn more</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TagsFilterButton;
