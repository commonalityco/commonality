'use client';
import { ComponentProps, useState } from 'react';
import * as Accordion from '@commonalityco/ui-accordion';
import { Divider } from '@commonalityco/ui-divider';
import { Package } from '@commonalityco/types';
import { TextInput } from '@commonalityco/ui-text-input';
import { Button } from '@commonalityco/ui-button';
import { Tag } from '@commonalityco/ui-tag';
import * as Tooltip from '@commonalityco/ui-tooltip';
import {
  CubeIcon,
  EyeIcon,
  TagIcon,
  UsersIcon,
} from '@heroicons/react/20/solid';
import { EyeIcon as EyeIconOutline } from '@heroicons/react/24/outline';
import { useAtomValue } from 'jotai';
import { graphManagerAtom, visibleElementsAtom } from 'atoms/graph';
import { IconButton } from '@commonalityco/ui-icon-button';
import { cva } from 'class-variance-authority';
import { TargetIcon } from '@radix-ui/react-icons';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { EyeSlashIcon as EyeSlashIconOutline } from '@heroicons/react/24/outline';
import { graphEvents } from 'utils/graph/graphEvents';

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
                <EyeIconOutline className="h-4 w-4 opacity-100 group-hover:opacity-0 absolute transition" />
                <EyeSlashIconOutline className="h-4 w-4 opacity-0 group-hover:opacity-100 absolute transition" />
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
        <IconButton onClick={onClick} use="secondary" size="sm">
          <TargetIcon className="h-4 w-4" />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content>Focus</Tooltip.Content>
    </Tooltip.Root>
  );
}

function PackagesFilterSection({ packages }: { packages: Package[] }) {
  const [search, setSearch] = useState('');
  const graphManager = useAtomValue(graphManagerAtom);
  const visibleElements = useAtomValue(visibleElementsAtom);

  const filteredPackages = search
    ? packages.filter((pkg) => pkg.name.includes(search))
    : packages;

  return (
    <Accordion.Item value="packages">
      <Accordion.Trigger>
        <div className="flex flex-nowrap items-center gap-2">
          <CubeIcon className="h-5 w-5" /> Packages
        </div>
      </Accordion.Trigger>
      <Accordion.Content>
        <TextInput
          className="mb-3"
          search
          placeholder="Search for a package"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {filteredPackages.map((pkg) => {
          const isPackageVisible = Boolean(
            visibleElements?.getElementById(pkg.name).length
          );

          return (
            <div
              key={pkg.name}
              className="flex flex-nowrap items-center mb-3 gap-1"
            >
              <Button
                use="ghost"
                size="sm"
                className="w-full justify-start px-3"
                onClick={() =>
                  graphEvents.emit('Fit', {
                    selector: `node[name="${pkg.name}"]`,
                    padding: 200,
                  })
                }
              >
                {pkg.name}
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

function TagsFilterSection({ tags }: { tags: string[] }) {
  const graphManager = useAtomValue(graphManagerAtom);
  const visibleElements = useAtomValue(visibleElementsAtom);

  return (
    <Accordion.Item value="tags">
      <Accordion.Trigger>
        <div className="flex flex-nowrap items-center gap-2">
          <TagIcon className="h-5 w-5" /> Tags
        </div>
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

function TeamsFilterSection({ teams }: { teams: string[] }) {
  const graphManager = useAtomValue(graphManagerAtom);
  const visibleElements = useAtomValue(visibleElementsAtom);

  return (
    <Accordion.Item value="teams">
      <Accordion.Trigger>
        <div className="flex flex-nowrap items-center gap-2">
          <UsersIcon className="h-5 w-5" /> Teams
        </div>
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
}: {
  packages: Package[];
  tags: string[];
  teams: string[];
}) {
  const graphManager = useAtomValue(graphManagerAtom);

  return (
    <div className="h-full basis-72 w-72 shrink-0 grow-0 border-r border-zinc-300 dark:border-zinc-600">
      <div className="flex flex-nowrap gap-2 px-3 py-2">
        <Button
          use="secondary"
          className="w-full"
          onClick={() => {
            graphEvents.emit('ShowAll');
          }}
        >
          <div className="flex gap-2 items-center">
            <EyeIconOutline className="h-4 w-4" />
            Show all
          </div>
        </Button>
        <Button
          use="secondary"
          className="w-full"
          onClick={() => {
            graphEvents.emit('HideAll');
          }}
        >
          <div className="flex gap-2 items-center">
            <EyeSlashIconOutline className="h-4 w-4" />
            Hide all
          </div>
        </Button>
      </div>
      <Divider />
      <Accordion.Root
        type="multiple"
        className="h-full"
        defaultValue={['packages', 'tags', 'teams']}
      >
        <PanelGroup direction="vertical" autoSaveId="commonality-sidebar">
          <Panel>
            <PackagesFilterSection packages={packages} />
          </Panel>
          <PanelResizeHandle className="py-1">
            <Divider />
          </PanelResizeHandle>
          <Panel>
            <TagsFilterSection tags={tags} />
          </Panel>
          <PanelResizeHandle className="py-1">
            <Divider />
          </PanelResizeHandle>
          <Panel>
            <TeamsFilterSection teams={teams} />
          </Panel>
        </PanelGroup>
      </Accordion.Root>
    </div>
  );
}

export default GraphSidebar;
