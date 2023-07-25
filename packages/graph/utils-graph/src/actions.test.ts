import { show, showDependencies, showDependants } from './actions';
import cytoscape, {
  EdgeDefinition,
  ElementDefinition,
  NodeDefinition,
} from 'cytoscape';
import { describe, it, expect } from 'vitest';

const nodeOne = {
  group: 'nodes',
  data: {
    id: 'one',
  },
} satisfies NodeDefinition;
const nodeTwo = {
  group: 'nodes',
  data: {
    id: 'two',
  },
} satisfies NodeDefinition;
const nodeThree = {
  group: 'nodes',
  data: {
    id: 'three',
  },
} satisfies NodeDefinition;

const edgeOne = {
  group: 'edges',
  data: {
    id: 'one->two',
    source: 'one',
    target: 'two',
  },
} satisfies EdgeDefinition;
const edgeTwo = {
  group: 'edges',
  data: {
    id: 'two->three',
    source: 'two',
    target: 'three',
  },
} satisfies EdgeDefinition;
const edgeThree = {
  group: 'edges',
  data: {
    id: 'one->three',
    source: 'one',
    target: 'three',
  },
} satisfies EdgeDefinition;

const elements = [
  nodeOne,
  nodeTwo,
  nodeThree,
  edgeOne,
  edgeTwo,
  edgeThree,
] satisfies ElementDefinition[];

describe('show', () => {
  describe('when all nodes are shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements, headless: true });

    describe('when filtering by string', () => {
      it('returns the correct elements', () => {
        const elements = show({
          renderGraph,
          traversalGraph,
          selector: `node[id="one"]`,
        });

        expect(elements).toEqual([
          expect.objectContaining(nodeOne),
          expect.objectContaining(nodeTwo),
          expect.objectContaining(nodeThree),
          expect.objectContaining(edgeOne),
          expect.objectContaining(edgeThree),
          expect.objectContaining(edgeTwo),
        ]);
      });
    });

    describe('when filtering by function', () => {
      it('returns the correct elements', () => {
        const elements = show({
          renderGraph,
          traversalGraph,
          selector: (element) => {
            return element.id() === 'one';
          },
        });

        expect(elements).toEqual(
          expect.arrayContaining([
            expect.objectContaining(nodeOne),
            expect.objectContaining(nodeTwo),
            expect.objectContaining(nodeThree),
            expect.objectContaining(edgeOne),
            expect.objectContaining(edgeTwo),
            expect.objectContaining(edgeThree),
          ])
        );
      });
    });
  });

  describe('when no nodes are shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements: [], headless: true });

    describe('when filtering by string', () => {
      it('returns the correct elements', () => {
        const elements = show({
          renderGraph,
          traversalGraph,
          selector: `node[id="one"]`,
        });

        expect(elements).toEqual(
          expect.arrayContaining([
            expect.objectContaining(nodeOne),
            expect.not.objectContaining(nodeTwo),
            expect.not.objectContaining(nodeThree),
            expect.not.objectContaining(edgeOne),
            expect.not.objectContaining(edgeTwo),
            expect.not.objectContaining(edgeThree),
          ])
        );
      });
    });

    describe('when filtering by function', () => {
      it('returns the correct elements', () => {
        const elements = show({
          renderGraph,
          traversalGraph,
          selector: (element) => {
            return element.id() === 'one';
          },
        });

        expect(elements).toEqual(
          expect.arrayContaining([
            expect.objectContaining(nodeOne),
            expect.not.objectContaining(nodeTwo),
            expect.not.objectContaining(nodeThree),
            expect.not.objectContaining(edgeOne),
            expect.not.objectContaining(edgeTwo),
            expect.not.objectContaining(edgeThree),
          ])
        );
      });
    });
  });
});

describe('showDependencies', () => {
  describe('when all nodes are shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements, headless: true });

    it('returns the correct elements', () => {
      const elements = showDependencies({
        renderGraph,
        traversalGraph,
        id: 'one',
      });

      expect(elements).toEqual(
        expect.arrayContaining([
          expect.objectContaining(nodeOne),
          expect.objectContaining(nodeTwo),
          expect.objectContaining(nodeThree),
          expect.objectContaining(edgeOne),
          expect.objectContaining(edgeTwo),
          expect.objectContaining(edgeThree),
        ])
      );
    });
  });

  describe('when no nodes are shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements: [], headless: true });

    it('returns the correct elements', () => {
      const elements = showDependencies({
        renderGraph,
        traversalGraph,
        id: 'one',
      });

      expect(elements).toEqual(
        expect.arrayContaining([
          expect.objectContaining(nodeOne),
          expect.not.objectContaining(nodeThree),
          expect.objectContaining(nodeThree),
          expect.objectContaining(edgeOne),
          expect.not.objectContaining(edgeTwo),
          expect.objectContaining(edgeThree),
        ])
      );
    });
  });
});

describe('showDependants', () => {
  describe('when all nodes are shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements, headless: true });

    it('returns the correct elements', () => {
      const elements = showDependants({
        renderGraph,
        traversalGraph,
        id: 'two',
      });

      expect(elements).toEqual(
        expect.arrayContaining([
          expect.objectContaining(nodeOne),
          expect.objectContaining(nodeTwo),
          expect.objectContaining(nodeThree),
          expect.objectContaining(edgeOne),
          expect.objectContaining(edgeTwo),
          expect.objectContaining(edgeThree),
        ])
      );
    });
  });

  describe('when no nodes are shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements: [], headless: true });

    it('returns the correct elements', () => {
      const elements = showDependants({
        renderGraph,
        traversalGraph,
        id: 'two',
      });

      expect(elements).toEqual(
        expect.arrayContaining([
          expect.objectContaining(nodeOne),
          expect.objectContaining(nodeTwo),
          expect.not.objectContaining(nodeThree),
          expect.objectContaining(edgeOne),
          expect.not.objectContaining(edgeTwo),
          expect.not.objectContaining(edgeThree),
        ])
      );
    });
  });
});
