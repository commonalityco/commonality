import {
  CodeownersData,
  Dependency,
  Package,
  TagsData,
} from '@commonalityco/types';
import { Node } from 'reactflow';

const position = { x: 0, y: 0 };

export type PackageNodeData = {
  label: string;
  package: Package;
  output?: Dependency;
  input?: Dependency;
  tags: string[];
  codeowners: string[];
  muted: boolean;
};

export const getNodes = ({
  packages,
  dependencies,
  tagsData,
  codeownersData,
}: {
  packages: Package[];
  dependencies: Dependency[];
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
}): Node<PackageNodeData>[] => {
  return packages.map((pkg) => {
    const input = dependencies.find((dep) => dep.target === pkg.name);
    const output = dependencies.find((dep) => dep.source === pkg.name);

    const tags = tagsData
      .filter((data) => data.packageName === pkg.name)
      .flatMap((data) => data.tags);

    const codeowners = codeownersData
      .filter((data) => data.packageName === pkg.name)
      .flatMap((data) => data.codeowners);

    return {
      id: pkg.name,
      type: 'package',
      width: 300,
      height: 90,
      draggable: false,
      data: {
        label: pkg.name,
        package: pkg,
        input,
        output,
        tags,
        codeowners,
        muted: false,
      },
      connectable: false,
      position,
    };
  });
};
