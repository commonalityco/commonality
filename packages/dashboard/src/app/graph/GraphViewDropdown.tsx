import React from 'react';
import * as DropdownMenu from '@commonalityco/ui-dropdown-menu';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { graphEvents } from 'utils/graph/graphEvents';
import { Package } from '@commonalityco/types';

function GraphViewDropdown({
  children,
  pkg,
}: {
  children: React.ReactNode;
  pkg: Package;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Item>Open documentation</DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            View options
            <DropdownMenu.RightSlot>
              <ChevronRightIcon className="h-4 w-4" />
            </DropdownMenu.RightSlot>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item
              onClick={() =>
                graphEvents.emit('Hide', {
                  selector: `node[name="${pkg.name}"]`,
                })
              }
            >
              Hide
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() =>
                graphEvents.emit('Focus', {
                  selector: `node[name="${pkg.name}"]`,
                })
              }
            >
              Focus
            </DropdownMenu.Item>
            <DropdownMenu.Item>Isolate</DropdownMenu.Item>
            <DropdownMenu.Item>Show dependents</DropdownMenu.Item>
            <DropdownMenu.Item>Hide dependents</DropdownMenu.Item>
            <DropdownMenu.Item>Show dependencies</DropdownMenu.Item>
            <DropdownMenu.Item>Hide dependencies</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default GraphViewDropdown;
