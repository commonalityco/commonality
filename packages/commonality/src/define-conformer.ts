import type { Conformer, ConformerCreator } from '@commonalityco/types';

export function defineConformer<T extends Conformer, O>(
  conformerCreator: ConformerCreator<T, O>,
): ConformerCreator<T, O> {
  return conformerCreator;
}
