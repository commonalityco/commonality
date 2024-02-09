import { diff as jestDiff } from 'jest-diff';
import chalk from 'chalk';
import isEqual from 'lodash-es/isEqual';

const diffOptions = {
  omitAnnotationLines: true,
  aColor: chalk.dim,
  bColor: chalk.red,
  changeColor: chalk.red,
  commonColor: chalk.dim,
  aIndicator: ' ',
  bIndicator: '+',
} as const;

/**
 * Generates a diff string highlighting the differences between `source` and `target`.
 * Values present in `target` but not in `source` are highlighted in red with a `+` prefix.
 *
 * Documentation: https://docs.commonality.co/reference/diff
 *
 * @param source - The source value to compare. This can be any value.
 * @param target - The target value to compare against the source. This can be any value.
 * @returns A string representing the diff between `source` and `target`, or `undefined` if they are equal.
 *
 * @example
 * diff('first', 'second');
 * //   first
 * // + second
 *
 * @example
 * diff(
 *   { name: 'my-package', version: '1.0.0' },
 *   { name: 'my-package', version: '2.0.0' },
 * );
 * //   Object {
 * //     "name": "my-package",
 * //     "version": "1.0.0",
 * // +   "version": "2.0.0",
 * //   }
 */
export function diff<T, K>(source: T, target: K): string | undefined {
  if (isEqual(source, target)) {
    return;
  }

  const result = jestDiff(source, target, diffOptions);

  return result ?? undefined;
}
