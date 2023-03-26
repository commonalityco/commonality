import React, { Fragment, useMemo, useState } from 'react';
import { Icon } from '@commonalityco/ui-icon';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Checkbox, CheckboxProps } from '@commonalityco/ui-checkbox';
import xor from 'lodash.xor';
import { getDirectoryTreeFromNodes } from './core/getDirectoryTreeFromNodes';
import { TreeItem, TreeNode } from './core/types';
import clsx from 'clsx';
import { Tag } from '@commonalityco/ui-tag';

export interface DirectoryProps<Data> {
  items?: TreeItem<Data>[];
  selectedPaths?: string[];
  onPathsSelect?: (paths: string[]) => void;
  formatLabel?: (node: TreeNode<Data>) => React.ReactNode;
}

function TreeNodeItem<Data>({
  checked,
  children,
  depth,
  node,
  formatLabel = (node) => node?.label,
  onSelect = () => {},
}: {
  checked?: CheckboxProps['checked'];
  onSelect?: (node: TreeNode<Data>, checked: CheckboxProps['checked']) => any;
  depth: number;
  children: React.ReactNode;
  formatLabel?: DirectoryProps<Data>['formatLabel'];
  node: TreeNode<Data>;
}) {
  const [isOpen, setIsOpen] = useState(depth === 0);

  if (depth === 0) {
    return <>{children}</>;
  }

  const indents = useMemo(() => {
    const indents = [];
    const usedDepth = node.children.length === 0 ? depth - 1 : depth;

    for (let i = 1; i < usedDepth; i++) {
      indents.push(
        <div className="inline-block w-[6px] mr-3 h-9 relative flex-shrink-0 flex-grow-0 border-r border-zinc-100 dark:border-zinc-800" />
      );
    }
    return indents;
  }, [depth]);

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-nowrap items-center">
        {depth > 1 && indents}
        <Collapsible.CollapsibleTrigger
          className={clsx(
            'group rounded bg-transparent text-left block shrink grow-0 border-none cursor-pointer w-full rounded-tl-none rounded-bl-none dark:hover:text-white',
            { 'mr-0': !node.children.length, rounded: depth <= 1 }
          )}
        >
          <div className="h-9 flex flex-nowrap items-center">
            {node.children.length ? (
              <Icon
                className="mr-2 text-zinc-400"
                width={12}
                height={12}
                icon={isOpen ? (faAngleDown as any) : (faAngleRight as any)}
              />
            ) : null}
            <p className="text-zinc-600 dark:text-zinc-300 text-sm break-keep truncate w-full group-hover:text-sky-600 dark:group-hover:text-sky-400">
              {node.children.length ? (
                <span className="flex gap-2 flex-nowrap">
                  <span>{node.label}</span>
                  <Tag use="secondary">{node.children.length}</Tag>
                </span>
              ) : (
                <span>{formatLabel(node)}</span>
              )}
            </p>
          </div>
        </Collapsible.CollapsibleTrigger>
        <Checkbox
          title={`Toggle visibility of ${node.path}`}
          checked={checked}
          onCheckedChange={(checked) => {
            return onSelect(node, checked);
          }}
        />
      </div>
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}

export function Directory<Data>({
  items,
  selectedPaths = [],
  onPathsSelect = () => {},
  formatLabel,
  ...restProps
}: DirectoryProps<Data>) {
  const [controlledSelectedPaths, setControlledSelectedPaths] =
    useState<string[]>(selectedPaths);
  const usedSelectedPaths = selectedPaths || controlledSelectedPaths;

  const tree = useMemo(() => {
    return getDirectoryTreeFromNodes(items);
  }, [items]);

  // Should return all selected leaf node paths
  const handleSelect = (
    node: TreeNode<Data>,
    checked: CheckboxProps['checked']
  ) => {
    if (!items || !node.path) {
      return;
    }

    const itemDirs = items.map((item) => item.path);
    const relevantItems = itemDirs.filter((itemDir) => {
      const itemDirParts = itemDir.split('/');
      const nodePathParts = node.path ? node.path.split('/') : [];

      return nodePathParts.every((nodePathPart) => {
        return itemDirParts.includes(nodePathPart);
      });
    });

    if (checked === true) {
      const newSelectedPaths = [...usedSelectedPaths, ...relevantItems];

      setControlledSelectedPaths(newSelectedPaths);
      onPathsSelect(newSelectedPaths);
    } else if (checked === 'indeterminate') {
    } else {
      const newSelectedPaths = xor(relevantItems, usedSelectedPaths);

      setControlledSelectedPaths(newSelectedPaths);
      onPathsSelect(newSelectedPaths);
    }
  };

  const getNodes = (node: TreeNode<Data>, depth: number): React.ReactNode => {
    const getIsRelatedPath = (path: string) => {
      return usedSelectedPaths?.some((selectedPath) => {
        const selectedDirParts = selectedPath.split('/');
        const pathParts = path.split('/');

        return pathParts.every((pathPart) => {
          return selectedDirParts.includes(pathPart);
        });
      });
    };

    const relatedPath = node.path ? getIsRelatedPath(node.path) : false;

    const indeterminate =
      relatedPath &&
      node.children.some((child) => {
        if (!child.path) {
          return false;
        }

        return !getIsRelatedPath(child.path);
      });

    const isParentOfLeafNode =
      node.children.length === 1 &&
      node.children.every((child) => child.children.length === 0);

    if (node.path === '/' || isParentOfLeafNode) {
      return (
        <Fragment key={node.label}>
          {node.children.map((childNode) => {
            return getNodes(childNode, depth + 1);
          })}
        </Fragment>
      );
    }

    return (
      <TreeNodeItem
        key={node.label}
        node={node}
        depth={depth}
        onSelect={handleSelect}
        formatLabel={formatLabel}
        checked={indeterminate ? 'indeterminate' : relatedPath}
      >
        <>
          {node.children.map((childNode) => {
            return getNodes(childNode, depth + 1);
          })}
        </>
      </TreeNodeItem>
    );
  };

  return (
    <div
      {...restProps}
      className={clsx(
        'text-zinc-500 whitespace-nowrap break-keep overflow-hidden'
      )}
    >
      {tree && getNodes(tree, 0)}
    </div>
  );
}

Directory.defaultProps = {
  use: 'default',
} as DirectoryProps<{}>;
