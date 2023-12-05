import type { VirtualElement } from '@popperjs/core';
import {
  createRenderGraph,
  createTraversalGraph,
  updateGraphElements,
} from '@commonalityco/utils-graph';
import {
  focus,
  hide,
  hideAll,
  hideDependents,
  hideDependencies,
  setInitialElements,
  show,
  showAll,
  showDependants,
  showDependencies,
} from '@commonalityco/utils-graph/actions';
import type { ConstraintResult, Package } from '@commonalityco/types';
import { DependencyType } from '@commonalityco/utils-core';
import { assign, createMachine } from 'xstate';
import type {
  CollectionArgument,
  Core,
  EdgeSingular,
  ElementDefinition,
  NodeSingular,
  Selector,
} from 'cytoscape';
import debounce from 'lodash.debounce';

type Filter =
  | Selector
  | ((ele: NodeSingular, index: number, eles: CollectionArgument) => boolean);

export interface Context {
  worker?: Worker;
  isHovering: boolean;
  renderGraph?: Core;
  traversalGraph?: Core;
  elements: ElementDefinition[];
  selectedRenderNode?: NodeSingular & { data: () => Package };
  selectedTraversalNode?: NodeSingular & { data: () => Package };
  selectedEdge?: EdgeSingular;
  popoverRef?: VirtualElement;
  isEdgeColorShown: boolean;
  theme: string;
  results: ConstraintResult[];
}

type Event =
  // Setup + teardown hooks
  | { type: 'DESTROY' }
  | {
      type: 'INITIALIZE';
      containerId: string;
      elements: ElementDefinition[];
      theme: string;
      results: ConstraintResult[];
      worker: Worker;
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
  | { type: 'NODE_CLICK'; node: NodeSingular }
  | { type: 'EDGE_CLICK'; edge: EdgeSingular }
  | { type: 'SET_HOVERING'; isHovering: boolean }
  | { type: 'UNSELECT' };

const ZOOM_FACTOR = 0.5 as const;

export const graphMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5RQE4EMAOALAdAVwDsBLYgFyLQBsiAvSAYgEkA5RgFUYEEAZRgLQCiAbQAMAXUSgMAe1hFy0gpJAAPRAFYAbAGYc2gOzqRARmMj9ADk2GATABoQAT0QXjOIyM+bNN7Zs-qACwAvsEOqJi4sHgAxjFwsEysHDz8wuLKMnIKSkiqGjp6hiZmltbq9k6I2iKBesY2Fb4iAJy+Lcah4ejYONFxCfQAIgIAymwASgDyAJqiEnlZ8kSKymoIppo4+mYtgYGNFjaBRy0Ozhs2hjiN3i17Fi2aRyFhIBG9-fGwiQASjCN5plZMtVnl1lpdAYjKZzFZbOcNCItnDmiIbK4WhZtNouu8elFYt8-gCBAB9EYABQEzBGzAAwowxkDFiCcmsClDirCygiqgh-DYcCJtMYcTZPKKari3h9CQMfvR-iMKQJqbTOMw2KMWVI2StcqAIYVoSU4eVKhdNC19DgsYF1PdGvpRZY8XK+kTBsryTxuLqQEt2eDOUUYaV4RVEQh9C1dHH9PoTL4bMcse6CZ6FYlRr8pgB1ANBg0chCQsNm3lR-kWR44R4iCwiiU7VwWDORLPE+i5guq9V0xnMjKs7IlkNlk3ciMW6NY9T1wLaFoidTGI6mbTt2WZr6DXv5-s0oaa7VF-Vgo2h008yOWxBmVzbG2eHbqJOBTQdz5exUHsl+ueY6Xvkk5cuG5p8hcpiJtsMKtGKxg2kc37yt2ABiUz0gAqjqI56sBhqgeWN4zlBD5XLoSbaDYphmNaZg2KhXb7gIbBkmwvwCAAsukCwEaCRHGuBlZ3tGYrWjgmiQmKjbrgcrzdJ2e6Kuh7BAYJpZihYODGLGzzSYE+iaGKxniXpLR6CKjqGMYRlGExO7Kb+iR8FMUzcWSLAacGV4bHp2zaEuFhLjaca1oE4mNlCRg4ui-haFczEqa57meVM2FsD545+bsegrjoNSaIE676Ccc4WLay76KmRwWJC5jJS5PZsV5oxkgIQwAOLkvSUzcFMExkgezDZSB6wHNGVh1PcZjGCZexGOo25KT+2b0MwUwqtxGWjAIUwAGoCBMY1CYgsb5ciNQNO+RnaOo0ZlUKy2fluLw3eoTXrZt227ftmWnaW2LuMYiUhTosapsY0Y+CIumWAc1hxV4X3dj9vW8PSADSgMTmYC7mCKoNPI6WLSdGgQ2tsNW0Z+JWVeoWio4MnU9WS9KYzj+GBheZ0bMiNylctlWHNamjRtCejeJ4jRGMUX5OWt3bYcwe3cAI9JZdzxbjQ+DRFJTYWBLUxXPNGjRCi0Nkrg6TzOsxlDSGgEAkFA9AQIoYA4CQABu0gANZeygYAEBAYAoAAtHKuN+f4dSWA00n3GuxXaObWj1jdtHLUjHQO07LsEG74coNIKA4BglBoKQABmZcALY4MHofh1HBIx6BDRtIFS5BJ+9UhVNEpScVjTri90nbm8BDSGH8B5HKwKEaWEfi-yEcLvcW-bzvMqrbghAkMsVC0JAS+aXj1j1vasuyc8TzifsODGz4rb+E8q76MzPzn75ndWyPY2joU47HmmnfkpktgSixCYOmJl9jMRLmXX+OVO4+AXA6Go5gabGVXFNJCgDGj3EMEYbw+dnauxQbrBAWIdIhQMDoRm75PBnH5PpXSo9jJWx0I2RyoQgA */
    predictableActionArguments: true,
    id: 'graph',
    initial: 'uninitialized',
    context: {
      isHovering: false,
      elements: [],
      isEdgeColorShown: false,
      theme: 'light',
      results: [],
    },
    tsTypes: {} as import('./graph-machine.typegen.js').Typegen0,
    schema: {
      events: {} as Event,
      context: {} as Context,
    },
    states: {
      uninitialized: {
        on: {
          INITIALIZE: {
            target: 'updating',
            actions: [
              'setWorker',
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
            target: 'updating',
            actions: [
              'createTraversalGraph',
              'createRenderGraph',
              'setTheme',
              'setInitialElements',
              'log',
            ],
          },
          DESTROY: {
            cond: 'hasInitialized',
            actions: ['destroy', 'log'],
          },
          // Graph interactions
          HIDE: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['hide', 'unselect', 'log'],
          },
          HIDE_DEPENDENCIES: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['hideDependencies', 'unselect', 'log'],
          },
          HIDE_DEPENDANTS: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['hideDependents', 'unselect', 'log'],
          },
          HIDE_ALL: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['hideAll', 'unselect', 'log'],
          },
          SHOW: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['show', 'unselect', 'log'],
          },
          SHOW_DEPENDENCIES: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['showDependencies', 'unselect', 'log'],
          },
          SHOW_DEPENDANTS: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['showDependants', 'unselect', 'log'],
          },
          SHOW_ALL: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['showAll', 'unselect', 'log'],
          },
          FOCUS: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['focus', 'unselect', 'log'],
          },
          SET_THEME: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['setTheme', 'log'],
          },
          SET_IS_EDGE_COLOR_SHOWN: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['renderIsEdgeColorShown', 'setIsEdgeColorShown', 'log'],
          },
          // Graph toolbar events triggered by the user
          FIT: {
            cond: 'hasInitialized',
            actions: ['fit', 'log'],
          },
          ZOOM_IN: {
            cond: 'hasInitialized',
            actions: ['zoomIn', 'log'],
          },
          ZOOM_OUT: {
            cond: 'hasInitialized',
            actions: ['zoomOut', 'log'],
          },
          // Events triggered by the graph
          NODE_MOUSEOUT: {
            cond: 'hasInitialized',
            actions: ['unselect', 'log'],
          },
          SET_HOVERING: {
            actions: ['setHovering', 'log'],
          },
          NODE_CLICK: {
            cond: 'hasInitialized',
            actions: ['nodeClick', 'log'],
          },
          EDGE_CLICK: {
            cond: 'hasInitialized',
            actions: ['edgeClick', 'log'],
          },
          UNSELECT: {
            cond: 'hasInitialized',
            actions: ['unselect', 'log'],
          },
        },
      },
      error: {},
      updating: {
        invoke: {
          id: 'update-layout',
          src: 'updateLayout',
          onDone: {
            target: 'rendering',
            actions: assign({
              elements: (_context, event) => event.data,
            }),
          },
          onError: {
            target: 'error',
            cond: 'hasInitialized',
            actions: ['log'],
          },
        },
      },
      rendering: {
        invoke: {
          id: 'render-graph',
          src: 'renderGraph',
          onDone: {
            target: 'success',
            cond: 'hasInitialized',
            actions: ['log'],
          },
          onError: {
            target: 'error',
            cond: 'hasInitialized',
            actions: ['log'],
          },
        },
      },
    },
  },
  {
    services: {
      updateLayout: (context) => {
        return new Promise((resolve) => {
          if (!context.worker) {
            // Throw to ERROR STATE
            return resolve([]);
          }

          context.worker.addEventListener(
            'message',
            async (event: MessageEvent<ElementDefinition[]>) => {
              if (!context.renderGraph || !context.traversalGraph) {
                return resolve([]);
              }

              resolve(event.data);
            },
          );

          context.worker.postMessage(context.elements);
        });
      },
      renderGraph: (context) => async (callback) => {
        if (!context.renderGraph || !context.traversalGraph) return;

        await updateGraphElements({
          renderGraph: context.renderGraph,
          traversalGraph: context.traversalGraph,
          elements: context.elements,
          theme: context.theme,
          forceEdgeColor: context.isEdgeColorShown,
          results: context.results,
        });

        context.renderGraph.nodes().on('click', (event) => {
          if (!context.renderGraph) return;

          callback({ type: 'NODE_CLICK', node: event.target });
        });

        context.renderGraph.edges().on('click', (event) => {
          if (!context.renderGraph) return;

          callback({ type: 'EDGE_CLICK', edge: event.target });
        });

        context.renderGraph.on(
          'pan zoom',
          debounce(
            () => {
              if (!context.renderGraph) return;
              callback({ type: 'UNSELECT' });
            },
            1000,
            { leading: true, trailing: false },
          ),
        );
      },
    },

    actions: {
      destroy: (context) => {
        if (!context.renderGraph || !context.traversalGraph) return;

        context.renderGraph?.elements().removeAllListeners();
        context.renderGraph?.destroy();
        context.traversalGraph?.destroy();
      },
      setWorker: assign({
        worker: (_context, event) => {
          return event.worker;
        },
      }),
      setInitialElements: assign({
        elements: (context) => {
          if (!context.renderGraph) return [];

          return setInitialElements({ renderGraph: context.renderGraph });
        },
        results: (_context, event) => {
          return event.results;
        },
      }),
      setTheme: assign({
        theme: (_context, event) => {
          return event.theme;
        },
      }),
      createRenderGraph: assign({
        renderGraph: (_context, event) => {
          const container = document.querySelector(
            '#graph-container',
          ) as HTMLElement;

          if (!container) throw new Error('Could not find graph container');

          return createRenderGraph({
            container,
            elements: event.elements,
          });
        },
      }),
      createTraversalGraph: assign({
        traversalGraph: (_context, event) =>
          createTraversalGraph({
            elements: event.elements,
          }),
      }),
      hide: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [];

          return hide({
            traversalGraph: context.traversalGraph,
            renderGraph: context.renderGraph,
            selector: event.selector,
          });
        },
      }),
      hideDependencies: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [];

          return hideDependencies({
            traversalGraph: context.traversalGraph,
            renderGraph: context.renderGraph,
            id: event.pkg.name,
          });
        },
      }),
      hideDependents: assign({
        elements: (context, event) => {
          if (!context.renderGraph || !context.traversalGraph) return [];

          return hideDependents({
            traversalGraph: context.traversalGraph,
            renderGraph: context.renderGraph,
            id: event.pkg.name,
          });
        },
      }),
      hideAll: assign({
        elements: (context) => {
          if (!context.traversalGraph) return [];

          return hideAll({ traversalGraph: context.traversalGraph });
        },
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
          if (!context.traversalGraph) return [];

          return showAll({ traversalGraph: context.traversalGraph });
        },
      }),
      focus: assign({
        elements: (context, event) => {
          if (!context.traversalGraph) return [];

          return focus({
            traversalGraph: context.traversalGraph,
            selector: event.selector,
          });
        },
      }),
      fit: (context, event) => {
        if (!context.renderGraph) return;

        if (event.selector) {
          const elements =
            typeof event.selector === 'function'
              ? context.renderGraph?.nodes().filter((node, index, eles) => {
                  if (typeof event.selector === 'function') {
                    return event.selector(node, index, eles);
                  }

                  return false;
                })
              : context.renderGraph?.filter(event.selector);

          context.renderGraph.fit(elements, 24);
        } else {
          context.renderGraph.fit(undefined, 24);
        }
      },
      zoomIn: (context) => {
        if (!context.renderGraph) return;

        const currentZoom = context.renderGraph.zoom();

        const extent = context.renderGraph.extent();
        const centerX = extent.x1 + (extent.x2 - extent.x1) / 2;
        const centerY = extent.y1 + (extent.y2 - extent.y1) / 2;

        context.renderGraph.animate({
          duration: 100,
          zoom: {
            level: currentZoom + currentZoom * ZOOM_FACTOR,
            position: {
              x: centerX,
              y: centerY,
            },
          },
        });
      },
      zoomOut: (context) => {
        if (!context.renderGraph) return;

        const currentZoom = context.renderGraph.zoom();

        const extent = context.renderGraph.extent();
        const centerX = extent.x1 + (extent.x2 - extent.x1) / 2;
        const centerY = extent.y1 + (extent.y2 - extent.y1) / 2;

        context.renderGraph.animate({
          duration: 100,
          zoom: {
            level: currentZoom - currentZoom * ZOOM_FACTOR,
            position: {
              x: centerX,
              y: centerY,
            },
          },
        });
      },
      renderIsEdgeColorShown: (context, event) => {
        if (!context.renderGraph) return;

        context.renderGraph.scratch('forceEdgeColor', event.isShown);
        for (const edge of context.renderGraph.edges()) {
          if (event.isShown) {
            const type = edge.data('type') as DependencyType;

            edge.addClass(type);
            edge.addClass('focus');
          } else {
            edge.removeClass([
              DependencyType.PRODUCTION,
              DependencyType.DEVELOPMENT,
              DependencyType.PEER,
            ]);
            edge.removeClass('focus');
          }
        }
      },
      setIsEdgeColorShown: assign({
        selectedEdge: undefined,
        selectedRenderNode: undefined,
        selectedTraversalNode: undefined,
        isEdgeColorShown: (_context, event) => {
          return event.isShown;
        },
      }),
      nodeClick: assign({
        selectedEdge: undefined,
        selectedRenderNode: (_context, event) => {
          return event.node;
        },
        selectedTraversalNode: (context, event) => {
          if (!context.traversalGraph) return;

          return context.traversalGraph.$id(event.node.id());
          // return event.node;
        },
      }),
      edgeClick: assign({
        selectedRenderNode: undefined,
        selectedTraversalNode: undefined,
        selectedEdge: (_context, event) => {
          return event.edge;
        },
      }),
      setHovering: assign({
        isHovering: (context, event) => event.isHovering,
      }),
      unselect: assign({
        selectedRenderNode: undefined,
        selectedTraversalNode: undefined,
        selectedEdge: undefined,
      }),
      log: (context, event) => {
        console.log(event.type, { context, event });
      },
    },
    guards: {
      hasInitialized: (context) =>
        context.renderGraph !== undefined ||
        context.traversalGraph !== undefined ||
        context.worker !== undefined,
    },
  },
);
