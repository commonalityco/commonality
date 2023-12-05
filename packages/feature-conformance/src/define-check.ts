import type { Conformer, CheckCreator } from '@commonalityco/types';

export function defineCheck<T extends Conformer, O>(
  checkCreator: CheckCreator<T, O>,
): CheckCreator<T, O> {
  return checkCreator;
}
