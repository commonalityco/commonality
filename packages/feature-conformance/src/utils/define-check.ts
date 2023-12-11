import type { Check, CheckCreator } from '@commonalityco/types';

export function defineCheck<T extends Check, O>(
  checkCreator: CheckCreator<T, O>,
): CheckCreator<T, O> {
  return checkCreator;
}
