'use client';
import { cn } from '@commonalityco/ui-design-system/cn';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { setCookie } from 'cookies-next';
import {
  COOKIE_GRAPH_LAYOUT_ONE,
  COOKIE_GRAPH_LAYOUT_TWO,
} from '../constants/cookie-names';

export function GraphLayoutRoot({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <PanelGroup
      autoSaveId="graph-layout"
      onLayout={(sizes) => {
        if (sizes[0]) {
          setCookie(COOKIE_GRAPH_LAYOUT_ONE, sizes[0]);
        }

        if (sizes[1]) {
          setCookie(COOKIE_GRAPH_LAYOUT_TWO, sizes[1]);
        }
      }}
      direction="horizontal"
      className={cn(
        'relative grid h-full max-h-screen min-h-0 w-full grid-cols-1 items-stretch overflow-hidden md:grid-cols-[auto_1fr]',
        className,
      )}
    >
      {children}
    </PanelGroup>
  );
}

export function GraphLayoutAside({
  children,
  className,
  defaultSize,
}: {
  children?: React.ReactNode;
  className?: string;
  defaultSize: number;
}) {
  return (
    <>
      <Panel
        defaultSize={defaultSize}
        minSize={20}
        className={cn(
          'hidden h-full shrink-0 grow-0 overflow-hidden py-4 pl-4 md:block',
          className,
        )}
      >
        <div className="h-full shrink-0">{children}</div>
      </Panel>
      <PanelResizeHandle className="group relative h-full w-4">
        <div className="bg-border group-data-[resize-handle-active=pointer]:bg-muted-foreground group-hover:bg-muted-foreground/50 absolute bottom-0 right-0 top-0 m-auto w-px transition-all group-hover:w-0.5 group-data-[resize-handle-active=pointer]:w-0.5" />
      </PanelResizeHandle>
    </>
  );
}

export function GraphLayoutMain({
  children,
  className,
  defaultSize,
}: {
  children?: React.ReactNode;
  className?: string;
  defaultSize: number;
}) {
  return (
    <Panel
      defaultSize={defaultSize}
      className="align-stretch flex h-full w-full grow overflow-hidden"
    >
      <div
        className={cn(
          'bg-interactive relative flex h-full w-full flex-col overflow-hidden',
          className,
        )}
        id="graph-layout-root"
      >
        {children}
      </div>
    </Panel>
  );
}
