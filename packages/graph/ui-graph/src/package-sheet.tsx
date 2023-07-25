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
  CardDescription,
  CardFooter,
} from '@commonalityco/ui-design-system';
import { ComponentProps, useMemo } from 'react';
import type {
  CodeownersData,
  DocumentsData,
  Package,
  TagsData,
} from '@commonalityco/types';
import { Markdown, GradientFade } from '@commonalityco/ui-core';
import { ExternalLink, File, FileText, Plus, Tags, Users } from 'lucide-react';
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
    <Popover modal>
      {pkgTags.length ? (
        <PopoverTrigger>
          <div className="flex flex-wrap gap-1">
            {pkgTags.map((tag) => (
              <Badge variant="secondary" key={tag}>{`#${tag}`}</Badge>
            ))}
          </div>
        </PopoverTrigger>
      ) : (
        <Card variant="secondary">
          <CardHeader>
            <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-md border">
              <div className="bg-secondary rounded-sm p-1.5">
                <Tags className="h-5 w-5" />
              </div>
            </div>
            <CardTitle>Get started with tags</CardTitle>
            <CardDescription>
              Add tags to a package to enforce dependency constraints, automate
              workflows, and categorize packages in your ecosystem.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex space-x-2">
            <PopoverTrigger asChild>
              <Button>
                <Plus className="h-3 w-3" />
                <span>Add tags</span>
              </Button>
            </PopoverTrigger>
            <Button asChild variant="outline">
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
          </CardFooter>
        </Card>
      )}

      <PopoverContent className="w-[300px] p-0" align="start">
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
      <div className="h-full overflow-auto antialiased">
        <GradientFade placement="top" />
        <div className="space-y-4 px-6">
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="w-full">
              <TagsButton
                pkgTags={tagDataForPkg?.tags ?? []}
                allTags={allTags}
                packageName={pkg.name}
                onSetTags={onSetTags}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Owners</Label>
            <div>
              {ownerDataForPkg?.codeowners?.length ? (
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
                <Card variant="secondary">
                  <CardHeader>
                    <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-md border">
                      <div className="bg-secondary rounded-sm p-1.5">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <CardTitle>Assign a codeowner</CardTitle>
                    <CardDescription>
                      Add tags to a package to enforce dependency constraints,
                      automate workflows, and categorize packages in your
                      ecosystem.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex space-x-2">
                    <Button asChild variant="outline">
                      <a
                        className="space-x-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://commonality.co/docs/codeowners"
                      >
                        <span>Learn more</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
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
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        <GradientFade placement="bottom" />
      </div>
    </>
  );
}

export function PackageSheet(props: PackageSheetProps) {
  return (
    <Sheet {...props} open={Boolean(props.pkg)}>
      <SheetContent className="flex flex-col gap-2 p-0 sm:max-w-[300px] md:max-w-[650px]">
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
