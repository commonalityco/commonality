import { diff as jestDiff } from 'jest-diff';
import chalk from 'chalk';
import isEqual from 'lodash-es/isEqual';

const diffOptions = {
  omitAnnotationLines: true,
  aColor: chalk.dim,
  bColor: chalk.red,
  changeColor: chalk.red,
  commonColor: chalk.green.dim,
  aIndicator: ' ',
  bIndicator: '+',
} as const;

export function diff<T, K>(source: T, target: K): string | undefined {
  if (isEqual(source, target)) {
    return;
  }

  const result = jestDiff(source, target, diffOptions);

  return result ?? undefined;
}
