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
    /** @xstate-layout N4IgpgJg5mDOIC5RQE4EMAOALAdAVwDsBLYgFyLQBsiAvSAYgEkA5RgFUYEEAZRgLQCiAbQAMAXUSgMAe1hFy0gpJAAPRAFYAnAA4cAJm0B2TZoOH1IgIwAWAMwAaEAE9Ep6zkO2renbYBs2qYAvkGOqJi4sHgAxtFwsEysHDz8wuLKMnIKSkiqiAC0BpY4luqGeiKa6qXattaWji4Imn6GONYBmtYV1sbWHSFh6Ng4UbHx9AAiAgDKbABKAPIAmqISuZnyRIrKagj5XsW2PiJ95YaeDs6IlqbF3dYWNp7a3YMg4SNjcbAJABKMaZrDKyLY7XJ7Qq1dqBPTVbRadR6PS2QyNRDaES2fRePx+dT4wyWWyad6fSIxH7-QECAD60wACgJmNNmABhRizYEbUHZXYFOrudR2TQiALaSx6fp6dEIcp6HDabTI-GSywIgJk4YU8a-egA6b0gRMlmcZhsGbcqS87Y5UCQrTY2yWKz9TTE7StBrXBDqartWx+nxlPy+bRaiKjSkTA10njcK0gTZ8iEFP1+HCB52WYyGawiJ6yw4lWpdIx6SwBYzqCNfaN6mZ-RYAdUTydt-P2Bk0OHUxwqwqxtlRZVlxLafbd5b8ImVktrOqp9EbLaNJtZHK56R5WQ7qf2gZEvc9gT8krKF00aJ9B2xXr8HXMrzz1nDoQ+2qjuoSK+ba+ZkxmhabY2uC9oCnYODuoEhwiAWr5XE0+SWKUPbdCOXj9MqEoLl+S6-rS8YgbuYF5AeYpQWUV4zhKrQ6LKyE+MUtyzhYrRIkYti4d8EwAGKLGyACqlrbtaJF2mRhSmDgcGvuURiXlY6gMTYkEiHYsKVn4qKlNx9Y-gIbC0mwfwCAAsmk6xiWCEmQhc+inNp4qYleo4+ih+YlP4pTmNUopVHp370Lx7DETZnaFMYiozsOfgGNYVRnrKFSBO02kJdUcE+NpgVLnwiyLGZtIsGFKbgeRR6HJ4FzdEihgFslUrYlU9TyY8JgIrlEz5YVtKLIJbClXu5UHLOOAPsKVRPBWkp+Ml+YZrOtiBJ4opwQF77knhEzMIshpmf1MwCP1g2iUmoG2QKdS9k1mheIEyrLcl6hKr2vTVDO+YuleXUNoZtJNgAagI8wsAA4kNpGQv2vbpfiPheJUMo+noFxHnYKEve1JJ2L9CS7YabK8GyADSkOXQekpQaG9XqRWCLCnN7kvIqqMEmedizvUeP0AIkxg3SROMKT5MRdmio5t5frqXU6nJe62K5i6PhXnooZ+DzgnMEd3ACGyp1Wed4liwW434t4pxdF03pND5PYuiSZ42Nlhga5tn54BgEBoOQBBQPQECKGAOAkAAbtIADWwee97pBgPklBoE40h4KQov7ue6j6Eq1RlMcBbabKwq6MOKH1Vo7ryrhMc+yQ-tgCgKDSCgOAYInpAAGbNwAtvgXs+-HifJ6n6fle6WcukGLTGHUyJFp6+jIh1qr1FibtDJGKBgAQEAN3XAdByHBDh1HOBbzvDf5OSo9kf0Ga1KppiVLJhfuQhb0EvmPhwl4ei4efu8UD7wbk3FubcfZdxQL3ABl9r5nXbFDG4SJ3DDnUs+BCdQbaIGWhmZEKtPTVFXv4EI74CDSF3vAXI5IQTG33PkB8RwXSPw9F6FSfYjzCkdp0OEop14fkjIQEgWwqC0EgDQ8K+5UQZhJOUOCzo-TLVeGOOCxQzxMTVq7OKrs8biLKmRD0JQiRGGqEYuWb9lQyUeK0KwgZSzWFwiA5uujhr6K0e0XOc4zzq0asULoeJHgVgUa5au-dfZQGcYghAmJ3Cc0tvDRGTMmiM0zKccoSJWgJUCP-begC64RIpqUCo+gjGvClKYeqyMkkdBSRcOEGjMmkhIUAA */
    predictableActionArguments: true,
    id: 'graph',
    initial: 'uninitialized',
    context: {
      isHovering: false,
      elements: [],
      theme: 'light',
      results: [],
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
            target: 'updating',
            actions: [
              'setWorker',
              'createTraversalGraph',
              'createRenderGraph',
              'setTheme',
              'setInitialElements',
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
            ],
          },
          DESTROY: {
            cond: 'hasInitialized',
            actions: ['destroy'],
          },
          // Graph interactions
          HIDE: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['hide', 'unselect'],
          },
          HIDE_DEPENDENCIES: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['hideDependencies', 'unselect'],
          },
          HIDE_DEPENDANTS: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['hideDependents', 'unselect'],
          },
          HIDE_ALL: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['hideAll', 'unselect'],
          },
          SHOW: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['show', 'unselect'],
          },
          SHOW_DEPENDENCIES: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['showDependencies', 'unselect'],
          },
          SHOW_DEPENDANTS: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['showDependants', 'unselect'],
          },
          SHOW_ALL: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['showAll', 'unselect'],
          },
          FOCUS: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['focus', 'unselect'],
          },
          SET_THEME: {
            target: 'updating',
            cond: 'hasInitialized',
            actions: ['setTheme'],
          },
          // Graph toolbar events triggered by the user
          FIT: {
            cond: 'hasInitialized',
            actions: ['fit'],
          },
          ZOOM_IN: {
            cond: 'hasInitialized',
            actions: ['zoomIn'],
          },
          ZOOM_OUT: {
            cond: 'hasInitialized',
            actions: ['zoomOut'],
          },
          // Events triggered by the graph
          NODE_MOUSEOUT: {
            cond: 'hasInitialized',
            actions: ['unselect'],
          },
          SET_HOVERING: {
            cond: 'hasInitialized',
            actions: ['setHovering'],
          },
          NODE_CLICK: {
            cond: 'hasInitialized',
            actions: ['nodeClick', 'log'],
          },
          EDGE_CLICK: {
            cond: 'hasInitialized',
            actions: ['edgeClick'],
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
          },
          onError: {
            target: 'error',
            cond: 'hasInitialized',
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
          results: context.results,
          onEdgeClick: (event) => {
            if (!context.renderGraph) return;

            callback({ type: 'EDGE_CLICK', edge: event.target });
          },
          onNodeClick: (event) => {
            if (!context.renderGraph) return;

            callback({ type: 'NODE_CLICK', node: event.target });
          },
          onMove: debounce(
            () => {
              if (!context.renderGraph) return;
              callback({ type: 'UNSELECT' });
            },
            1000,
            { leading: true, trailing: false },
          ),
        });
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
      nodeClick: assign({
        selectedEdge: undefined,
        selectedRenderNode: (context, event) => {
          if (context.selectedRenderNode?.id() === event.node.id()) {
            return;
          }

          return event.node;
        },
        selectedTraversalNode: (context, event) => {
          if (!context.traversalGraph) return;

          if (context.selectedRenderNode?.id() === event.node.id()) {
            return;
          }

          return context.traversalGraph.$id(event.node.id());
        },
      }),
      edgeClick: assign({
        selectedRenderNode: undefined,
        selectedTraversalNode: undefined,
        selectedEdge: (context, event) => {
          if (context.selectedEdge?.id() === event.edge.id()) {
            return;
          }

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
