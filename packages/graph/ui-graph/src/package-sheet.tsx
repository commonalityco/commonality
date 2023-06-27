'use client';
import {
  Label,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tag,
  Snippet,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  CreatebleSelect,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  cn,
} from '@commonalityco/ui-design-system';
import { ComponentProps, useMemo, useState } from 'react';
import type { Package } from '@commonalityco/types';
import type cytoscape from 'cytoscape';
import { Markdown } from '@commonalityco/ui-documentation';
import { GradientFade } from '@commonalityco/ui-core';
import { Check, File, Tags, Users, FileText } from 'lucide-react';
import { getIconForPackage } from '@commonalityco/utils-package';
import ReactWrapBalancer from 'react-wrap-balancer';

interface PackageSheetProps extends ComponentProps<typeof Sheet> {
  node?: Partial<cytoscape.NodeSingular> & { data: () => Package };
  allTags: string[];
  onSetTags: (options: { tags: string[]; packageName: string }) => void;
}

function TagsButton({
  pkgTags = [],
  allTags = [],
  onSetTags = () => {},
  packageName,
}: {
  onSetTags: (options: { tags: string[]; packageName: string }) => void;
  pkgTags: string[];
  allTags: string[];
  packageName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredTags = useMemo(() => {
    const newFilteredTags = allTags.filter((tag) => tag.includes(search));

    if (!newFilteredTags.length) {
      return [search];
    }
    return newFilteredTags;
  }, [search, allTags]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full flex-wrap justify-start gap-2 px-2"
        >
          {pkgTags.length ? (
            pkgTags.map((tag) => <Tag key={tag} use="outline">{`#${tag}`}</Tag>)
          ) : (
            <p className="pl-1 text-muted-foreground">No tags</p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="left" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search tags..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>
            <CommandItem>Create</CommandItem>
          </CommandEmpty>
          <CommandGroup>
            {filteredTags.map((tag) => (
              <CommandItem
                key={tag}
                value={tag}
                onSelect={(value) => {
                  const isSelected = pkgTags.includes(value);

                  const newTags = isSelected
                    ? pkgTags.filter((pkgTag) => pkgTag !== tag)
                    : [...pkgTags, tag];
                  console.log({ newTags });
                  return onSetTags({ tags: newTags, packageName });
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    pkgTags.includes(tag) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {`#${tag}`}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function PackageSheet(props: PackageSheetProps) {
  if (!props.node) {
    return null;
  }

  const pkg: Package = props.node.data();
  const Icon = getIconForPackage(pkg);

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-2 p-0 sm:max-w-[300px] md:max-w-[550px]">
        <SheetHeader className="px-6 pt-6">
          <p className="text-xs text-muted-foreground">Package</p>
          <SheetTitle>
            <Icon className="mr-2 inline-block h-5 w-5" />
            <span>{pkg.name}</span>
            <span className="pl-2 align-baseline font-mono">{pkg.version}</span>
          </SheetTitle>
          {pkg.description && (
            <SheetDescription>{pkg.description}</SheetDescription>
          )}
        </SheetHeader>
        <ScrollArea className="h-full px-6">
          <GradientFade placement="top" />
          <div className="grid gap-2">
            <div>
              <Label className="flex">
                <Tags className="inline-block h-5 w-5 pr-1" />
                Tags
              </Label>
              <div className="w-full">
                {pkg.tags && (
                  <TagsButton
                    pkgTags={pkg.tags}
                    allTags={props.allTags}
                    packageName={pkg.name}
                    onSetTags={props.onSetTags}
                  />
                )}
              </div>
            </div>
            <div>
              <Label>
                <Users className="inline-block h-5 w-5 pr-1" />
                Owners
              </Label>
              {pkg.owners && pkg.owners.length ? (
                pkg.owners.join(', ')
              ) : (
                <p className="pl-1 text-muted-foreground">No owners</p>
              )}
            </div>
          </div>
          <div className="pt-6">
            <div>
              <div>
                {pkg.docs?.readme ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <File className="inline-block h-5 w-5 pr-1 align-sub" />
                        {pkg.docs.readme.filename}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Markdown>{pkg.docs.readme.content}</Markdown>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <File className="inline-block h-5 w-5 pr-1 align-sub" />
                        README
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center gap-3 text-center">
                      <FileText className="mx-auto h-6 w-6" />
                      <p className="text-xs text-muted-foreground">
                        <ReactWrapBalancer>
                          Create a README.md to help your team understand what
                          this package does
                        </ReactWrapBalancer>
                      </p>
                      <Button variant="secondary" size="sm" className="w-full">
                        Create README
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
          <GradientFade placement="bottom" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
