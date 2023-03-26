'use client';
import { ComponentProps, useState } from 'react';
import * as Accordion from '@commonalityco/ui-accordion';
import { Divider } from '@commonalityco/ui-divider';
import { Package } from '@commonalityco/types';
import { TextInput } from '@commonalityco/ui-text-input';
import { Button } from '@commonalityco/ui-button';
import { Tag } from '@commonalityco/ui-tag';
import * as Tooltip from '@commonalityco/ui-tooltip';
import { EyeIcon as EyeIconOutline } from '@heroicons/react/24/outline';
import { useAtomValue } from 'jotai';
import { graphManagerAtom, visibleElementsAtom } from 'atoms/graph';
import { IconButton } from '@commonalityco/ui-icon-button';
import { cva } from 'class-variance-authority';
import { TargetIcon } from '@radix-ui/react-icons';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { EyeSlashIcon as EyeSlashIconOutline } from '@heroicons/react/24/outline';
import { graphEvents } from 'utils/graph/graphEvents';
import { getIconForPackage } from 'utils/get-icon-for-package';
import { formatPackageName } from 'utils/format-package-name';
import { Heading } from '@commonalityco/ui-heading';
import { twMerge } from 'tailwind-merge';
import { Text } from '@commonalityco/ui-text';

const visibilityButton = cva('shrink-0 opacity-0 hover:opacity-100', {
  variants: {
    visible: {
      true: 'opacity-100',
    },
  },
});

function ShowHideButton({
  visible,
  onHide,
  onShow,
}: {
  visible: boolean;
  onHide: ComponentProps<typeof IconButton>['onClick'];
  onShow: ComponentProps<typeof IconButton>['onClick'];
}) {
  return (
    <div className={visibilityButton({ visible })}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton
            use="ghost"
            size="sm"
            className="group relative"
            onClick={visible ? onHide : onShow}
          >
            {visible ? (
              <>
                <EyeIconOutline className="absolute h-4 w-4 opacity-100 transition group-hover:opacity-0" />
                <EyeSlashIconOutline className="absolute h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </>
            ) : (
              <EyeIconOutline className="h-4 w-4" />
            )}
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>{visible ? 'Hide' : 'Show'}</Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}

function FocusButton({
  onClick,
}: {
  onClick: ComponentProps<typeof IconButton>['onClick'];
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <IconButton onClick={onClick} use="ghost" size="sm">
          <TargetIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content>Focus</Tooltip.Content>
    </Tooltip.Root>
  );
}

function PackagesFilterSection({
  packages,
  stripScopeFromPackageNames,
  className,
}: {
  packages: Package[];
  stripScopeFromPackageNames?: boolean;
  className?: string;
}) {
  const [search, setSearch] = useState('');
  const visibleElements = useAtomValue(visibleElementsAtom);

  const filteredPackages = search
    ? packages.filter((pkg) => pkg.name.includes(search))
    : packages;

  return (
    <Accordion.Item className={className} value="packages">
      <Accordion.Trigger>
        <Heading as="p" size="sm">
          Packages
        </Heading>
      </Accordion.Trigger>

      <Accordion.Content className="h-full">
        <TextInput
          className="mb-2"
          search
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {filteredPackages.map((pkg) => {
          const isPackageVisible = Boolean(
            visibleElements?.getElementById(pkg.name).length
          );
          const IconForPackage = getIconForPackage(pkg);
          const formattedPackageName = formatPackageName(pkg.name, {
            stripScope: stripScopeFromPackageNames ?? true,
          });

          return (
            <div
              key={pkg.name}
              className="mb-1 flex flex-nowrap items-center justify-start"
            >
              <Button
                use="ghost"
                className="w-full justify-start px-3"
                onClick={() =>
                  graphEvents.emit('Fit', {
                    selector: `node[name="${pkg.name}"]`,
                    padding: 200,
                  })
                }
              >
                <div className="flex w-full items-center justify-start gap-2">
                  <IconForPackage className="h-4 w-4 shrink-0 grow-0" />
                  <div className="grow truncate text-left">
                    {formattedPackageName}
                  </div>
                </div>
              </Button>

              <ShowHideButton
                visible={isPackageVisible}
                onHide={() =>
                  graphEvents.emit('Hide', {
                    selector: `node[name="${pkg.name}"]`,
                  })
                }
                onShow={() =>
                  graphEvents.emit('Show', {
                    selector: `node[name="${pkg.name}"]`,
                  })
                }
              />
              <FocusButton
                onClick={() =>
                  graphEvents.emit('Focus', {
                    selector: `node[name="${pkg.name}"]`,
                  })
                }
              />
            </div>
          );
        })}
      </Accordion.Content>
    </Accordion.Item>
  );
}

function TagsFilterSection({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  const visibleElements = useAtomValue(visibleElementsAtom);

  return (
    <Accordion.Item className={className} value="tags">
      <Accordion.Trigger>
        <Heading as="p" size="sm">
          Tags
        </Heading>
      </Accordion.Trigger>
      <Accordion.Content>
        {tags.map((tag) => {
          const isTagVisible = Boolean(
            visibleElements?.some((el) => {
              const data: Package = el.data();

              if (data.tags) {
                return data.tags.includes(tag);
              }

              return false;
            })
          );

          return (
            <div className="flex flex-nowrap items-center gap-1" key={tag}>
              <Button use="ghost" className="w-full justify-start px-3">
                <Tag>{`#${tag}`}</Tag>
              </Button>
              <ShowHideButton
                visible={isTagVisible}
                onShow={() => {
                  graphEvents.emit('Show', {
                    selector: (el) => {
                      const data: Package = el.data();

                      if (data.tags) {
                        return data.tags.includes(tag);
                      }

                      return false;
                    },
                  });
                }}
                onHide={() => {
                  graphEvents.emit('Hide', {
                    selector: (el) => {
                      const data: Package = el.data();

                      if (data.tags) {
                        return data.tags.includes(tag);
                      }

                      return false;
                    },
                  });
                }}
              />
              <FocusButton
                onClick={() =>
                  graphEvents.emit('Focus', {
                    selector: (el) => {
                      const data = el.data();

                      if (data.tags) {
                        return data.tags.includes(tag);
                      }

                      return false;
                    },
                  })
                }
              />
            </div>
          );
        })}
      </Accordion.Content>
    </Accordion.Item>
  );
}

function TeamsFilterSection({
  teams,
  className,
}: {
  teams: string[];
  className?: string;
}) {
  const visibleElements = useAtomValue(visibleElementsAtom);

  return (
    <Accordion.Item className={className} value="teams">
      <Accordion.Trigger>
        <Heading as="p" size="sm">
          Teams
        </Heading>
      </Accordion.Trigger>
      <Accordion.Content>
        {teams.map((team) => {
          const isTeamVisible = Boolean(
            visibleElements?.some((el) => {
              const data: Package = el.data();

              if (data.owners) {
                return data.owners.includes(team);
              }

              return false;
            })
          );

          return (
            <div className="flex flex-nowrap items-center gap-1" key={team}>
              <Button use="ghost" className="w-full justify-start px-3">
                {team}
              </Button>
              <ShowHideButton
                visible={isTeamVisible}
                onShow={() => {
                  graphEvents.emit('Show', {
                    selector: (el) => {
                      const data: Package = el.data();

                      if (data.owners) {
                        return data.owners.includes(team);
                      }

                      return false;
                    },
                  });
                }}
                onHide={() => {
                  graphEvents.emit('Hide', {
                    selector: (el) => {
                      const data: Package = el.data();

                      if (data.owners) {
                        return data.owners.includes(team);
                      }

                      return false;
                    },
                  });
                }}
              />
              <FocusButton
                onClick={() =>
                  graphEvents.emit('Focus', {
                    selector: (el) => {
                      const data: Package = el.data();

                      if (data.owners) {
                        return data.owners.includes(team);
                      }

                      return false;
                    },
                  })
                }
              />
            </div>
          );
        })}
      </Accordion.Content>
    </Accordion.Item>
  );
}

function GraphSidebar({
  packages,
  tags,
  teams,
  stripScopeFromPackageNames,
}: {
  packages: Package[];
  tags: string[];
  teams: string[];
  stripScopeFromPackageNames?: boolean;
}) {
  return (
    <div className="absolute top-3 left-3 bottom-3 z-50 w-72 shrink-0 basis-72 overflow-hidden rounded-lg bg-white p-3 dark:bg-zinc-900">
      <div className="flex h-full flex-col">
        <div className="flex flex-nowrap gap-2">
          <Button
            use="ghost"
            className="w-full"
            onClick={() => {
              graphEvents.emit('ShowAll');
            }}
          >
            <div className="flex items-center gap-2">
              <EyeIconOutline className="h-4 w-4" />
              Show all
            </div>
          </Button>
          <Button
            use="ghost"
            className="w-full"
            onClick={() => {
              graphEvents.emit('HideAll');
            }}
          >
            <div className="flex items-center gap-2">
              <EyeSlashIconOutline className="h-4 w-4" />
              Hide all
            </div>
          </Button>
        </div>
        <Divider className="mt-3 mb-1 shrink-0 grow-0" />
        <Accordion.Root
          type="multiple"
          defaultValue={['packages', 'teams', 'tags']}
          className="shrink overflow-hidden"
        >
          <PackagesFilterSection
            className="flex flex-col overflow-hidden"
            packages={packages}
            stripScopeFromPackageNames={stripScopeFromPackageNames}
          />

          <Divider className="my-2 shrink-0 grow-0" />

          <TagsFilterSection tags={tags} />

          <Divider className="my-2 shrink-0 grow-0" />

          <TeamsFilterSection teams={teams} />
        </Accordion.Root>
        <div className="grow" />
        <div>
          <Text
            className="mb-1 self-center justify-self-end pt-3 text-center"
            use="help"
          >
            24 of 24 packages
          </Text>
        </div>
      </div>
    </div>
  );
}

export default GraphSidebar;
