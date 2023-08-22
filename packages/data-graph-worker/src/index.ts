import { getElementDefinitionsWithUpdatedLayout } from '@commonalityco/utils-graph';
import type { ElementDefinition } from 'cytoscape';

export const createWorker = () => {
  addEventListener(
    'message',
    async (event: MessageEvent<ElementDefinition[]>) => {
      console.log('RECEIVED MESSAGE');
      const updatedElelementDefinitions =
        await getElementDefinitionsWithUpdatedLayout({
          elements: event.data,
        });

      try {
        postMessage(updatedElelementDefinitions);
      } catch (error) {
        console.error(error);
      }
    },
  );
};
