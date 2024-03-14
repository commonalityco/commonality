import {
  decompressFromEncodedURIComponent,
  compressToEncodedURIComponent,
} from 'lz-string';
import { GraphDirection } from '../utilities/types';
import { DependencyType } from '@commonalityco/utils-core';
import {
  ParserBuilder,
  createParser,
  parseAsArrayOf,
  parseAsStringEnum,
} from 'nuqs';

export const directionParser: ReturnType<
  typeof parseAsStringEnum<GraphDirection>
> = parseAsStringEnum<GraphDirection>(
  Object.values(GraphDirection),
).withDefault(GraphDirection.LeftToRight);

export const colorParser: ReturnType<typeof parseAsArrayOf<DependencyType>> =
  parseAsArrayOf(
    parseAsStringEnum<DependencyType>(Object.values(DependencyType)),
  ).withDefault([DependencyType.PRODUCTION]);

export const packagesParser: ParserBuilder<string[]> = createParser({
  parse: (input) => JSON.parse(decompressFromEncodedURIComponent(input)),
  serialize: (input) => compressToEncodedURIComponent(JSON.stringify(input)),
});
