'use client';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Heading } from '@commonalityco/ui-heading';
import { Text } from '@commonalityco/ui-text';
import { Tag as UITag } from '@commonalityco/ui-tag';
import { useMemo } from 'react';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@commonalityco/ui-icon-button';
import * as DropdownMenu from '@commonalityco/ui-dropdown-menu';
import { LogoNext } from '@/images/logo-next';
import { LogoReact } from '@/images/logo-react';
import { LogoNode } from '@/images/logo-node';
import { formatPackageName } from '@/utils/format-package-name';
import { Package, PackageType } from '@commonalityco/types';
import { getPackageType } from '@/utils/get-package-type';

interface LocalDependencyNodeProperties {
  id: string;
  selected: boolean;
  data: Package;
}

const ICON_BY_TYPE = {
  [PackageType.NODE]: <LogoNode height={16} width={16} />,
  [PackageType.NEXT]: <LogoNext height={16} width={16} />,
  [PackageType.REACT]: <LogoReact height={16} width={16} />,
} as const;

function Unmemoized({ data, selected }: LocalDependencyNodeProperties) {
  const packageType = useMemo(() => {
    return getPackageType(data);
  }, [data]);
  // const projectResult = trpc.project.get.useQuery({
  //   slug: router.query.project as string,
  // });

  // if (projectResult.isLoading) {
  //   return null;
  // }

  return (
    <>
      <div className="h-full w-full cursor-pointer rounded border border-zinc-300 bg-white py-3 pl-5 pr-3 drop-shadow-sm transition hover:border-sky-600 dark:border-zinc-600 dark:bg-zinc-900 hover:dark:border-sky-400">
        <Handle type="target" position={Position.Top} isConnectable={false} />
        <div className="mb-2 flex items-center gap-2">
          <div className="shrink">{ICON_BY_TYPE[packageType]}</div>
          <Heading
            className="min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
            size="sm"
          >
            {formatPackageName(data.name, {
              stripScope: true,
            })}
          </Heading>

          <div className="grow" />

          <Text className="leading-none">{data.version}</Text>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <IconButton use="ghost" icon={faEllipsisVertical} size="sm" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
              ></DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <div>
          {data.owners?.map((owner) => (
            <Text className="mb-2 text-xs font-medium leading-none" key={owner}>
              {owner}
            </Text>
          ))}
        </div>
        {data?.tags?.map((tag, index) => (
          <UITag key={index}>{tag}</UITag>
        ))}

        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={false}
        />
      </div>
    </>
  );
}

export const LocalDependencyNode = memo(Unmemoized);
