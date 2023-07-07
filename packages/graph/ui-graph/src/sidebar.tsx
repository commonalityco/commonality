'use client';
import { ComponentProps, useMemo, useState } from 'react';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import {
  Button,
  Input,
  Tag,
  Heading,
  Text,
  ScrollArea,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import { cva } from 'class-variance-authority';
import {
  getIconForPackage,
  formatPackageName,
} from '@commonalityco/utils-package';
import { Eye, EyeOff, Focus } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GradientFade } from '@commonalityco/ui-core';
import sortBy from 'lodash.sortby';

const visibilityButton = cva(
  'shrink-0 opacity-0 hover:opacity-100 flex items-center',
  {
    variants: {
      visible: {
        true: 'opacity-100',
      },
    },
  }
);

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
    <div className={visibilityButton({ visible })}>
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
}: {
  onClick: ComponentProps<typeof Button>['onClick'];
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            aria-label="Focus"
            className="shrink-0"
          >
            <Focus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Focus</TooltipContent>
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
  onPackageClick,
}: {
  visiblePackages?: Package[];
  packages: Package[];
  stripScopeFromPackageNames?: boolean;
  onHide: (pkgName: string) => void;
  onShow: (pkgName: string) => void;
  onFocus: (pkgName: string) => void;
  onPackageClick: (pkgName: string) => void;
}) {
  return (
    <>
      <Heading as="p" size="sm">
        Packages
      </Heading>

      <div className="relative overflow-hidden">
        <ScrollArea className="relative h-full">
          <GradientFade className="h-3" placement="top" />

          {packages.length > 0 ? (
            packages.map((package_) => {
              const isPackageVisible = Boolean(
                visiblePackages?.some(
                  (packageName) => packageName.name === package_.name
                )
              );

              const IconForPackage = getIconForPackage(package_);
              const formattedPackageName = formatPackageName(package_.name, {
                stripScope: stripScopeFromPackageNames ?? true,
              });

              return (
                <div
                  key={package_.name}
                  className="mb-1 flex flex-nowrap items-center justify-start overflow-hidden"
                >
                  <div className="grow overflow-hidden">
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3"
                      onClick={() => onPackageClick(package_.name)}
                    >
                      <div className="flex w-full items-center justify-start gap-2">
                        <IconForPackage className="h-4 w-4 shrink-0 grow-0" />
                        <div className="max-w-[144px] truncate text-left">
                          {formattedPackageName}
                        </div>
                      </div>
                    </Button>
                  </div>
                  <ShowHideButton
                    visible={isPackageVisible}
                    onHide={() => onHide(package_.name)}
                    onShow={() => onShow(package_.name)}
                  />
                  <FocusButton onClick={() => onFocus(package_.name)} />
                </div>
              );
            })
          ) : (
            <Text use="help">No matching packages</Text>
          )}
          <GradientFade className="h-2" placement="bottom" />
        </ScrollArea>
      </div>
    </>
  );
}

function TagsFilterSection({
  tagData,
  className,
  visiblePackages,
  onHide,
  onFocus,
  onShow,
}: {
  visiblePackages?: Package[];
  className?: string;
  onHide: (tag: string) => void;
  onShow: (tag: string) => void;
  onFocus: (tag: string) => void;
  tagData: TagsData[];
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
          .filter(Boolean)
      ),
    ];

    return sortBy(uniqueTags, (item) => item);
  }, [tagData]);

  return (
    <>
      <Heading as="p" size="sm">
        Tags
      </Heading>
      <ScrollArea className="@sm:display-none h-full">
        <GradientFade className="h-3" placement="top" />
        {allTags.length > 0 ? (
          allTags.map((tag) => {
            const isTagVisible = Boolean(
              visiblePackages?.some((package_) => {
                const tagsForPkg = tagData.find(
                  (data) => data.packageName === package_.name
                );

                if (tagsForPkg) {
                  return tagsForPkg.tags.includes(tag);
                }

                return false;
              })
            );

            return (
              <div className="flex flex-nowrap items-center" key={tag}>
                <Button variant="ghost" className="w-full justify-start px-3">
                  <Tag
                    use="secondary"
                    className="block max-w-[160px]"
                  >{`#${tag}`}</Tag>
                </Button>
                <ShowHideButton
                  visible={isTagVisible}
                  onShow={() => onShow(tag)}
                  onHide={() => onHide(tag)}
                />
                <FocusButton onClick={() => onFocus(tag)} />
              </div>
            );
          })
        ) : (
          <Text use="help">No matching tags</Text>
        )}
        <GradientFade className="h-2" placement="bottom" />
      </ScrollArea>
    </>
  );
}

function TeamsFilterSection({
  ownerData,
  className,
  visiblePackages,
  onHide,
  onShow,
  onFocus,
}: {
  ownerData: CodeownersData[];
  className?: string;
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
          .filter(Boolean)
      ),
    ];

    return sortBy(uniqueOwners, (item) => item);
  }, [ownerData]);

  return (
    <>
      <Heading as="p" size="sm">
        Owners
      </Heading>
      <ScrollArea className="@sm:display-none h-full">
        <GradientFade className="h-3" placement="top" />
        {allOwners.length > 0 ? (
          allOwners.map((owner) => {
            const isTeamVisible = Boolean(
              visiblePackages?.some((package_) => {
                const ownersForPkg = ownerData.find(
                  (data) => data.packageName === package_.name
                );

                if (ownersForPkg) {
                  return ownersForPkg.codeowners.includes(owner);
                }

                return false;
              })
            );

            return (
              <div className="flex flex-nowrap items-center gap-1" key={owner}>
                <div className="w-full max-w-[184px]">
                  <Button
                    variant="ghost"
                    className="block w-full justify-start truncate px-3 text-left"
                  >
                    {owner}
                  </Button>
                </div>
                <div className="shrink-0">
                  <ShowHideButton
                    visible={isTeamVisible}
                    onShow={() => onShow(owner)}
                    onHide={() => onHide(owner)}
                  />
                </div>
                <div className="shrink-0">
                  <FocusButton onClick={() => onFocus(owner)} />
                </div>
              </div>
            );
          })
        ) : (
          <Text use="help">No matching teams</Text>
        )}
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
  onPackageClick = () => {},
  onPackageHide = () => {},
  onPackageShow = () => {},
  onPackageFocus = () => {},
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
  onPackageClick: (packageName: string) => void;
  onPackageHide: (packageName: string) => void;
  onPackageShow: (packageName: string) => void;
  onPackageFocus: (packageName: string) => void;
}) {
  const [filter, setFilter] = useState('');

  const filteredOwners = filter
    ? codeownersData.filter((data) =>
        data.codeowners.some((codeowner) => codeowner.includes(filter))
      )
    : codeownersData;

  const filteredTags = filter
    ? tagsData.filter((data) => data.tags.some((tag) => tag.includes(filter)))
    : tagsData;

  const filteredPackages = filter
    ? packages.filter((package_) => package_.name.includes(filter))
    : packages;

  const noMatchingItems =
    filteredOwners.length === 0 &&
    filteredTags.length === 0 &&
    filteredPackages.length === 0;

  return (
    <div className="bg-background h-full w-full overflow-hidden rounded-lg py-3">
      <div className="flex h-full flex-col content-start gap-3 px-3">
        <div className="flex flex-nowrap items-center gap-2">
          <Button
            variant="secondary"
            className="w-full"
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
            onClick={() => onHideAll()}
          >
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              Hide all
            </div>
          </Button>
        </div>
        <Input
          placeholder="Search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />

        {noMatchingItems ? (
          <div className="py-6 text-center">
            <Text use="help">No matches found</Text>
          </div>
        ) : (
          <PanelGroup direction="vertical" autoSaveId="graph-sidebar">
            <Panel defaultSize={20} minSize={5} className="grid content-start">
              <PackagesFilterSection
                onPackageClick={onPackageClick}
                packages={filteredPackages}
                stripScopeFromPackageNames={stripScopeFromPackageNames}
                visiblePackages={visiblePackages}
                onFocus={onPackageFocus}
                onHide={onPackageHide}
                onShow={onPackageShow}
              />
            </Panel>
            <ResizeBar />
            <Panel defaultSize={20} minSize={5} className="grid content-start">
              <TagsFilterSection
                className="min-height-0 shrink"
                tagData={filteredTags}
                visiblePackages={visiblePackages}
                onFocus={onTagFocus}
                onHide={onTagHide}
                onShow={onTagShow}
              />
            </Panel>
            <ResizeBar />
            <Panel defaultSize={20} minSize={5} className="grid content-start">
              <TeamsFilterSection
                className="min-height-0 shrink"
                ownerData={filteredOwners}
                visiblePackages={visiblePackages}
                onFocus={onTeamFocus}
                onHide={onTeamHide}
                onShow={onTeamShow}
              />
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
