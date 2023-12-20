import type { Check } from '@commonalityco/utils-core';

type CheckCreator<C extends Check, O = undefined> = (options?: O) => C;

export function defineCheck<T extends Check, O>(
  checkCreator: CheckCreator<T, O>,
): CheckCreator<T, O> {
  return checkCreator;
}
