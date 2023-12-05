import { Dependency, Package } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';
import type { ElementDefinition, NodeDefinition } from 'cytoscape';
import { fontFamily, fontSize, fontWeight } from './styles/node';

const nodeImage =
  'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnPgo8c3ZnIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDM2IDM2IiBmaWxsPSJub25lIgogICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxtYXNrIGlkPSJtYXNrMF8wXzMiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIyIiB5PSIwIiB3aWR0aD0iMzMiIGhlaWdodD0iMzYiPgogICAgICAgIDxwYXRoIGQ9Ik0xNy4xNTUxIDAuMjI3NzMzTDIuODYzNjYgOC4zNzE2MUMyLjMyODM2IDguNjc2MzcgMiA5LjIzOTAyIDIgOS44NDcyVjI2LjE0NjNDMiAyNi43NTQ5IDIuMzI4MzYgMjcuMzE3MiAyLjg2MzY2IDI3LjYyMTlMMTcuMTU2MSAzNS43NzIyQzE3LjY5MDQgMzYuMDc1OSAxOC4zNDkyIDM2LjA3NTkgMTguODgyOCAzNS43NzIyTDMzLjE3MjkgMjcuNjIxOUMzMy43MDU1IDI3LjMxNzIgMzQuMDM0NSAyNi43NTQ1IDM0LjAzNDUgMjYuMTQ2M1Y5Ljg0NzJDMzQuMDM0NSA5LjIzOTAyIDMzLjcwNTUgOC42NzYzNyAzMy4xNjk1IDguMzcxNjFMMTguODgxNCAwLjIyNzczM0MxOC42MTM0IDAuMDc2MDIwOSAxOC4zMTQ5IDAgMTguMDE2NCAwQzE3LjcxNzkgMCAxNy40MTk0IDAuMDc2MDIwOSAxNy4xNTE0IDAuMjI3NzMzIiBmaWxsPSJ3aGl0ZSIvPgogICAgPC9tYXNrPgogICAgPGcgbWFzaz0idXJsKCNtYXNrMF8wXzMpIj4KICAgICAgICA8cGF0aCBkPSJNNDguNDc2NyA2Ljk4ODc4TDguMjA1ODQgLTEyLjQ5OTNMLTEyLjQ0MjcgMjkuMDg3MUwyNy44MjcyIDQ4LjU3NjNMNDguNDc2NyA2Ljk4ODc4WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzBfMykiLz4KICAgIDwvZz4KICAgIDxtYXNrIGlkPSJtYXNrMV8wXzMiIHN0eWxlPSJtYXNrLXR5cGU6bHVtaW5hbmNlIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIyIiB5PSIwIiB3aWR0aD0iMzIiIGhlaWdodD0iMzYiPgogICAgICAgIDxwYXRoIGQ9Ik0yLjM1NDI1IDI3LjE4MTJDMi40OTA5NSAyNy4zNTY0IDIuNjYxOTIgMjcuNTA4MSAyLjg2MzA4IDI3LjYyMkwxNS4xMjI2IDM0LjYxMzFMMTcuMTY0NyAzNS43NzE5QzE3LjQ3IDM1Ljk0NiAxNy44MTgxIDM2LjAxOTcgMTguMTYgMzUuOTk0NkMxOC4yNzQgMzUuOTg1NSAxOC4zODggMzUuOTY0NCAxOC40OTkyIDM1LjkzMzNMMzMuNTcyMyA4LjY4NTQzQzMzLjQ1NjkgOC41NjE1MSAzMy4zMjE5IDguNDU3NyAzMy4xNzA2IDguMzcwNjJMMjMuODEyOCAzLjAzNTU4TDE4Ljg2NjMgMC4yMjU3MzJDMTguNzI1OCAwLjE0NTM1NSAxOC41NzM1IDAuMDg4NDIxNiAxOC40MTg1IDAuMDQ4MjMzTDIuMzU0MjUgMjcuMTgxMloiIGZpbGw9IndoaXRlIi8+CiAgICA8L21hc2s+CiAgICA8ZyBtYXNrPSJ1cmwoI21hc2sxXzBfMykiPgogICAgICAgIDxwYXRoIGQ9Ik0tMTUuMDU3NCAxMi43NTI5TDEzLjM3OCA1MC43NDg4TDUwLjk4NDIgMjMuMzE4MUwyMi41NDcyIC0xNC42NzY4TC0xNS4wNTc0IDEyLjc1MjlaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfMF8zKSIvPgogICAgPC9nPgogICAgPG1hc2sgaWQ9Im1hc2syXzBfMyIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIiIHk9IjAiIHdpZHRoPSIzMyIgaGVpZ2h0PSIzNiI+CiAgICAgICAgPHBhdGggZD0iTTE3Ljg0NTggMC4wMDkzNTI5N0MxNy42MDYgMC4wMzI3OTYzIDE3LjM3MTYgMC4xMDY0NzMgMTcuMTU1NSAwLjIyNzcwOEwyLjkwNDc1IDguMzQ4MTVMMTguMjcxNiAzNS45ODExQzE4LjQ4NTMgMzUuOTUxIDE4LjY5NTYgMzUuODgwNyAxOC44ODU1IDM1Ljc3MjJMMzMuMTc3IDI3LjYyMTlDMzMuNjE4IDI3LjM2OTQgMzMuOTE5OSAyNi45NDIxIDM0LjAxMTUgMjYuNDU3OEwxOC4zNDYyIDAuMDM3MTQ3NkMxOC4yMzA4IDAuMDE0NzA5IDE4LjExNTUgMC4wMDI5OTA3MiAxNy45OTY4IDAuMDAyOTkwNzJDMTcuOTQ5MyAwLjAwMjk5MDcyIDE3LjkwMTggMC4wMDUzMzEzOCAxNy44NTQzIDAuMDA5Njg1MTQiIGZpbGw9IndoaXRlIi8+CiAgICA8L21hc2s+CiAgICA8ZyBtYXNrPSJ1cmwoI21hc2syXzBfMykiPgogICAgICAgIDxwYXRoIGQ9Ik0yLjkwNDUxIDAuMDAyOTkwNzJWMzUuOTgxOEgzNC4wMDU1VjAuMDAyOTkwNzJIMi45MDQ1MVoiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl8wXzMpIi8+CiAgICA8L2c+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMF8zIiB4MT0iMjguMzI5MiIgeTE9Ii0yLjc4NTkyIiB4Mj0iOC4xMDUyOCIgeTI9IjM5LjAwMjYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwLjMiIHN0b3AtY29sb3I9IiMzRTg2M0QiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiM1NTkzNEYiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwLjgiIHN0b3AtY29sb3I9IiM1QUFENDUiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8wXzMiIHgxPSItMC42NjkzMTkiIHkxPSIzMS45Njg2IiB4Mj0iMzYuNTk2OCIgeTI9IjQuMDc4MzQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwLjU3IiBzdG9wLWNvbG9yPSIjM0U4NjNEIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC43MiIgc3RvcC1jb2xvcj0iIzYxOTg1NyIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NkFDNjQiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl8wXzMiIHgxPSIyLjkxNSIgeTE9IjE3Ljk5MzQiIHgyPSIzNC4wMTE0IiB5Mj0iMTcuOTkzNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAuMTYiIHN0b3AtY29sb3I9IiM2QkJGNDciLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwLjM4IiBzdG9wLWNvbG9yPSIjNzlCNDYxIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMC40NyIgc3RvcC1jb2xvcj0iIzc1QUM2NCIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAuNyIgc3RvcC1jb2xvcj0iIzY1OUU1QSIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAuOSIgc3RvcC1jb2xvcj0iIzNFODYzRCIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+Cjwvc3ZnPgo=';
const reactLogo =
  'PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzBfMykiPgo8cGF0aCBkPSJNMTggMjEuMTA1NUMxOS43NzIxIDIxLjEwNTUgMjEuMjA4NyAxOS43MTUxIDIxLjIwODcgMThDMjEuMjA4NyAxNi4yODQ5IDE5Ljc3MjEgMTQuODk0NSAxOCAxNC44OTQ1QzE2LjIyNzkgMTQuODk0NSAxNC43OTEzIDE2LjI4NDkgMTQuNzkxMyAxOEMxNC43OTEzIDE5LjcxNTEgMTYuMjI3OSAyMS4xMDU1IDE4IDIxLjEwNTVaIiBmaWxsPSIjNjFEQUZCIi8+CjxwYXRoIGQ9Ik0xOCAyNC4zNjI2QzI3LjUwODkgMjQuMzYyNiAzNS4yMTc0IDIxLjUxMzkgMzUuMjE3NCAxOEMzNS4yMTc0IDE0LjQ4NjEgMjcuNTA4OSAxMS42Mzc1IDE4IDExLjYzNzVDOC40OTExMSAxMS42Mzc1IDAuNzgyNjIzIDE0LjQ4NjEgMC43ODI2MjMgMThDMC43ODI2MjMgMjEuNTEzOSA4LjQ5MTExIDI0LjM2MjYgMTggMjQuMzYyNloiIHN0cm9rZT0iIzYxREFGQiIvPgo8cGF0aCBkPSJNMTIuMzA2OCAyMS4xODEzQzE3LjA2MTMgMjkuMTUxNSAyMy40NjQ1IDM0LjE4ODMgMjYuNjA4NyAzMi40MzEzQzI5Ljc1MyAzMC42NzQzIDI4LjQ0NzcgMjIuNzg4OSAyMy42OTMyIDE0LjgxODdDMTguOTM4NyA2Ljg0ODUzIDEyLjUzNTYgMS44MTE3MyA5LjM5MTMzIDMuNTY4N0M2LjI0NzA3IDUuMzI1NjcgNy41NTI0IDEzLjIxMTEgMTIuMzA2OCAyMS4xODEzWiIgc3Ryb2tlPSIjNjFEQUZCIi8+CjxwYXRoIGQ9Ik0xMi4zMDY4IDE0LjgxODdDNy41NTIzOCAyMi43ODg5IDYuMjQ3MDYgMzAuNjc0MyA5LjM5MTMxIDMyLjQzMTNDMTIuNTM1NiAzNC4xODgzIDE4LjkzODcgMjkuMTUxNSAyMy42OTMyIDIxLjE4MTNDMjguNDQ3NiAxMy4yMTExIDI5Ljc1MyA1LjMyNTY2IDI2LjYwODcgMy41Njg2OUMyMy40NjQ0IDEuODExNzIgMTcuMDYxMyA2Ljg0ODUzIDEyLjMwNjggMTQuODE4N1oiIHN0cm9rZT0iIzYxREFGQiIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzBfMyI+CjxyZWN0IHdpZHRoPSIzNiIgaGVpZ2h0PSIzMSIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMi41KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=';
const nextLogo =
  'PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzBfMykiPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDFfMF8zKSI+CjxtYXNrIGlkPSJtYXNrMF8wXzMiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+CjxwYXRoIGQ9Ik0xOCAzNkMyNy45NDExIDM2IDM2IDI3Ljk0MTEgMzYgMThDMzYgOC4wNTg4OCAyNy45NDExIDAgMTggMEM4LjA1ODg4IDAgMCA4LjA1ODg4IDAgMThDMCAyNy45NDExIDguMDU4ODggMzYgMTggMzZaIiBmaWxsPSJibGFjayIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfMF8zKSI+CjxwYXRoIGQ9Ik0xOCAzNS40QzI3LjYwOTggMzUuNCAzNS40IDI3LjYwOTggMzUuNCAxOEMzNS40IDguMzkwMjUgMjcuNjA5OCAwLjYwMDAwNiAxOCAwLjYwMDAwNkM4LjM5MDI1IDAuNjAwMDA2IDAuNjAwMDA2IDguMzkwMjUgMC42MDAwMDYgMThDMC42MDAwMDYgMjcuNjA5OCA4LjM5MDI1IDM1LjQgMTggMzUuNFoiIGZpbGw9ImJsYWNrIiBzdHJva2U9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yOS45MDE2IDMxLjUwNEwxMy44Mjg0IDEwLjhIMTAuOFYyNS4xOTRIMTMuMjIyN1YxMy44NzY3TDI3Ljk5OTggMzIuOTY5QzI4LjY2NjYgMzIuNTIyOCAyOS4zMDE4IDMyLjAzMyAyOS45MDE2IDMxLjUwNFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8wXzMpIi8+CjxwYXRoIGQ9Ik0yNS40IDEwLjhIMjNWMjUuMkgyNS40VjEwLjhaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfMF8zKSIvPgo8L2c+CjwvZz4KPC9nPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMyIgeDE9IjIxLjgiIHkxPSIyMy4zIiB4Mj0iMjguOSIgeTI9IjMyLjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8wXzMiIHgxPSIyNC4yIiB5MT0iMTAuOCIgeDI9IjI0LjE1OTgiIHkyPSIyMS4zNzUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMF8zIj4KPHJlY3Qgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8Y2xpcFBhdGggaWQ9ImNsaXAxXzBfMyI+CjxyZWN0IHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K';

const ImageByPrimaryDependency: Record<PackageType, string> = {
  [PackageType.REACT]: reactLogo,
  [PackageType.NODE]: nodeImage,
  [PackageType.NEXT]: nextLogo,
};

const getNodeSize = ({
  context,
  name,
}: {
  context: CanvasRenderingContext2D | null;
  name: string;
}) => {
  if (!context) return;

  context.font = `normal ${fontWeight} ${fontSize}px ${fontFamily}`;

  const paddingY = 24;
  const paddingX = 24;
  const iconWidth = 50;
  const labelWidth = context.measureText(name).width;

  const paddedLabelWidth = labelWidth + paddingX * 2 + iconWidth;
  const paddedLabelHeight = fontSize + paddingY * 2;

  return {
    width: Math.ceil(paddedLabelWidth),
    height: Math.ceil(paddedLabelHeight),
  };
};

export const getElementDefinitions = ({
  dependencies,
  packages,
}: {
  dependencies: Dependency[];
  packages: Package[];
}): ElementDefinition[] => {
  if (typeof document === 'undefined') return [];

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const nodes: NodeDefinition[] = packages.map((package_) => {
      const dimensions = getNodeSize({ context, name: package_.name });
      const image = ImageByPrimaryDependency[package_.type] ?? nodeImage;
      const imageData = 'data:image/svg+xml;base64,' + image;

      return {
        data: {
          ...package_,
          id: package_.name,
          image: imageData,
          ...dimensions,
        },
      };
    });

    const edges = dependencies.map((dep) => {
      return {
        data: {
          ...dep,
          dependencies: dependencies.filter(
            (allDep) =>
              allDep.source === dep.source && allDep.target === dep.target,
          ),
          id: `${dep.source}->${dep.target}`,
        },
      };
    }) satisfies ElementDefinition[];

    return [...nodes, ...edges];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getElementDefinitions;
