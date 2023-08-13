import {
  show,
  showDependencies,
  showDependants,
  hideDependents,
  hideDependencies,
} from './actions';
import cytoscape, {
  EdgeDefinition,
  ElementDefinition,
  NodeDefinition,
} from 'cytoscape';
import { describe, it, expect, test } from 'vitest';

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
const nodeFour = {
  group: 'nodes',
  data: {
    id: 'four',
  },
} satisfies NodeDefinition;

const edgeOneToTwo = {
  group: 'edges',
  data: {
    id: 'one->two',
    source: 'one',
    target: 'two',
  },
} satisfies EdgeDefinition;
const edgeTwoToThree = {
  group: 'edges',
  data: {
    id: 'two->three',
    source: 'two',
    target: 'three',
  },
} satisfies EdgeDefinition;
const edgeOneToFour = {
  group: 'edges',
  data: {
    id: 'one->four',
    source: 'one',
    target: 'four',
  },
} satisfies EdgeDefinition;

const elements = [
  nodeOne,
  nodeTwo,
  nodeThree,
  nodeFour,
  edgeOneToTwo,
  edgeTwoToThree,
  edgeOneToFour,
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
          expect.objectContaining(nodeFour),
          expect.objectContaining(edgeOneToTwo),
          expect.objectContaining(edgeOneToFour),
          expect.objectContaining(edgeTwoToThree),
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
            expect.objectContaining(nodeFour),
            expect.objectContaining(edgeOneToTwo),
            expect.objectContaining(edgeTwoToThree),
            expect.objectContaining(edgeOneToFour),
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
            expect.not.objectContaining(nodeFour),
            expect.not.objectContaining(edgeOneToTwo),
            expect.not.objectContaining(edgeTwoToThree),
            expect.not.objectContaining(edgeOneToFour),
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
            expect.not.objectContaining(nodeFour),
            expect.not.objectContaining(edgeOneToTwo),
            expect.not.objectContaining(edgeTwoToThree),
            expect.not.objectContaining(edgeOneToFour),
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
          expect.objectContaining(nodeFour),
          expect.objectContaining(edgeOneToTwo),
          expect.objectContaining(edgeTwoToThree),
          expect.objectContaining(edgeOneToFour),
        ])
      );
    });
  });

  describe('when only the root is shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements: [nodeOne], headless: true });

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
          expect.not.objectContaining(nodeThree),
          expect.objectContaining(nodeFour),
          expect.objectContaining(edgeOneToTwo),
          expect.not.objectContaining(edgeTwoToThree),
          expect.objectContaining(edgeOneToFour),
        ])
      );
    });
  });

  describe('when the root and its dependencies are shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({
      elements: [nodeOne, edgeOneToTwo, edgeOneToFour, nodeTwo, nodeFour],
      headless: true,
    });

    it('returns the correct elements', () => {
      const elements = showDependencies({
        renderGraph,
        traversalGraph,
        id: 'two',
      });

      expect(elements).toEqual(
        expect.arrayContaining([
          expect.objectContaining(nodeOne),
          expect.objectContaining(nodeTwo),
          expect.objectContaining(nodeThree),
          expect.objectContaining(nodeFour),
          expect.objectContaining(edgeOneToTwo),
          expect.objectContaining(edgeTwoToThree),
          expect.objectContaining(edgeOneToFour),
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

      expect(elements).toMatchObject([
        nodeOne,
        nodeTwo,
        nodeThree,
        nodeFour,
        edgeOneToTwo,
        edgeTwoToThree,
        edgeOneToFour,
      ]);
    });
  });

  describe('when only the root node is shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements: [nodeOne], headless: true });

    it('returns the correct elements', () => {
      const elements = showDependants({
        renderGraph,
        traversalGraph,
        id: 'one',
      });

      expect(elements).toMatchObject([nodeOne]);
      expect(elements).not.toMatchObject([
        nodeTwo,
        nodeThree,
        nodeFour,
        edgeOneToFour,
        edgeOneToTwo,
        edgeTwoToThree,
      ]);
    });
  });

  describe('when only a leaf node is shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements: [nodeThree], headless: true });

    it('returns the correct elements', () => {
      const elements = showDependants({
        renderGraph,
        traversalGraph,
        id: 'three',
      });

      expect(elements).toMatchObject([nodeThree, nodeTwo, edgeTwoToThree]);
      expect(elements).not.toMatchObject([
        nodeOne,
        nodeFour,
        edgeOneToFour,
        edgeOneToTwo,
        edgeTwoToThree,
      ]);
    });
  });
});

describe('hideDependents', () => {
  describe('when all nodes are shown', () => {
    describe('when hiding dependents for the root node', () => {
      const traversalGraph = cytoscape({ elements, headless: true });
      const renderGraph = cytoscape({ elements, headless: true });

      it('returns the correct elements', () => {
        const elements = hideDependents({
          renderGraph,
          traversalGraph,
          id: 'one',
        });

        expect(elements).toMatchObject([
          nodeOne,
          nodeTwo,
          nodeThree,
          nodeFour,
          edgeOneToTwo,
          edgeTwoToThree,
          edgeOneToFour,
        ]);
      });
    });

    describe('when hiding dependents for a node with dependents and dependencies', () => {
      const traversalGraph = cytoscape({ elements, headless: true });
      const renderGraph = cytoscape({ elements, headless: true });

      it('returns the correct elements', () => {
        const elements = hideDependents({
          renderGraph,
          traversalGraph,
          id: 'two',
        });

        expect(elements).toMatchObject([nodeTwo, edgeTwoToThree, nodeThree]);
      });
    });
  });
});

describe('hideDependencies', () => {
  test('when hiding dependencies for the root node only the root node is shown', () => {
    const traversalGraph = cytoscape({ elements, headless: true });
    const renderGraph = cytoscape({ elements, headless: true });

    const shownElements = hideDependencies({
      renderGraph,
      traversalGraph,
      id: 'one',
    });
    console.log({ shownElements: shownElements.map((el) => el.data) });
    expect(shownElements).toMatchObject([nodeOne]);
  });
});
