'use client';
import {
  Label,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  CreatebleSelect,
} from '@commonalityco/ui-design-system';
import { ComponentProps, useMemo, useState } from 'react';
import type {
  CodeownersData,
  DocumentsData,
  Package,
  TagsData,
} from '@commonalityco/types';
import { Markdown, GradientFade } from '@commonalityco/ui-core';
import { File, FileText, Plus } from 'lucide-react';
import { getIconForPackage } from '@commonalityco/utils-package';
import ReactWrapBalancer from 'react-wrap-balancer';
import sortBy from 'lodash.sortby';
import { formatTagName } from '@commonalityco/utils-core';

interface PackageSheetProps extends ComponentProps<typeof Sheet> {
  pkg?: Package;
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
  documentsData: DocumentsData[];
  onSetTags: (options: { tags: string[]; packageName: string }) => void;
}

function TagsButton({
  pkgTags = [],
  allTags = [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSetTags = () => {},
  packageName,
}: {
  onSetTags: (options: { tags: string[]; packageName: string }) => void;
  pkgTags: string[];
  allTags: string[];
  packageName: string;
}) {
  return (
    <Popover onOpenChange={() => console.log('changed')} modal>
      {pkgTags.length ? (
        <PopoverTrigger>
          <div className="flex flex-wrap gap-1">
            {pkgTags.map((tag) => (
              <Badge variant="secondary" key={tag}>{`#${tag}`}</Badge>
            ))}
          </div>
        </PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <Button variant="link" className="text-muted-foreground px-0">
            <Plus className="h-3 w-3" />
            <span className="text-xs">Add tags</span>
          </Button>
        </PopoverTrigger>
      )}

      <PopoverContent className="w-[240px] p-0" align="start" side="left">
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
          formatCreateLabel={(inputValue) => {
            return `Create ${formatTagName(inputValue)}`;
          }}
          value={pkgTags.map((pkgTag) => ({
            label: formatTagName(pkgTag),
            value: pkgTag,
          }))}
          onChange={(options) => {
            const tags = options.map((opt) => opt.value);
            onSetTags({ packageName, tags });
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

function PackageSheetContent({
  pkg,
  tagsData,
  documentsData,
  codeownersData,
  onSetTags,
}: {
  pkg: Package;
  documentsData: PackageSheetProps['documentsData'];
  tagsData: PackageSheetProps['tagsData'];
  codeownersData: PackageSheetProps['codeownersData'];
  onSetTags: PackageSheetProps['onSetTags'];
}) {
  const Icon = getIconForPackage(pkg);

  const tagDataForPkg = useMemo(() => {
    return tagsData.find((data) => data.packageName === pkg.name);
  }, [pkg, tagsData]);

  const ownerDataForPkg = useMemo(() => {
    return codeownersData.find((data) => data.packageName === pkg.name);
  }, [pkg, codeownersData]);

  const allTags: string[] = useMemo(() => {
    if (tagsData.length === 0) {
      return [];
    }

    const uniqueTags = [
      ...new Set(
        tagsData
          ?.map((data) => data.tags)
          .flat()
          .filter(Boolean)
      ),
    ];

    return sortBy(uniqueTags, (item) => item);
  }, [tagsData]);

  const documentsForPkg = useMemo(() => {
    return documentsData.find((data) => data.packageName === pkg.name);
  }, [documentsData]);

  const readmeDocument = documentsForPkg?.documents.find((doc) => doc.isReadme);

  return (
    <>
      <SheetHeader className="px-6 pt-6">
        <p className="text-muted-foreground text-xs">Package</p>
        <SheetTitle>
          <Icon className="mr-2 inline-block h-5 w-5" />
          <span>{pkg.name}</span>
          <span className="pl-2 align-baseline font-mono">{pkg.version}</span>
        </SheetTitle>
        {pkg.description && (
          <SheetDescription>{pkg.description}</SheetDescription>
        )}
      </SheetHeader>
      <ScrollArea className="h-full">
        <GradientFade placement="top" />
        <div className="grid gap-4 px-6">
          <div>
            <Label className="mb-2">Tags</Label>
            <div className="w-full">
              <TagsButton
                pkgTags={tagDataForPkg?.tags ?? []}
                allTags={allTags}
                packageName={pkg.name}
                onSetTags={onSetTags}
              />
            </div>
          </div>
          <div>
            <Label className="mb-2">Owners</Label>
            <div>
              {ownerDataForPkg?.codeowners.length ? (
                <div className="flex flex-wrap gap-1">
                  {ownerDataForPkg.codeowners.map((codeowner) => (
                    <Badge
                      key={codeowner}
                      className="rounded-full"
                      variant="outline"
                    >
                      {codeowner}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-xs">No owners</p>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 pt-6">
          <div>
            <div>
              {readmeDocument ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <File className="inline-block h-5 w-5 pr-1 align-sub" />
                      <span className="font-mono">
                        {readmeDocument.filename}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Markdown>{readmeDocument.content}</Markdown>
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
                    <p className="text-muted-foreground text-xs">
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
    </>
  );
}

export function PackageSheet(props: PackageSheetProps) {
  return (
    <Sheet {...props} open={Boolean(props.pkg)}>
      <SheetContent className="flex flex-col gap-2 p-0 sm:max-w-[300px] md:max-w-[550px]">
        {props.pkg && (
          <PackageSheetContent
            pkg={props.pkg}
            tagsData={props.tagsData}
            documentsData={props.documentsData}
            codeownersData={props.codeownersData}
            onSetTags={props.onSetTags}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
