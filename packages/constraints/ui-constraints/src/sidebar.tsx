'use client';
import { ComponentProps, useMemo, useState } from 'react';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import {
  Button,
  Input,
  Badge,
  Heading,
  Text,
  ScrollArea,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  cn,
} from '@commonalityco/ui-design-system';
import { formatPackageName } from '@commonalityco/utils-package';
import {
  Box,
  ExternalLink,
  Eye,
  EyeOff,
  Users,
  Focus,
  Tags,
} from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GradientFade } from '@commonalityco/ui-core';
import { getIconForPackage } from '@commonalityco/utils-core/ui';

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
    <div
      className={cn(
        'flex shrink-0 transition duration-200 items-center opacity-0 hover:opacity-100',
        {
          'opacity-100': visible,
        },
      )}
    >
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
                  <Eye className="absolute h-4 w-4 opacity-100 transition group-hover:opacity-0" />
                  <EyeOff className="absolute h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                </>
              ) : (
                <Eye className="h-4 w-4" />
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
  stripScopeFromPackageNames,
  visiblePackages,
  onHide,
  onShow,
  onFocus,
  search,
}: {
  visiblePackages: Package[];
  packages: Package[];
  stripScopeFromPackageNames?: boolean;
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
              href="https://commonality.co/docs/packages"
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
      <Heading as="p" size="sm">
        Packages
      </Heading>

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
                const formattedPackageName = formatPackageName(package_.name, {
                  stripScope: stripScopeFromPackageNames ?? true,
                });

                return (
                  <div
                    key={package_.name}
                    className="mb-1 grid grid-cols-[1fr_auto] items-center justify-start overflow-hidden"
                  >
                    <div className="flex w-full items-center justify-start gap-2 overflow-hidden">
                      <IconForPackage className="h-4 w-4 shrink-0 grow-0" />
                      <p className="text-foreground my-0 truncate text-left text-sm font-medium">
                        {formattedPackageName}
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
              href="https://commonality.co/docs/tags"
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
      <Heading as="p" size="sm">
        Tags
      </Heading>
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
                      >{`#${tag}`}</Badge>
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
              href="https://commonality.co/docs/codeowners"
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
      <Heading as="p" size="sm">
        Codeowners
      </Heading>
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
      <div className="bg-border absolute bottom-0 left-0 right-0 top-0 m-auto h-px rounded-full transition-all group-data-[resize-handle-active=pointer]:h-1.5" />
    </PanelResizeHandle>
  );
}

export function Sidebar({
  packages,
  visiblePackages,
  tagsData,
  codeownersData,
  stripScopeFromPackageNames,
  onHideAll = () => {},
  onShowAll = () => {},
  onTagHide = () => {},
  onTagShow = () => {},
  onTagFocus = () => {},
  onTeamHide = () => {},
  onTeamShow = () => {},
  onTeamFocus = () => {},
  onPackageHide = () => {},
  onPackageShow = () => {},
  onPackageFocus = () => {},
  onLayout,
  defaultLayout,
  initialSearch = '',
}: {
  visiblePackages: Package[];
  packages: Package[];
  codeownersData: CodeownersData[];
  tagsData: TagsData[];
  stripScopeFromPackageNames?: boolean;
  onShowAll: () => void;
  onHideAll: () => void;
  onTagHide: (tag: string) => void;
  onTagShow: (tag: string) => void;
  onTagFocus: (tag: string) => void;
  onTeamHide: (team: string) => void;
  onTeamShow: (team: string) => void;
  onTeamFocus: (team: string) => void;
  onPackageHide: (packageName: string) => void;
  onPackageShow: (packageName: string) => void;
  onPackageFocus: (packageName: string) => void;
  onLayout?: ComponentProps<typeof PanelGroup>['onLayout'];
  defaultLayout?: [number, number, number];
  initialSearch?: string;
}) {
  const [search, setSearch] = useState(initialSearch);

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
    <div className="bg-background h-full w-full rounded-lg overflow-hidden">
      <div className="flex h-full flex-col content-start gap-3">
        <div className="flex flex-nowrap items-center gap-2">
          <Button
            variant="secondary"
            className="w-full"
            disabled={packages.length === 0}
            onClick={() => onShowAll()}
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
            onClick={() => onHideAll()}
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
            onLayout={onLayout}
          >
            <Panel
              defaultSize={defaultLayout?.[0] ?? 34}
              minSize={5}
              className="grid content-start"
            >
              <PackagesFilterSection
                packages={filteredPackages}
                stripScopeFromPackageNames={stripScopeFromPackageNames}
                visiblePackages={visiblePackages}
                onFocus={onPackageFocus}
                onHide={onPackageHide}
                onShow={onPackageShow}
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
                onFocus={onTagFocus}
                onHide={onTagHide}
                onShow={onTagShow}
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
                onFocus={onTeamFocus}
                onHide={onTeamHide}
                onShow={onTeamShow}
                search={search}
              />
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
