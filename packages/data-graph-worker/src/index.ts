import { getElementDefinitionsWithUpdatedLayout } from '@commonalityco/utils-graph';
import { ElementDefinition } from 'cytoscape';

addEventListener(
  'message',
  async (event: MessageEvent<ElementDefinition[]>) => {
    const updatedElelementDefinitions =
      await getElementDefinitionsWithUpdatedLayout({
        elements: event.data,
      });

    try {
      postMessage(updatedElelementDefinitions);
    } catch (error) {
      console.error(error);
    }
  }
);
