import { Dependency, Package } from '@commonalityco/types';
import { Button } from '@commonalityco/ui-button';
import {
  BookOpenIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { VirtualElement } from '@popperjs/core';
import { ComponentProps, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import { graphEvents } from 'utils/graph/graphEvents';
import { useClickAway } from 'react-use';
import * as DescriptionList from '@commonalityco/ui-description-list';
import { cva } from 'class-variance-authority';
import { getIconForPackage } from 'utils/get-icon-for-package';
import { formatPackageName } from 'utils/format-package-name';
import { Divider } from '@commonalityco/ui-divider';
import Link from 'next/link';
import { slugifyPackageName } from 'utils/slugify-package-name';

interface PackageContentProps {
  onHide: ComponentProps<typeof Button>['onClick'];
  onFocus: ComponentProps<typeof Button>['onClick'];
  pkg: Package;
  stripScope?: boolean;
}

function DropdownButtonIcon({ children }: { children: React.ReactNode }) {
  return <div className="w-6">{children}</div>;
}

function DropdownButton({
  children,
  ...restProps
}: ComponentProps<typeof Button>) {
  return (
    <Button
      use="ghost"
      className="mb-2 w-full justify-start px-2 last:mb-0"
      {...restProps}
    >
      {children}
    </Button>
  );
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
      <Link href={`/learn/${slugifyPackageName(pkg.name)}`}>
        <DropdownButton>
          <DropdownButtonIcon>
            <BookOpenIcon className="mr-1 h-4 w-4" />
          </DropdownButtonIcon>
          View documentation
        </DropdownButton>
      </Link>

      <Divider className="my-2" />

      <DropdownButton onClick={onHide}>
        <DropdownButtonIcon>
          <EyeSlashIcon className="mr-1 h-4 w-4" />
        </DropdownButtonIcon>
        Hide
      </DropdownButton>
      <DropdownButton
        onClick={() => graphEvents.emit('Isolate', { id: pkg.name })}
      >
        <DropdownButtonIcon>
          <MagnifyingGlassIcon className="mr-1 h-4 w-4" />
        </DropdownButtonIcon>
        Isolate
      </DropdownButton>
      <DropdownButton onClick={onFocus}>
        <DropdownButtonIcon>
          <MagnifyingGlassIcon className="mr-1 h-4 w-4" />
        </DropdownButtonIcon>
        Focus
      </DropdownButton>
      <DropdownButton
        onClick={() => graphEvents.emit('ShowDependencies', { id: pkg.name })}
      >
        <DropdownButtonIcon>
          <MagnifyingGlassIcon className="mr-1 h-4 w-4" />
        </DropdownButtonIcon>
        Show dependencies
      </DropdownButton>
      <DropdownButton
        onClick={() => graphEvents.emit('HideDependencies', { id: pkg.name })}
      >
        <DropdownButtonIcon>
          <MagnifyingGlassIcon className="mr-1 h-4 w-4" />
        </DropdownButtonIcon>
        Hide dependencies
      </DropdownButton>
      <DropdownButton
        onClick={() => graphEvents.emit('ShowDependents', { id: pkg.name })}
      >
        <DropdownButtonIcon>
          <MagnifyingGlassIcon className="mr-1 h-4 w-4" />
        </DropdownButtonIcon>
        Show dependents
      </DropdownButton>
      <DropdownButton
        onClick={() => graphEvents.emit('HideDependents', { id: pkg.name })}
      >
        <DropdownButtonIcon>
          <MagnifyingGlassIcon className="mr-1 h-4 w-4" />
        </DropdownButtonIcon>
        Hide dependents
      </DropdownButton>
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
      className="z-50 rounded-md border border-zinc-100 bg-white p-2 text-sm text-zinc-800 shadow dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      <div>
        <Component
          {...(currentTooltipData.props as any)}
          stripScope={stripScope}
        />
      </div>
      <div ref={setArrowElement} style={styles.arrow} />
    </div>
  );
};

export default Tooltip;
