import { diff as jestDiff, diffStringsUnified } from 'jest-diff';
import chalk from 'chalk';
import { format as prettyFormat } from 'pretty-format';

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
  const result = jestDiff(
    prettyFormat(source),
    prettyFormat(target),
    diffOptions,
  );

  return result ?? undefined;
}
