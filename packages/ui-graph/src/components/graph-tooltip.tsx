'use client';
import React from 'react';
import cytoscape from 'cytoscape';
import { useMemo, useState } from 'react';
import { usePopper } from 'react-popper';

export interface GraphTooltipProperties {
  children: React.ReactNode;
  element: cytoscape.EventObject['target'];
}

export const GraphTooltip = ({
  children,

  element,
}: GraphTooltipProperties) => {
  const [tooltipReference, setTooltipReference] = useState<
    HTMLDivElement | undefined
  >();

  const referenceReference = useMemo(() => element.popperRef(), [element]);

  const boundaryElement = document.querySelector('#graph-layout-root');

  const { styles, attributes } = usePopper(
    referenceReference,
    tooltipReference,
    {
      modifiers: [
        {
          name: 'flip',
          options: {
            allowedAutoPlacements: ['top', 'bottom'],
            boundary: boundaryElement ?? undefined,
            padding: 8,
          },
        },
      ],
    },
  );

  return (
    <div className="animate-in fade-in">
      <div
        className="border-border bg-background text-foreground relative z-50 rounded-lg border font-sans text-sm shadow"
        style={styles.popper}
        ref={(element) => setTooltipReference(element ?? undefined)}
        {...attributes.popper}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};
