'use server';
import { getUpdatedGraphJson } from '@commonalityco/utils-graph';

export async function getUpdatedGraphJsonAction(
  ...args: Parameters<typeof getUpdatedGraphJson>
) {
  return getUpdatedGraphJson(...args);
}
