import { useQueryState } from 'nuqs';
import { colorParser, directionParser, packagesParser } from './query-parsers';
import { Package } from '@commonalityco/types';
import { GraphDirection } from '@commonalityco/ui-graph';
import { DependencyType } from '@commonalityco/utils-core';

export const useDirectionQuery = () => {
  return useQueryState(
    'direction',
    directionParser
      .withDefault(GraphDirection.LeftToRight)
      .withOptions({ shallow: false }),
  );
};

export const useColorQuery = () => {
  return useQueryState(
    'color',
    colorParser
      .withDefault([DependencyType.PRODUCTION])
      .withOptions({ shallow: false }),
  );
};

export const usePackagesQuery = ({ packages }: { packages: Package[] }) => {
  return useQueryState(
    'packages',
    packagesParser
      .withDefault(packages.map((p) => p.name))
      .withOptions({ shallow: false }),
  );
};
