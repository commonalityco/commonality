'use client';
import { cn } from '@commonalityco/ui-design-system/cn';
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { setCookie } from 'cookies-next';
import { COOKIE_GRAPH_LAYOUT } from '../constants/cookie-names';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@commonalityco/ui-design-system';

import React, { useRef, useState } from 'react';

const CollapseButton = ({
  className,
  onClick,
  openDirection,
  open,
}: {
  className?: string;
  onClick: () => void;
  open: boolean;
  openDirection?: 'left' | 'right';
}) => {
  return (
    <TooltipTrigger
      className={cn(
        'group flex h-[72px] w-8 items-center justify-center',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex h-7 w-6 flex-col items-center">
        <div
          className={cn(
            'bg-muted-foreground group-hover:bg-primary h-5 w-1 translate-y-[2.5px] rounded-full transition-all',
            {
              'group-hover:rotate-[30deg]': openDirection === 'left',
              'group-hover:rotate-[-30deg]': openDirection === 'right',
            },
            {
              'group-hover:rotate-[-30deg]': openDirection === 'left' && open,
              'group-hover:rotate-[30deg]': openDirection === 'right' && open,
            },
          )}
        />
        <div
          className={cn(
            'bg-muted-foreground group-hover:bg-primary h-5 w-1 -translate-y-[2.5px] rounded-full transition-all',
            {
              'group-hover:rotate-[-30deg]': openDirection === 'left',
              'group-hover:rotate-[30deg]': openDirection === 'right',
            },
            {
              'group-hover:rotate-[30deg]': openDirection === 'left' && open,
              'group-hover:rotate-[-30deg]': openDirection === 'right' && open,
            },
          )}
        />
      </div>
    </TooltipTrigger>
  );
};

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
        setCookie(COOKIE_GRAPH_LAYOUT, sizes);
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
  const [collapsed, setCollapsed] = useState(Boolean(defaultSize));
  const panel = useRef<ImperativePanelHandle>(null);

  return (
    <>
      <Panel
        ref={panel}
        collapsedSize={0}
        collapsible
        onResize={() => setCollapsed(false)}
        onCollapse={() => setCollapsed(true)}
        id="left-sidebar"
        order={1}
        defaultSize={defaultSize}
        minSize={20}
        className={cn(
          'relative z-20 hidden h-full shrink-0 grow-0 md:block',
          className,
        )}
      >
        <div className="h-full shrink-0">{children}</div>
      </Panel>
      <div className="relative z-20 h-full w-4">
        <PanelResizeHandle className="group relative z-10 h-full w-4">
          <div className="bg-border group-data-[resize-handle-active=pointer]:bg-muted-foreground group-hover:bg-muted-foreground/50 absolute bottom-0 right-0 top-0 m-auto w-px transition-all group-hover:w-0.5 group-data-[resize-handle-active=pointer]:w-0.5" />
        </PanelResizeHandle>
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <CollapseButton
              open={collapsed}
              openDirection="left"
              className="absolute -right-8 bottom-0 top-0 z-10 my-auto"
              onClick={() => {
                if (collapsed) {
                  panel.current?.expand();
                } else {
                  panel.current?.collapse();
                }
                setCollapsed(!collapsed);
              }}
            />

            <TooltipContent side="right">
              {collapsed ? 'Show filters' : 'Hide filters'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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
  const panel = useRef<ImperativePanelHandle>(null);
  const [collapsed, setCollapsed] = useState(Boolean(defaultSize));

  return (
    <>
      <div className="relative z-20 h-full w-4">
        <PanelResizeHandle className="group relative z-10 h-full w-4">
          <div className="bg-border group-data-[resize-handle-active=pointer]:bg-muted-foreground group-hover:bg-muted-foreground/50 absolute bottom-0 left-0 top-0 m-auto w-px transition-all group-hover:w-0.5 group-data-[resize-handle-active=pointer]:w-0.5" />
        </PanelResizeHandle>
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <CollapseButton
              open={collapsed}
              openDirection="right"
              className="absolute -left-8 bottom-0 top-0 z-10 my-auto"
              onClick={() => {
                if (collapsed) {
                  panel.current?.expand();
                } else {
                  panel.current?.collapse();
                }
                setCollapsed(!collapsed);
              }}
            />

            <TooltipContent side="left">
              {collapsed ? 'Show context' : 'Hide context'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Panel
        collapsedSize={0}
        onResize={() => setCollapsed(false)}
        onCollapse={() => setCollapsed(true)}
        ref={panel}
        id="context"
        collapsible
        order={3}
        defaultSize={defaultSize}
        minSize={20}
        className={cn(
          'relative z-20 hidden h-full shrink-0 grow-0 overflow-visible md:block',
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
  return (
    <Panel
      order={2}
      minSize={30}
      defaultSize={defaultSize}
      className="align-stretch relative flex h-full w-full grow overflow-hidden"
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
