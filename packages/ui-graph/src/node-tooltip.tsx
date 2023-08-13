'use client';
import cytoscape from 'cytoscape';
import { useMemo, useRef, useState } from 'react';
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
      className="relative z-50 rounded-lg border border-border bg-background font-sans text-sm text-foreground shadow"
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
