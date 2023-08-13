'use client';
import {
  Label,
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
import { ExternalLink, File, FileText, Tags, Users } from 'lucide-react';
import { getIconForPackage } from '@commonalityco/utils-package';
import ReactWrapBalancer from 'react-wrap-balancer';

interface PackageSheetProps extends ComponentProps<typeof Sheet> {
  pkg?: Package;
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
  documentsData: DocumentsData[];
  getCreateTagsButton?: (pkg: Package) => React.ReactNode;
}

function TagsButton({
  pkgTags = [],
}: // eslint-disable-next-line @typescript-eslint/no-empty-function

{
  pkgTags: string[];
}) {
  return (
    <>
      {pkgTags.length ? (
        <div className="flex flex-wrap gap-1">
          {pkgTags.map((tag) => (
            <Badge variant="secondary" key={tag}>{`#${tag}`}</Badge>
          ))}
        </div>
      ) : (
        <Card variant="secondary">
          <CardHeader>
            <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
              <div className="bg-secondary rounded-full p-1.5">
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
    </>
  );
}

function PackageSheetContent({
  pkg,
  tagsData,
  documentsData,
  codeownersData,
  getCreateTagsButton = () => null,
}: {
  pkg: Package;
  documentsData: PackageSheetProps['documentsData'];
  tagsData: PackageSheetProps['tagsData'];
  codeownersData: PackageSheetProps['codeownersData'];
  getCreateTagsButton: PackageSheetProps['getCreateTagsButton'];
}) {
  const Icon = getIconForPackage(pkg.type);

  const tagDataForPkg = useMemo(() => {
    return tagsData.find((data) => data.packageName === pkg.name);
  }, [pkg, tagsData]);

  const ownerDataForPkg = useMemo(() => {
    return codeownersData.find((data) => data.packageName === pkg.name);
  }, [pkg, codeownersData]);

  const documentsForPkg = useMemo(() => {
    return documentsData.find((data) => data.packageName === pkg.name);
  }, [documentsData]);

  const readmeDocument = documentsForPkg?.documents.find((doc) => doc.isReadme);

  const createTagsButton = useMemo(() => getCreateTagsButton(pkg), [pkg]);

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
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
              {createTagsButton}
            </div>
            <div className="w-full">
              <TagsButton pkgTags={tagDataForPkg?.tags ?? []} />
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
                    <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
                      <div className="bg-secondary rounded-full p-1.5">
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
                    <p className="text-muted-foreground pb-3">
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
            getCreateTagsButton={props.getCreateTagsButton}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
