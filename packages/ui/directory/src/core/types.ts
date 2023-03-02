export type TreeNode<Data> = {
  path?: string;
  label: string;
  data?: Data;
  children: TreeNode<Data>[];
};

export type TreeItem<Data> = {
  name: string;
  path: string;
  data?: Data;
};
