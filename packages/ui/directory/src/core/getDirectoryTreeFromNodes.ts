import { TreeItem, TreeNode } from './types';

export function getDirectoryTreeFromNodes<Data>(
  items?: TreeItem<Data>[]
): TreeNode<Data> {
  if (!items) {
    return { label: 'root', children: [] };
  }

  const children: TreeNode<Data>[] = [];

  const level = { children };

  items.forEach((item) => {
    const dirParts = item.path.split('/').filter(Boolean);

    dirParts.reduce((r: Record<string, any>, name: string, index) => {
      const isLeafDir = index === dirParts.length - 1;
      const path = r.path ? `${r.path}/${name}` : name;

      if (!r[name]) {
        r[name] = {
          id: name,
          label: name,
          path,
          children: isLeafDir
            ? [
                {
                  label: item.name,
                  path: item.path,
                  data: item.data,
                  children: [],
                },
              ]
            : [],
        } as TreeNode<Data>;

        // Grouping nodes
        r.children.push({
          label: name,
          path,
          children: r[name].children,
        } as TreeNode<Data>);
      }

      return r[name];
    }, level);
  });

  return { path: '/', label: 'root', children };
}
