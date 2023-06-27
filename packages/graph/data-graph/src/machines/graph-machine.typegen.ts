
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.render-graph": { type: "done.invoke.render-graph"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.render-graph": { type: "error.platform.render-graph"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "renderGraph": "done.invoke.render-graph";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "createRenderGraph": "INITIALIZE";
"createTraversalGraph": "INITIALIZE";
"destroy": "DESTROY";
"edgeClick": "EDGE_CLICK";
"fit": "FIT";
"focus": "FOCUS";
"hide": "HIDE";
"hideAll": "HIDE_ALL";
"hideDependants": "HIDE_DEPENDANTS";
"hideDependencies": "HIDE_DEPENDENCIES";
"log": "DESTROY" | "EDGE_CLICK" | "FIT" | "FOCUS" | "HIDE" | "HIDE_ALL" | "HIDE_DEPENDANTS" | "HIDE_DEPENDENCIES" | "INITIALIZE" | "NODE_MOUSEOUT" | "NODE_MOUSEOVER" | "NODE_SELECT" | "SET_IS_EDGE_COLOR_SHOWN" | "SET_THEME" | "SHOW" | "SHOW_ALL" | "SHOW_DEPENDANTS" | "SHOW_DEPENDENCIES" | "UNSELECT" | "ZOOM_IN" | "ZOOM_OUT" | "done.invoke.render-graph" | "error.platform.render-graph";
"nodeMouseOver": "NODE_MOUSEOVER";
"nodeSelect": "NODE_SELECT";
"renderIsEdgeColorShown": "SET_IS_EDGE_COLOR_SHOWN";
"setInitialElements": "INITIALIZE";
"setIsEdgeColorShown": "SET_IS_EDGE_COLOR_SHOWN";
"setTheme": "INITIALIZE" | "SET_THEME";
"show": "SHOW";
"showAll": "SHOW_ALL";
"showDependants": "SHOW_DEPENDANTS";
"showDependencies": "SHOW_DEPENDENCIES";
"unhover": "FOCUS" | "HIDE" | "HIDE_DEPENDENCIES" | "SHOW";
"unselect": "FOCUS" | "HIDE" | "HIDE_ALL" | "HIDE_DEPENDANTS" | "HIDE_DEPENDENCIES" | "NODE_MOUSEOUT" | "SHOW" | "SHOW_ALL" | "SHOW_DEPENDANTS" | "SHOW_DEPENDENCIES" | "UNSELECT";
"zoomIn": "ZOOM_IN";
"zoomOut": "ZOOM_OUT";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "renderGraphExists": "DESTROY" | "EDGE_CLICK" | "FIT" | "FOCUS" | "HIDE" | "HIDE_ALL" | "HIDE_DEPENDANTS" | "HIDE_DEPENDENCIES" | "NODE_MOUSEOUT" | "NODE_MOUSEOVER" | "NODE_SELECT" | "SET_IS_EDGE_COLOR_SHOWN" | "SET_THEME" | "SHOW" | "SHOW_ALL" | "SHOW_DEPENDANTS" | "SHOW_DEPENDENCIES" | "UNSELECT" | "ZOOM_IN" | "ZOOM_OUT" | "done.invoke.render-graph" | "error.platform.render-graph";
        };
        eventsCausingServices: {
          "renderGraph": "FOCUS" | "HIDE" | "HIDE_ALL" | "HIDE_DEPENDANTS" | "HIDE_DEPENDENCIES" | "INITIALIZE" | "SET_THEME" | "SHOW" | "SHOW_ALL" | "SHOW_DEPENDANTS" | "SHOW_DEPENDENCIES";
        };
        matchesStates: "error" | "loading" | "success" | "uninitialized";
        tags: never;
      }
  