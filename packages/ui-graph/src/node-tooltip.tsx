'use client';
import cytoscape from 'cytoscape';
import React, { useMemo, useState } from 'react';
import { usePopper } from 'react-popper';

export interface NodeTooltipProperties {
  children: React.ReactNode;
  element: cytoscape.EventObject['target'];
}

export const NodeTooltip = ({
  children,

  element,
}: NodeTooltipProperties) => {
  const [tooltipReference, setTooltipReference] = useState<
    HTMLElement | undefined
  >();

  const popperReference = useMemo(() => element.popperRef(), [element]);

  const { styles, attributes } = usePopper(popperReference, tooltipReference, {
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
      ref={(element_) => {
        if (!element_) return;

        setTooltipReference(element_);
      }}
      {...attributes.popper}
    >
      <div>{children}</div>
    </div>
  );
};
