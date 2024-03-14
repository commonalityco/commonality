import { useQueryState } from 'nuqs';
import { colorParser, directionParser, packagesParser } from './query-parsers';
import { GraphDirection } from '../utilities/types';
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

export const usePackagesQuery = () => {
  return useQueryState(
    'packages',
    packagesParser.withOptions({ shallow: false }),
  );
};
