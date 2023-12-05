import { getElementDefinitionsWithUpdatedLayout } from '@commonalityco/utils-graph';
import type { ElementDefinition } from 'cytoscape';
import MD5 from 'crypto-js/md5';
import localforage from 'localforage';

export const createWorker = () => {
  localforage.clear();

  addEventListener(
    'message',
    async (event: MessageEvent<ElementDefinition[]>) => {
      const cacheKey = MD5(JSON.stringify(event.data)).toString();
      const cachedResult = await localforage.getItem(cacheKey);

      if (cachedResult) {
        postMessage(cachedResult);
        return;
      }

      const updatedElelementDefinitions =
        await getElementDefinitionsWithUpdatedLayout({
          elements: event.data,
        });

      try {
        postMessage(updatedElelementDefinitions);
        localforage.setItem(cacheKey, updatedElelementDefinitions);
      } catch (error) {
        console.error(error);
      }
    },
  );
};
