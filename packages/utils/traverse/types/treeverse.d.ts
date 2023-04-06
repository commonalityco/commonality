declare module 'treeverse' {
  export function depth<Node>(options: {
    tree: Node;
    getChildren: (node: Node) => Node[];
    leave?: (node: Node, children: Node[]) => void;
    visit?: (treeNode: any) => Node;
  }): Promise<void>;

  export function breadth<Node>(options: {
    tree: Node;
    getChildren: (node: Node) => Node[];
    visit?: (node: Node) => Node;
  }): Promise<void>;
}
