'use client';
import React, {
  RefAttributes,
  cloneElement,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  useFloating,
  useClick,
  useInteractions,
  ReferenceType,
  useRole,
  useDismiss,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
} from '@floating-ui/react';

export interface GraphTooltipProperties {
  content: React.ReactNode;
  open?: boolean;
  children?: React.ReactElement;
  reference?: ReferenceType;
  strategy?: 'absolute' | 'fixed';
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export const GraphTooltip = ({
  children,
  open = false,
  content,
  placement = 'top',
  reference: externalReference,
  strategy = 'absolute',
}: GraphTooltipProperties) => {
  const [isOpen, setIsOpen] = useState(open);
  const arrowRef = useRef(null);

  const {
    x,
    y,
    strategy: usedStrategy,
    refs,
    placement: finalPlacement,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    context,
  } = useFloating({
    placement,
    whileElementsMounted: strategy === 'fixed' ? autoUpdate : undefined,
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy,
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 6 }),
      arrow({ element: arrowRef }),
    ],
  });

  const staticSide: string =
    {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[finalPlacement.split('-')[0]] || 'bottom';

  useLayoutEffect(() => {
    if (externalReference) {
      refs.setReference(externalReference);
    }
  }, [refs, externalReference]);

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    enabled: true,
    referencePress: false,
    outsidePress: true,
    outsidePressEvent: 'mousedown',
  });

  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const cloneProps: RefAttributes<HTMLElement> = {
    ref: refs.setReference,
    ...getReferenceProps(),
  };

  return (
    <>
      {!externalReference && !!children
        ? cloneElement(children, cloneProps)
        : children}
      {isOpen ? (
        <div
          ref={refs.setFloating}
          style={{
            position: usedStrategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          className="z-10"
          {...getFloatingProps()}
        >
          <div
            style={{
              left: arrowX === undefined ? '' : `${arrowX}px`,
              top: arrowY === undefined ? '' : `${arrowY}px`,
              right: '',
              bottom: '',
              [staticSide]: '-4px',
            }}
            className="absolute z-60 h-4 w-4 rotate-45 bg-background border-b border-r"
            ref={arrowRef}
          />
          <div className="border-border bg-background text-foreground z-50 rounded-lg border font-sans text-sm shadow-sm">
            {content}
          </div>
        </div>
      ) : undefined}
    </>
  );
};
