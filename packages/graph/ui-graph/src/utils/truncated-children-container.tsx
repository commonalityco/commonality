/**
 * TruncatedFlexContainer is a React component that displays a limited number of children
 * within a flex container. It also provides a formatted text to indicate the number of
 * hidden children and displays a tooltip with the provided content.
 */
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@commonalityco/ui-design-system';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TruncatedChildrenContainerProperties {
  /** The children elements to be displayed within the container. */
  children: React.ReactNode;
  /** Optional CSS classes to be applied to the container. */
  className?: string;
  /** The maximum number of visible children within the container. Default is 3. */
  maxVisibleChildren?: number;
  /** An optional function to format the text displayed when additional children are hidden. */
  formatText?: (hiddenCount: number) => React.ReactNode;
  /** An optional function to format the tooltip displayed when additional children are hidden. */
  formatTooltip?: (hiddenCount: number) => React.ReactNode;
}

export const TruncatedChildrenContainer = ({
  children,
  className,
  maxVisibleChildren = 3,
  formatText = (hiddenCount) => `and ${hiddenCount} more`,
  formatTooltip = (hiddenCount) => hiddenCount,
}: TruncatedChildrenContainerProperties) => {
  const totalChildren = React.Children.count(children);
  const hiddenCount = Math.max(0, totalChildren - maxVisibleChildren);

  return (
    <div
      className={twMerge(
        `flex flex-wrap content-start gap-2 overflow-hidden`,
        className
      )}
    >
      {React.Children.toArray(children).slice(0, maxVisibleChildren)}
      {hiddenCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="self-center truncate text-foreground">
                {formatText(hiddenCount)}
              </span>
            </TooltipTrigger>
            <TooltipContent>{formatTooltip(hiddenCount)}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
