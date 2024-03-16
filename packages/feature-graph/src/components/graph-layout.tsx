'use client';
import { cn } from '@commonalityco/ui-design-system/cn';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { setCookie } from 'cookies-next';
import {
  COOKIE_GRAPH_LAYOUT_ONE,
  COOKIE_GRAPH_LAYOUT_TWO,
  COOKIE_GRAPH_LAYOUT_THREE,
} from '../constants/cookie-names';
import { useHideContextQuery, useHideFiltersQuery } from '../query/query-hooks';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';
import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';

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

        if (sizes[2]) {
          setCookie(COOKIE_GRAPH_LAYOUT_THREE, sizes[2]);
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

export function GraphLayoutLeftSidebar({
  children,
  className,
  defaultSize,
}: {
  children?: React.ReactNode;
  className?: string;
  defaultSize: number;
}) {
  const [hideFiltersQuery] = useHideFiltersQuery();

  if (hideFiltersQuery) {
    return;
  }
  return (
    <>
      <Panel
        key="left-sidebar"
        order={1}
        defaultSize={defaultSize}
        minSize={15}
        className={cn(
          'relative z-20 hidden h-full shrink-0 grow-0 py-4 pl-4 pr-1 md:block',
          className,
        )}
      >
        <div className="h-full shrink-0">{children}</div>
      </Panel>
      <PanelResizeHandle className="group relative z-10 h-full w-4">
        <div className="bg-border group-data-[resize-handle-active=pointer]:bg-muted-foreground group-hover:bg-muted-foreground/50 absolute bottom-0 right-0 top-0 m-auto w-px transition-all group-hover:w-0.5 group-data-[resize-handle-active=pointer]:w-0.5" />
      </PanelResizeHandle>
    </>
  );
}

export function GraphLayoutRightSidebar({
  children,
  className,
  defaultSize,
}: {
  children?: React.ReactNode;
  className?: string;
  defaultSize: number;
}) {
  const [hideContextQuery] = useHideContextQuery();

  if (hideContextQuery) {
    return;
  }

  return (
    <>
      <PanelResizeHandle className="group relative z-10 h-full w-4">
        <div className="bg-border group-data-[resize-handle-active=pointer]:bg-muted-foreground group-hover:bg-muted-foreground/50 absolute bottom-0 left-0 top-0 m-auto w-px transition-all group-hover:w-0.5 group-data-[resize-handle-active=pointer]:w-0.5" />
      </PanelResizeHandle>
      <Panel
        order={3}
        defaultSize={defaultSize}
        minSize={15}
        className={cn(
          'relative z-20 hidden h-full shrink-0 grow-0 md:block',
          className,
        )}
      >
        <div className="h-full shrink-0">{children}</div>
      </Panel>
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
  const [hideFiltersQuery, setHideFiltersQuery] = useHideFiltersQuery();
  const [hideContextQuery, setHideContextQuery] = useHideContextQuery();

  return (
    <Panel
      order={2}
      minSize={45}
      defaultSize={defaultSize}
      className="align-stretch relative flex h-full w-full grow overflow-hidden"
    >
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 left-4 top-0 z-10 my-auto"
              onClick={() => setHideFiltersQuery(!hideFiltersQuery)}
            >
              {hideFiltersQuery ? (
                <ArrowRightToLine className="h-4 w-4" />
              ) : (
                <ArrowLeftToLine className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {hideFiltersQuery ? 'Show filters' : 'Hide filters'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        className={cn(
          'bg-interactive relative flex h-full w-full flex-col overflow-hidden',
          className,
        )}
        id="graph-layout-root"
      >
        {children}
      </div>
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-4 top-0 z-10 my-auto"
              onClick={() => setHideContextQuery(!hideContextQuery)}
            >
              {hideContextQuery ? (
                <ArrowLeftToLine className="h-4 w-4" />
              ) : (
                <ArrowRightToLine className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {hideContextQuery ? 'Show filters' : 'Hide filters'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Panel>
  );
}
