'use client';
import cytoscape from 'cytoscape';
import React, { useMemo, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

export interface NodeTooltipProps {
  children: React.ReactNode;
  element: cytoscape.EventObject['target'];
}

export const NodeTooltip = ({
  children,

  element,
}: NodeTooltipProps) => {
  const [tooltipRef, setTooltipRef] = useState<HTMLElement | undefined>();
  const arrowRef = useRef(null);

  const popperRef = useMemo(() => element.popperRef(), [element]);

  const { styles, attributes } = usePopper(popperRef, tooltipRef, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 4],
        },
      },
    ],
  });

  return (
    <div
      className="border-border bg-background text-foreground relative z-50 rounded-lg border font-sans text-sm shadow"
      style={styles.popper}
      ref={(el) => {
        if (!el) return;

        setTooltipRef(el);
      }}
      {...attributes.popper}
    >
      <div>{children}</div>
      {/* <div ref={arrowRef} style={styles.arrow} /> */}
    </div>
  );
};
