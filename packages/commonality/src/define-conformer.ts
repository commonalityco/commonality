import type { ConformerCreator } from '@commonalityco/types';

export function defineConformer<T>(conformerCreator: ConformerCreator<T>) {
  return conformerCreator;
}
