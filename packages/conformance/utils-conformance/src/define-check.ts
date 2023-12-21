import { Check } from '@commonalityco/utils-core';

type CheckCreator<T extends Check, O = undefined> = (options?: O) => T;

export function defineCheck<T extends Check, O>(
  checkCreator: CheckCreator<T, O>,
): CheckCreator<T, O> {
  return checkCreator;
}
