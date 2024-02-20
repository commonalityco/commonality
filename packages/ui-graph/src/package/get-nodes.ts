import { Dependency, Package, TagsData } from '@commonalityco/types';
import { Node } from '@xyflow/react';

const position = { x: 0, y: 0 };

export type PackageNodeData = {
  label: string;
  package: Package;
  output?: Dependency;
  input?: Dependency;
  tags: string[];
  muted: boolean;
};

export const getNodes = ({
  packages,
  dependencies,
  tagsData,
}: {
  packages: Package[];
  dependencies: Dependency[];
  tagsData: TagsData[];
}): Node<PackageNodeData>[] => {
  return packages.map((pkg) => {
    const input = dependencies.find((dep) => dep.target === pkg.name);
    const output = dependencies.find((dep) => dep.source === pkg.name);

    const tags = tagsData
      .filter((data) => data.packageName === pkg.name)
      .flatMap((data) => data.tags);

    return {
      id: pkg.name,
      type: 'package',
      width: 350,
      height: 100,
      draggable: false,
      data: {
        label: pkg.name,
        package: pkg,
        input,
        output,
        tags,
        muted: false,
      },
      connectable: false,
      position,
    };
  });
};
