'use client';
import cytoscape from 'cytoscape';
import { useMemo, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

export interface GraphTooltipProps {
  children: React.ReactNode;
  element: cytoscape.EventObject['target'];
}

export const GraphTooltip = ({
  children,

  element,
}: GraphTooltipProps) => {
  const [tooltipRef, setTooltipRef] = useState<HTMLElement | null>(null);

  const referenceRef = useMemo(() => element.popperRef(), [element]);

  const boundaryElement = document.querySelector('#graph-layout-root');

  const { styles, attributes } = usePopper(referenceRef, tooltipRef, {
    modifiers: [
      {
        name: 'flip',
        options: {
          allowedAutoPlacements: ['top', 'bottom'],
          boundary: boundaryElement ?? undefined,
          padding: 8,
        },
      },
      // {
      //   name: 'offset',
      //   options: {
      //     offset: [0, 8],
      //   },
      // },
      // {
      //   name: 'preventOverflow',
      //   options: {
      //     boundary: boundaryElement ?? undefined,
      //     padding: 8,
      //   },
      // },
    ],
  });

  return (
    <div className="animate-in fade-in">
      <div
        className="relative z-50 rounded-lg border border-border bg-background font-sans text-sm text-foreground shadow"
        style={styles.popper}
        ref={setTooltipRef}
        {...attributes.popper}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};
