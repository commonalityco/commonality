'use client';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import { GradientFade, getIconForPackage } from '@commonalityco/ui-core';
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  ScrollArea,
  Text,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import {
  Box,
  ExternalLink,
  Eye,
  EyeOff,
  Focus,
  Tags,
  Users,
} from 'lucide-react';
import { ComponentProps, useMemo, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useInteractions } from '../context/interaction-context';
import { usePackagesQuery } from '../query/query-hooks';
import { setCookie } from 'cookies-next';
import { COOKIE_FILTER_SIDEBAR } from '../constants/cookie-names';

function ShowHideButton({
  visible,
  onHide,
  onShow,
}: {
  visible: boolean;
  onHide: ComponentProps<typeof Button>['onClick'];
  onShow: ComponentProps<typeof Button>['onClick'];
}) {
  return (
    <div className={'flex shrink-0 items-center transition duration-200'}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group relative"
              aria-label={visible ? 'Hide package' : 'Show package'}
              onClick={visible ? onHide : onShow}
            >
              {visible ? (
                <>
                  <Eye className="h-4 w-4" />
                </>
              ) : (
                <EyeOff className="text-muted-foreground h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{visible ? 'Hide' : 'Show'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function FocusButton({
  onClick,
  children,
}: {
  onClick: ComponentProps<typeof Button>['onClick'];
  children?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            aria-label={children}
            className="shrink-0"
          >
            <Focus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function PackagesFilterSection({
  packages,
  visiblePackages,
  onHide,
  onShow,
  onFocus,
  search,
}: {
  visiblePackages: Package[];
  packages: Package[];
  onHide: (packageName: string) => void;
  onShow: (packageName: string) => void;
  onFocus: (packageName: string) => void;
  search: string;
}) {
  const getPlaceholder = () => {
    if (search) {
      return <Text use="help">No matching packages</Text>;
    }

    return (
      <Card variant="secondary">
        <CardHeader>
          <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
            <div className="bg-secondary rounded-full p-1.5">
              <Box className="h-5 w-5" />
            </div>
          </div>

          <CardTitle>Create your first package</CardTitle>
          <CardDescription>
            Start building your composable ecosystem of packages.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline" size="sm">
            <a
              href="https://docs.commonality.co/packages"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
              <ExternalLink className="ml-1 h-3 w-3 -translate-y-px" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <div className="flex flex-nowrap items-center justify-between">
        <p className="text-xs font-medium">Packages</p>
        <p className="text-muted-foreground text-xs">
          <span>{visiblePackages.length}</span>
          <span className="px-1">of</span>
          <span>{packages.length}</span>
        </p>
      </div>

      <div className="relative overflow-hidden">
        <ScrollArea className="relative h-full">
          <GradientFade className="h-3" placement="top" />

          {packages.length > 0
            ? packages.map((package_) => {
                const isPackageVisible = Boolean(
                  visiblePackages?.some(
                    (packageName) => packageName.name === package_.name,
                  ),
                );

                const IconForPackage = getIconForPackage(package_.type);

                return (
                  <div
                    key={package_.name}
                    className="mb-1 grid grid-cols-[1fr_auto] items-center justify-start gap-1 overflow-hidden"
                  >
                    <div className="flex w-full items-center justify-start gap-2 overflow-hidden">
                      <IconForPackage className="h-4 w-4 shrink-0 grow-0" />
                      <p className="text-foreground my-0 truncate text-left text-sm font-medium">
                        {package_.name}
                      </p>
                    </div>

                    <div className="flex-nowwrap flex gap-1">
                      <ShowHideButton
                        visible={isPackageVisible}
                        onHide={() => onHide(package_.name)}
                        onShow={() => onShow(package_.name)}
                      />
                      <FocusButton onClick={() => onFocus(package_.name)}>
                        Focus
                      </FocusButton>
                    </div>
                  </div>
                );
              })
            : getPlaceholder()}
          <GradientFade className="h-2" placement="bottom" />
        </ScrollArea>
      </div>
    </>
  );
}

function TagsFilterSection({
  tagData,
  visiblePackages,
  onHide,
  onFocus,
  onShow,
  search,
}: {
  visiblePackages?: Package[];
  onHide: (tag: string) => void;
  onShow: (tag: string) => void;
  onFocus: (tag: string) => void;
  tagData: TagsData[];
  search: string;
}) {
  const allTags: string[] = useMemo(() => {
    if (tagData.length === 0) {
      return [];
    }

    const uniqueTags = [
      ...new Set(
        tagData
          ?.map((data) => data.tags)
          .flat()
          .filter(Boolean),
      ),
    ];

    return uniqueTags.sort((a, b) => a.localeCompare(b));
  }, [tagData]);

  const visibleTagCount = useMemo(() => {
    const visibleTags = new Set();
    for (const package_ of visiblePackages || []) {
      for (const data of tagData) {
        if (data.packageName === package_.name) {
          for (const tag of data.tags) {
            if (allTags.includes(tag)) {
              visibleTags.add(tag);
            }
          }
        }
      }
    }
    return visibleTags.size;
  }, [visiblePackages, tagData, allTags]);

  const getPlaceholder = () => {
    if (search) {
      return <Text use="help">No matching tags</Text>;
    }

    return (
      <Card variant="secondary">
        <CardHeader>
          <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
            <div className="bg-secondary rounded-full p-1.5">
              <Tags className="h-5 w-5" />
            </div>
          </div>

          <CardTitle>Get started with tags</CardTitle>
          <CardDescription>
            Add tags to a package to enforce dependency constraints and
            categorize packages in your ecosystem.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline" size="sm">
            <a
              href="https://docs.commonality.co/tags"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
              <ExternalLink className="ml-1 h-3 w-3 -translate-y-px" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <div className="flex flex-nowrap items-center justify-between">
        <p className="text-xs font-medium">Tags</p>
        <p className="text-muted-foreground text-xs">
          <span>{visibleTagCount}</span>
          <span className="px-1">of</span>
          <span>{allTags.length}</span>
        </p>
      </div>
      <ScrollArea className="@sm:display-none h-full">
        <GradientFade className="h-3" placement="top" />
        {allTags.length > 0
          ? allTags.map((tag) => {
              const isTagVisible = Boolean(
                visiblePackages?.some((package_) => {
                  const tagsForPackage = tagData.find(
                    (data) => data.packageName === package_.name,
                  );

                  if (tagsForPackage) {
                    return tagsForPackage.tags.includes(tag);
                  }

                  return false;
                }),
              );

              return (
                <div
                  className="grid grid-cols-[1fr_auto] items-center gap-1"
                  key={tag}
                >
                  <div className="flex w-full items-center overflow-hidden">
                    <div className="flex">
                      <Badge
                        variant="secondary"
                        className="inline-block min-w-0 max-w-full truncate"
                      >
                        {tag}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-nowrap gap-1">
                    <ShowHideButton
                      visible={isTagVisible}
                      onShow={() => onShow(tag)}
                      onHide={() => onHide(tag)}
                    />
                    <FocusButton onClick={() => onFocus(tag)}>
                      Focus
                    </FocusButton>
                  </div>
                </div>
              );
            })
          : getPlaceholder()}
        <GradientFade className="h-2" placement="bottom" />
      </ScrollArea>
    </>
  );
}

function CodeownersFilterSection({
  ownerData,
  visiblePackages,
  onHide,
  onShow,
  onFocus,
  search,
}: {
  search: string;
  ownerData: CodeownersData[];
  visiblePackages?: Package[];
  onHide: (team: string) => void;
  onShow: (team: string) => void;
  onFocus: (team: string) => void;
}) {
  const allOwners: string[] = useMemo(() => {
    if (ownerData.length === 0) {
      return [];
    }

    const uniqueOwners = [
      ...new Set(
        ownerData
          ?.map((data) => data.codeowners)
          .flat()
          .filter(Boolean),
      ),
    ];

    return uniqueOwners.sort((a, b) => a.localeCompare(b));
  }, [ownerData]);

  const visibleOwners = useMemo(() => {
    const visibleOwners = new Set();
    for (const package_ of visiblePackages || []) {
      for (const data of ownerData) {
        if (data.packageName === package_.name) {
          for (const owner of data.codeowners) {
            if (allOwners.includes(owner)) {
              visibleOwners.add(owner);
            }
          }
        }
      }
    }
    return visibleOwners.size;
  }, [visiblePackages, ownerData, allOwners]);

  const getPlaceholder = () => {
    if (search) {
      return <Text use="help">No matching codeowners</Text>;
    }

    return (
      <Card variant="secondary">
        <CardHeader>
          <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
            <div className="bg-secondary rounded-full p-1.5">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <CardTitle>Assign ownership</CardTitle>
          <CardDescription>
            Create a <span className="font-mono">CODEOWNERS</span> file to
            assign ownership of packages in your project
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline" size="sm">
            <a
              href="https://docs.commonality.co/codeowners"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
              <ExternalLink className="ml-1 h-3 w-3 -translate-y-px" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <div className="flex flex-nowrap items-center justify-between">
        <p className="text-xs font-medium">Codeowners</p>
        <p className="text-muted-foreground text-xs">
          <span>{visibleOwners}</span>
          <span className="px-1">of</span>
          <span>{allOwners.length}</span>
        </p>
      </div>
      <ScrollArea className="@sm:display-none h-full overflow-hidden">
        <GradientFade className="h-3" placement="top" />
        {allOwners.length > 0
          ? allOwners.map((owner) => {
              const isTeamVisible = Boolean(
                visiblePackages?.some((package_) => {
                  const ownersForPackage = ownerData.find(
                    (data) => data.packageName === package_.name,
                  );

                  if (ownersForPackage) {
                    return ownersForPackage.codeowners.includes(owner);
                  }

                  return false;
                }),
              );

              return (
                <div
                  className="grid grid-cols-[1fr_auto] flex-nowrap items-center gap-1"
                  key={owner}
                >
                  <div>
                    <Badge variant="outline" className="rounded-full">
                      {owner}
                    </Badge>
                  </div>

                  <div className="flex flex-nowrap gap-1">
                    <div className="shrink-0">
                      <ShowHideButton
                        visible={isTeamVisible}
                        onShow={() => onShow(owner)}
                        onHide={() => onHide(owner)}
                      />
                    </div>
                    <div className="shrink-0">
                      <FocusButton onClick={() => onFocus(owner)}>
                        Focus
                      </FocusButton>
                    </div>
                  </div>
                </div>
              );
            })
          : getPlaceholder()}
        <GradientFade className="h-2" placement="bottom" />
      </ScrollArea>
    </>
  );
}

function ResizeBar() {
  return (
    <PanelResizeHandle className="group relative h-4">
      <div className="bg-border group-data-[resize-handle-active=pointer]:bg-muted-foreground group-hover:bg-muted-foreground/50 absolute bottom-0 left-0 right-0 top-0 m-auto h-px rounded-full transition-all group-hover:h-0.5 group-data-[resize-handle-active=pointer]:h-0.5" />
    </PanelResizeHandle>
  );
}

export function GraphFilterSidebar({
  packages,
  tagsData,
  codeownersData,
  defaultLayout,
  initialSearch = '',
}: {
  packages: Package[];
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
  defaultLayout?: [number, number, number];
  initialSearch?: string;
}) {
  const interactions = useInteractions();
  const [packagesQuery] = usePackagesQuery();

  const [search, setSearch] = useState(initialSearch);

  const visiblePackages = packagesQuery
    ? packages.filter((pkg) => packagesQuery.includes(pkg.name))
    : packages;

  const filteredOwners = search
    ? codeownersData.filter((data) =>
        data.codeowners.some((codeowner) => codeowner.includes(search)),
      )
    : codeownersData;

  const filteredTags = search
    ? tagsData.filter((data) => data.tags.some((tag) => tag.includes(search)))
    : tagsData;

  const filteredPackages = search
    ? packages.filter((package_) => package_.name.includes(search))
    : packages;

  const noMatchingItems =
    filteredOwners.length === 0 &&
    filteredTags.length === 0 &&
    filteredPackages.length === 0;

  return (
    <div className="relative h-full w-full py-4 pl-4">
      <div className="bg-background h-full w-full overflow-hidden">
        <div className="flex h-full flex-col content-start gap-4">
          <div className="flex flex-nowrap items-center gap-2">
            <Button
              variant="secondary"
              className="w-full"
              disabled={packages.length === 0}
              onClick={() => interactions.showAll()}
            >
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Show all
              </div>
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              disabled={packages.length === 0}
              onClick={() => interactions.hideAll()}
            >
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4" />
                Hide all
              </div>
            </Button>
          </div>
          <Input
            className="shrink-0"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {noMatchingItems && search ? (
            <div className="py-6 text-center">
              <Text use="help">No matches found</Text>
            </div>
          ) : (
            <PanelGroup
              direction="vertical"
              autoSaveId="graph-sidebar"
              onLayout={(sizes) => {
                setCookie(COOKIE_FILTER_SIDEBAR, sizes);
              }}
            >
              <Panel
                defaultSize={defaultLayout?.[0] ?? 34}
                minSize={5}
                className="grid content-start"
              >
                <PackagesFilterSection
                  packages={filteredPackages}
                  visiblePackages={visiblePackages}
                  onFocus={(packageName) => interactions.focus([packageName])}
                  onHide={(packageName) => interactions.hide([packageName])}
                  onShow={(packageName) => interactions.show([packageName])}
                  search={search}
                />
              </Panel>
              <ResizeBar />
              <Panel
                defaultSize={defaultLayout?.[1] ?? 33}
                minSize={5}
                className="grid content-start"
              >
                <TagsFilterSection
                  tagData={filteredTags}
                  visiblePackages={visiblePackages}
                  onFocus={(tag) => {
                    const packageNames = tagsData
                      .filter((data) => data.tags.includes(tag))
                      .map((data) => data.packageName);

                    interactions.focus(packageNames);
                  }}
                  onHide={(tag) => {
                    const packageNames = tagsData
                      .filter((data) => data.tags.includes(tag))
                      .map((data) => data.packageName);

                    interactions.hide(packageNames);
                  }}
                  onShow={(tag) => {
                    const packageNames = tagsData
                      .filter((data) => data.tags.includes(tag))
                      .map((data) => data.packageName);

                    interactions.show(packageNames);
                  }}
                  search={search}
                />
              </Panel>
              <ResizeBar />
              <Panel
                defaultSize={defaultLayout?.[2] ?? 33}
                minSize={5}
                className="grid content-start"
              >
                <CodeownersFilterSection
                  ownerData={filteredOwners}
                  visiblePackages={visiblePackages}
                  onFocus={(codeowner) => {
                    const packageNames = codeownersData
                      .filter((data) => data.codeowners.includes(codeowner))
                      .map((pkg) => pkg.packageName);

                    interactions.focus(packageNames);
                  }}
                  onHide={(codeowner) => {
                    const packageNames = codeownersData
                      .filter((data) => data.codeowners.includes(codeowner))
                      .map((pkg) => pkg.packageName);

                    interactions.hide(packageNames);
                  }}
                  onShow={(codeowner) => {
                    const packageNames = codeownersData
                      .filter((data) => data.codeowners.includes(codeowner))
                      .map((pkg) => pkg.packageName);

                    interactions.show(packageNames);
                  }}
                  search={search}
                />
              </Panel>
            </PanelGroup>
          )}
        </div>
      </div>
    </div>
  );
}
