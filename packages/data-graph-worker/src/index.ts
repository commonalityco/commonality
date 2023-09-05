import { getElementDefinitionsWithUpdatedLayout } from '@commonalityco/utils-graph';
import type { ElementDefinition } from 'cytoscape';
import MD5 from 'crypto-js/md5.js';
import localforage from 'localforage';

export const createWorker = () => {
  addEventListener(
    'message',
    async (event: MessageEvent<ElementDefinition[]>) => {
      console.log({ data: event.data });
      const cacheKey = MD5(JSON.stringify(event.data)).toString();
      const cachedResult = await localforage.getItem(cacheKey);

      if (cachedResult) {
        console.log('CACHE HIT');
        postMessage(cachedResult);
        return;
      }

      console.log('CACHE MISS');

      const updatedElelementDefinitions =
        await getElementDefinitionsWithUpdatedLayout({
          elements: event.data,
        });

      try {
        postMessage(updatedElelementDefinitions);
        localforage.clear();
        localforage.setItem(cacheKey, updatedElelementDefinitions);
      } catch (error) {
        console.error(error);
      }
    },
  );
};
