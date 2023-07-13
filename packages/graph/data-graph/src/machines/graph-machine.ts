import { VirtualElement } from '@popperjs/core';
import {
  createRenderGraph,
  createTraversalGraph,
  getElementDefinitions,
  show,
  showDependants,
  showDependencies,
} from '@commonalityco/utils-graph';
import { Package, Violation } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import { assign, createMachine } from 'xstate';
import {
  CollectionArgument,
  Core,
  EdgeSingular,
  ElementDefinition,
  NodeSingular,
  Selector,
} from 'cytoscape';
import {
  OffloadRenderFn,
  updateGraphElements,
  getUpdatedGraphJson,
} from '@commonalityco/utils-graph';
import debounce from 'lodash.debounce';

type Filter =
  | Selector
  | ((ele: NodeSingular, index: number, eles: CollectionArgument) => boolean);

export interface Context {
  renderGraph?: Core;
  traversalGraph?: Core;
  getUpdatedGraphJson: OffloadRenderFn;
  elements: ElementDefinition[];
  hoveredRenderNode?: NodeSingular & { data: () => Package };
  hoveredTraversalNode?: NodeSingular & { data: () => Package };
  selectedNode?: NodeSingular;
  selectedEdge?: EdgeSingular;
  popoverRef?: VirtualElement;
  isEdgeColorShown: boolean;
  theme: string;
  violations: Violation[];
}

type Event =
  // Setup + teardown hooks
  | { type: 'DESTROY' }
  | {
      type: 'INITIALIZE';
      containerId: string;
      packages: Package[];
      theme: string;
      getUpdatedGraphJson: OffloadRenderFn;
      isGroupedByTag: boolean;
      violations: Violation[];
    }

  // Interactions
  | { type: 'HIDE_ALL' }
  | { type: 'HIDE'; selector: Filter }
  | { type: 'SHOW_ALL' }
  | { type: 'SHOW'; selector: Filter }
  | { type: 'SHOW_DEPENDANTS'; pkg: Package }
  | { type: 'HIDE_DEPENDANTS'; pkg: Package }
  | { type: 'SHOW_DEPENDENCIES'; pkg: Package }
  | { type: 'HIDE_DEPENDENCIES'; pkg: Package }
  | { type: 'FOCUS'; selector: Filter }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'FIT'; selector: Filter }
  | { type: 'SET_IS_EDGE_COLOR_SHOWN'; isShown: boolean }
  | { type: 'SET_THEME'; theme: string }
  | { type: 'NODE_MOUSEOVER'; node: NodeSingular }
  | { type: 'NODE_MOUSEOUT'; node: NodeSingular }
  | { type: 'NODE_SELECT'; packageName: string }
  | { type: 'EDGE_CLICK'; edge: EdgeSingular }
  | { type: 'UNHOVER' }
  | { type: 'UNSELECT' };

const ZOOM_FACTOR = 0.2 as const;

export const graphMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQE4EMAOALAdAVwDsBLYgFyLQBsiAvSAYgEkA5RgFUYEEAZRgLQCiAbQAMAXUSgMAe1hFy0gpJAAPRAFYAbAGYc2gOzqRARmMj9ADk2GATABoQAT0QXjOIyM+bNN7Zs-qACwAvsEOqJi4sHgAxjFwsEysHDz8wuLKMnIKSkiqGjp6hiZmltbq9k6I2iKBesY2Fb4iAJy+Lcah4ejYONFxCfQAIgIAymwASgDyAJqiEnlZ8kSKymoIppo4+mYtgYGNFjaBRy0Ozhs2hjiN3i17Fi2aRyFhIBG9-fGwiQASjCN5plZMtVnl1lpdAYjKZzFZbOcNCItnDmiIbK4WhZtNouu8elFYt8-gCBAB9EYABQEzBGzAAwowxkDFiCcmsClDirCygiqgh-DYcCJtMYcTZPKKari3h9CQMfvR-iMKQJqbTOMw2KMWVI2StcqAIYVoSU4eVKhdNC19DgsYF1PdGvpRZY8XK+kTBsryTxuLqQEt2eDOUUYaV4RVEQh9C1dHH9PoTL4bMcse6CZ6FYlRr8pgB1ANBg0chCQsNm3lR-kWR44R4iCwiiU7VwWDORLPE+i5guq9V0xnMjKs7IlkNlk3ciMW6NY9T1wLaFoidTGI6mbTt2WZr6DXv5-s0oaa7VF-Vgo2h008yOWxBmVzbG2eHbqJOBTQdz5exUHsl+ueY6Xvkk5cuG5p8hcpiJtsMKtGKxg2kc37yt2ABiUz0gAqjqI56sBhqgeWN4zlBD5XLoSbaDYphmNaZg2KhXb7gIbBkmwvwCAAsukCwEaCRHGuBlZ3tGYrWjgmiQmKjbrgcrzdJ2e6Kuh7BAYJpZihYODGLGzzSYE+iaGKxniXpLR6CKjqGMYRlGExO7Kb+iR8FMUzcWSLAacGV4bHp2zaEuFhLjaca1oE4mNlCRg4ui-haFczEqa57meVM2FsD545+bsegrjoNSaIE676Ccc4WLay76KmRwWJC5jJS5PZsV5oxkgIQwAOLkvSUzcFMExkgezDZSB6wHNGVh1PcZjGCZexGOo25KT+2b0MwUwqtxGWjAIUwAGoCBMY1CYgsb5ciNQNO+RnaOo0ZlUKy2fluLw3eoTXrZt227ftmWnaW2LuMYiUhTosapsY0Y+CIumWAc1hxV4X3dj9vW8PSADSgMTmYC7mCKoNPI6WLSdGgQ2tsNW0Z+JWVeoWio4MnU9WS9KYzj+GBheZ0bMiNylctlWHNamjRtCejeJ4jRGMUX5OWt3bYcwe3cAI9JZdzxbjQ+DRFJTYWBLUxXPNGjRCi0Nkrg6TzOsxlDSGgEAkFA9AQIoYA4CQABu0gANZeygYAEBAYAoAAtHKuN+f4dSWA00n3GuxXaObWj1jdtHLUjHQO07LsEG74coNIKA4BglBoKQABmZcALY4MHofh1HBIx6BDRtIFS5BJ+9UhVNEpScVjTri90nbm8BDSGH8B5HKwKEaWEfi-yEcLvcW-bzvMqrbghAkMsVC0JAS+aXj1j1vasuyc8TzifsODGz4rb+E8q76MzPzn75ndWyPY2joU47HmmnfkpktgSixCYOmJl9jMRLmXX+OVO4+AXA6Go5gabGVXFNJCgDGj3EMEYbw+dnauxQbrBAWIdIhQMDoRm75PBnH5PpXSo9jJWx0I2RyoQgA */
    predictableActionArguments: true,
    id: 'graph',
    initial: 'uninitialized',
    context: {
      elements: [] as any,
      isEdgeColorShown: false,
      theme: 'light',
      getUpdatedGraphJson,
      violations: [],
    },
    tsTypes: {} as import('./graph-machine.typegen').Typegen0,
    schema: {
      events: {} as Event,
      context: {} as Context,
    },

    states: {
      uninitialized: {
        on: {
          INITIALIZE: {
            target: 'loading',
            actions: [
              'createTraversalGraph',
              'createRenderGraph',
              'setTheme',
              'setInitialElements',
              'log',
            ],
          },
        },
      },
      success: {
        on: {
          INITIALIZE: {
            target: 'loading',
            actions: [
              'createTraversalGraph',
              'createRenderGraph',
              'setTheme',
              'setInitialElements',
              'log',
            ],
          },
          DESTROY: {
            cond: 'renderGraphExists',
            actions: ['destroy', 'log'],
          },
          // Graph interactions
          HIDE: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['hide', 'unselect', 'unhover', 'log'],
          },
          HIDE_DEPENDENCIES: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['hideDependencies', 'unselect', 'unhover', 'log'],
          },
          HIDE_DEPENDANTS: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['hideDependants', 'unselect', 'log'],
          },
          HIDE_ALL: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['hideAll', 'unselect', 'log'],
          },
          SHOW: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['show', 'unselect', 'unhover', 'log'],
          },
          SHOW_DEPENDENCIES: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['showDependencies', 'unselect', 'log'],
          },
          SHOW_DEPENDANTS: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['showDependants', 'unselect', 'log'],
          },
          SHOW_ALL: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['showAll', 'unselect', 'log'],
          },
          FOCUS: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['focus', 'unselect', 'unhover', 'log'],
          },
          SET_THEME: {
            target: 'loading',
            cond: 'renderGraphExists',
            actions: ['setTheme', 'log'],
          },
          // Graph toolbar events triggered by the user
          FIT: {
            cond: 'renderGraphExists',
            actions: ['fit', 'log'],
          },
          ZOOM_IN: {
            cond: 'renderGraphExists',
            actions: ['zoomIn', 'log'],
          },
          ZOOM_OUT: {
            cond: 'renderGraphExists',
            actions: ['zoomOut', 'log'],
          },
          SET_IS_EDGE_COLOR_SHOWN: {
            cond: 'renderGraphExists',
            actions: ['renderIsEdgeColorShown', 'setIsEdgeColorShown', 'log'],
          },
          // Events triggered by the graph
          NODE_MOUSEOVER: {
            cond: 'renderGraphExists',
            actions: ['nodeMouseOver', 'log'],
          },
          NODE_MOUSEOUT: {
            cond: 'renderGraphExists',
            actions: ['unselect', 'log'],
          },
          NODE_SELECT: {
            cond: 'renderGraphExists',
            actions: ['nodeSelect', 'log'],
          },
          EDGE_CLICK: {
            cond: 'renderGraphExists',
            actions: ['edgeClick', 'log'],
          },
          UNSELECT: {
            cond: 'renderGraphExists',
            actions: ['unselect', 'log'],
          },
        },
      },
      error: {},
      loading: {
        invoke: {
          id: 'render-graph',
          src: 'renderGraph',
          onDone: {
            target: 'success',
            cond: 'renderGraphExists',
            actions: ['log'],
          },
          onError: {
            target: 'error',
            cond: 'renderGraphExists',
            actions: ['log'],
          },
        },
      },
    },
  },
  {
    services: {
      renderGraph: (context) => async (callback) => {
        if (!context.renderGraph || !context.traversalGraph)
          return Promise.resolve();

        await updateGraphElements({
          renderGraph: context.renderGraph,
          traversalGraph: context.traversalGraph,
          elements: context.elements,
          theme: context.theme,
          getUpdatedGraphJson: context.getUpdatedGraphJson,
          forceEdgeColor: context.isEdgeColorShown,
          violations: context.violations,
        });

        context.renderGraph.on('click', () => {
          if (context.selectedNode) {
            callback({ type: 'UNSELECT' });
          }

          if (context.selectedEdge) {
            callback({ type: 'UNSELECT' });
          }
        });

        context.renderGraph.nodes().on('click', (event) => {
          if (!context.renderGraph) return;

          const data: Package = event.target.data();

          callback({ type: 'NODE_SELECT', packageName: data.name });
        });

        context.renderGraph.nodes().on('mouseover', (event) => {
          if (!context.renderGraph) return;

          callback({ type: 'NODE_MOUSEOVER', node: event.target });
        });

        context.renderGraph.nodes().on('mouseout', (event) => {
          if (!context.renderGraph) return;

          callback({ type: 'NODE_MOUSEOUT', node: event.target });
        });

        context.renderGraph.edges().on('click', (event) => {
          if (!context.renderGraph) return;

          callback({ type: 'EDGE_CLICK', edge: event.target });
        });

        context.renderGraph.on(
          'pan zoom resize',
          debounce(
            () => {
              if (!context.renderGraph) return;
              callback({ type: 'UNSELECT' });
            },
            1000,
            { leading: true, trailing: false }
          )
        );

        return Promise.resolve();
      },
    },

    actions: {
      destroy: (context) => {
        if (!context.renderGraph || !context.traversalGraph) return;

        context.renderGraph?.removeAllListeners();
        context.renderGraph?.destroy();
        context.traversalGraph?.destroy();
      },
      setInitialElements: assign({
        elements: (context) => {
          if (!context.renderGraph) return [] as any;

          return context.renderGraph?.elements();
        },
        violations: (context, event) => {
          return event.violations;
        },
      }),
      setTheme: assign({
        theme: (context, event) => {
          return event.theme;
        },
      }),
      createRenderGraph: assign({
        renderGraph: (context, event) => {
          const container = document.getElementById('graph-container');

          if (!container) throw new Error('Could not find graph container');

          return createRenderGraph({
            container,
            elements: getElementDefinitions(event.packages),
          });
        },
      }),
      createTraversalGraph: assign({
        traversalGraph: (context, event) =>
          createTraversalGraph({
            elements: getElementDefinitions(event.packages),
          }),
      }),
      hide: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [] as any;

          const elementsToHide = context.traversalGraph.collection();
          const nodesToHide = context.traversalGraph
            .nodes()
            .filter(event.selector);
          const edgesForElements = nodesToHide.connectedEdges();

          elementsToHide.merge(nodesToHide).merge(edgesForElements);

          return context.renderGraph.elements().difference(elementsToHide);
        },
      }),
      hideDependencies: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [] as any;

          const elementsToHide = context.traversalGraph
            .$id(event.pkg.name)
            .outgoers();

          return context.renderGraph.elements().difference(elementsToHide);
        },
      }),
      hideDependants: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [] as any;

          const elementsToHide = context.traversalGraph
            .$id(event.pkg.name)
            .incomers();

          return context.renderGraph.elements().difference(elementsToHide);
        },
      }),
      hideAll: assign({
        elements: (context) => {
          if (!context.traversalGraph) return [] as any;

          return context.traversalGraph.collection();
        },
      }),
      unhover: assign({
        hoveredRenderNode: undefined,
        hoveredTraversalNode: undefined,
      }),
      show: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [];

          return show({
            traversalGraph: context.traversalGraph,
            renderGraph: context.renderGraph,
            selector: event.selector,
          });
        },
      }),
      showDependencies: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [];

          return showDependencies({
            traversalGraph: context.traversalGraph,
            renderGraph: context.renderGraph,
            id: event.pkg.name,
          });
        },
      }),

      showDependants: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [];

          return showDependants({
            traversalGraph: context.traversalGraph,
            renderGraph: context.renderGraph,
            id: event.pkg.name,
          });
        },
      }),
      showAll: assign({
        elements: (context) => {
          if (!context.traversalGraph) return [] as any;

          return context.traversalGraph.elements();
        },
      }),
      focus: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [] as any;

          return context.traversalGraph.nodes().filter(event.selector);
        },
      }),
      fit: (context, event) => {
        if (!context.renderGraph) return;

        const elements = context.renderGraph.nodes().filter(event.selector);

        context.renderGraph.fit(elements, 24);
      },
      zoomIn: (context) => {
        if (!context.renderGraph) return;

        const currentZoom = context.renderGraph.zoom();

        const newZoom = currentZoom + currentZoom * ZOOM_FACTOR;

        const x = context.renderGraph.width() / 2;
        const y = context.renderGraph.height() / 2;

        context.renderGraph.zoom({
          level: newZoom,
          position: { x, y },
        });
      },
      renderIsEdgeColorShown: (context, event) => {
        if (!context.renderGraph) return;

        context.renderGraph.scratch('forceEdgeColor', event.isShown);
        context.renderGraph.edges().forEach((edge) => {
          if (event.isShown) {
            const type = edge.data('type') as DependencyType;

            edge.addClass(type);
            edge.addClass('focus');
          } else {
            edge.removeClass(['DEVELOPMENT', 'PEER', 'PRODUCTION']);
            edge.removeClass('focus');
          }
        });
      },
      setIsEdgeColorShown: assign({
        isEdgeColorShown: (context, event) => {
          return event.isShown;
        },
      }),
      zoomOut: (context, event) => {
        if (!context.renderGraph) return;

        const currentZoom = context.renderGraph.zoom();

        const newZoom = currentZoom - currentZoom * ZOOM_FACTOR;

        const x = context.renderGraph.width() / 2;
        const y = context.renderGraph.height() / 2;

        context.renderGraph.zoom({
          level: newZoom,
          position: { x, y },
        });
      },
      nodeMouseOver: assign({
        hoveredTraversalNode: (context, event) => {
          if (!context.traversalGraph) return undefined;

          return context.traversalGraph.$id(event.node.id());
          // return event.node;
        },
        hoveredRenderNode: (context, event) => {
          return event.node;
        },
      }),

      nodeSelect: assign({
        selectedNode: (context, event) => {
          return context.traversalGraph?.$id(event.packageName);
        },
        hoveredRenderNode: undefined,
        hoveredTraversalNode: undefined,
      }),
      edgeClick: assign({
        selectedNode: undefined,
        selectedEdge: (context, event) => {
          return event.edge;
        },
      }),
      unselect: assign({
        selectedNode: () => undefined,
        selectedEdge: () => undefined,
        hoveredRenderNode: () => undefined,
        hoveredTraversalNode: () => undefined,
      }),
      log: (context, event) => {
        console.log(event.type, { context, event });
      },
    },
    guards: {
      renderGraphExists: (context) =>
        context.renderGraph !== undefined ||
        context.traversalGraph !== undefined,
    },
  }
);
