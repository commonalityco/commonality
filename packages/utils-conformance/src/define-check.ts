import { Check } from '@commonalityco/utils-core';

type CheckCreator<C extends Check, O extends unknown[]> = (...args: O) => C;

export function defineCheck<T extends Check, O extends unknown[]>(
  checkCreator: CheckCreator<T, O>,
): CheckCreator<T, O> {
  return checkCreator;
}
