import { Dependency, Package } from '@commonalityco/types';
import { Button } from '@commonalityco/ui-button';
import {
  ArrowDownIcon,
  CubeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { VirtualElement } from '@popperjs/core';
import { BoxIcon, TargetIcon } from '@radix-ui/react-icons';
import { ComponentProps, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { graphEvents } from 'utils/graph/graphEvents';
import { useClickAway } from 'react-use';
import * as DescriptionList from '@commonalityco/ui-description-list';
import { Tag } from '@commonalityco/ui-tag';
import { cva } from 'class-variance-authority';
import { Heading } from '@commonalityco/ui-heading';
import { getIconForPackage } from 'utils/get-icon-for-package';
import { formatPackageName } from 'utils/format-package-name';

interface PackageContentProps {
  onHide: ComponentProps<typeof Button>['onClick'];
  onFocus: ComponentProps<typeof Button>['onClick'];
  pkg: Package;
  stripScope?: boolean;
}

const PackageContent = ({
  onHide,
  onFocus,
  pkg,
  stripScope,
}: PackageContentProps) => {
  const IconForPackage = getIconForPackage(pkg);
  const formattedPackageName = formatPackageName(pkg.name, {
    stripScope: stripScope ?? true,
  });

  return (
    <>
      <div className="mb-3 flex flex-nowrap items-center gap-2">
        <div className="flex flex-nowrap gap-2">
          <IconForPackage className="h-5 w-5" />
          <Heading size="sm" as="p">
            {formattedPackageName}
          </Heading>
        </div>
        <span className="font-mono">{pkg.version}</span>
      </div>
      <DescriptionList.Root className="mb-3">
        {pkg.tags?.length ? (
          <>
            <DescriptionList.Term>Tags</DescriptionList.Term>
            <DescriptionList.Details>
              {pkg.tags.map((tag) => {
                return <Tag key={tag}>{`#${tag}`}</Tag>;
              })}
            </DescriptionList.Details>
          </>
        ) : null}
        {pkg.owners?.length ? (
          <>
            <DescriptionList.Term>Owners</DescriptionList.Term>
            <DescriptionList.Details>{pkg.owners}</DescriptionList.Details>
          </>
        ) : null}
      </DescriptionList.Root>

      <Button use="secondary" className="mb-2 w-full" onClick={onHide}>
        <EyeSlashIcon className="mr-1 h-4 w-4" />
        <span>Hide</span>
      </Button>
      <Button use="secondary" className="w-full" onClick={onFocus}>
        <TargetIcon className="mr-1 h-4 w-4" />
        <span>Focus</span>
      </Button>
    </>
  );
};

interface DependencyContentProps {
  dependency: Dependency & { target: string; source: string };
}

const statusDotStyles = cva('h-2 w-2 rounded-full', {
  variants: {
    type: {
      PRODUCTION: 'bg-green-500',
      DEVELOPMENT: 'bg-blue-500',
      PEER: 'bg-purple-500',
    },
  },
});

const TextByType = {
  PRODUCTION: 'Production',
  DEVELOPMENT: 'Development',
  PEER: 'Peer',
};

const DependencyContent = ({ dependency }: DependencyContentProps) => {
  return (
    <>
      <DescriptionList.Root>
        <DescriptionList.Term>Source</DescriptionList.Term>
        <DescriptionList.Details>{dependency.source}</DescriptionList.Details>
        <DescriptionList.Term>Target</DescriptionList.Term>
        <DescriptionList.Details>{dependency.target}</DescriptionList.Details>
        <DescriptionList.Term>Type</DescriptionList.Term>
        <DescriptionList.Details>
          <div className="flex flex-nowrap items-center gap-2">
            <span className="leading-none">{TextByType[dependency.type]}</span>
            <div className={statusDotStyles({ type: dependency.type })} />
          </div>
        </DescriptionList.Details>
        <DescriptionList.Term>Version</DescriptionList.Term>
        <DescriptionList.Details className="mb-2 font-mono text-sm">
          {dependency.version}
        </DescriptionList.Details>
      </DescriptionList.Root>
    </>
  );
};

type PackageTooltipData = {
  type: 'package';
  ref: VirtualElement;
  props: PackageContentProps;
};
type DependencyTooltipData = {
  type: 'dependency';
  ref: VirtualElement;
  props: DependencyContentProps;
};
type CurrentTooltipData = PackageTooltipData | DependencyTooltipData;

const Tooltip = ({ stripScope }: { stripScope?: boolean }) => {
  const [currentTooltipData, setCurrentTooltipData] =
    useState<CurrentTooltipData | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  useClickAway({ current: popperElement }, () => setCurrentTooltipData(null));

  const { styles, attributes, update } = usePopper(
    currentTooltipData?.ref,
    popperElement,
    {
      placement: 'top',
      modifiers: [
        { name: 'arrow', options: { element: arrowElement } },
        {
          name: 'offset',
          options: {
            offset: [0, 4],
          },
        },
      ],
    }
  );

  useEffect(() => {
    const onPackageClick = ({
      ref,
      data,
    }: {
      ref: VirtualElement;
      data: Package;
    }) =>
      setCurrentTooltipData({
        type: 'package',
        ref,
        props: {
          pkg: data,
          onHide: () => {
            graphEvents.emit('Hide', {
              selector: `node[name="${data.name}"]`,
            });
          },
          onFocus: () => {
            graphEvents.emit('Focus', {
              selector: `node[name="${data.name}"]`,
            });
          },
        },
      });

    const onDependencyClick = ({
      ref,
      data,
    }: {
      ref: VirtualElement;
      data: Dependency & { target: string; source: string };
    }) =>
      setCurrentTooltipData({
        type: 'dependency',
        ref,
        props: { dependency: data },
      });

    const onMove = () => {
      if (!update) return;

      setCurrentTooltipData(null);
      update();
    };

    graphEvents.on('PackageClick', onPackageClick);
    graphEvents.on('DependencyClick', onDependencyClick);
    graphEvents.on('Move', onMove);

    return () => {
      graphEvents.off('PackageClick', onPackageClick);
      graphEvents.off('DependencyClick', onDependencyClick);
      graphEvents.off('Move', onMove);
    };
  }, [update]);

  if (!currentTooltipData) return null;

  const ComponentByType = {
    package: PackageContent,
    dependency: DependencyContent,
  } as const;

  const Component = ComponentByType[currentTooltipData.type];

  return (
    <div
      id="hello"
      className="z-50 rounded border border-zinc-100 bg-white p-3 text-sm text-zinc-800 shadow dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      <Component
        {...(currentTooltipData.props as any)}
        stripScope={stripScope}
      />

      <div ref={setArrowElement} style={styles.arrow} />
    </div>
  );
};

export default Tooltip;
