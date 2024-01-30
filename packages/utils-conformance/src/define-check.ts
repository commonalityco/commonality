import { CheckInput } from '@commonalityco/utils-core';

type CheckCreator<C extends CheckInput, O extends unknown[]> = (
  ...args: O
) => C;

export function defineCheck<T extends CheckInput, O extends unknown[]>(
  checkCreator: CheckCreator<T, O>,
): CheckCreator<T, O> {
  return checkCreator;
}
