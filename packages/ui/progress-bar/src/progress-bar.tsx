import React, { useMemo, useCallback } from 'react';
import {
  StyledSuccessProgressIndicator,
  StyledWarningProgressIndicator,
  StyledErrorProgressIndicator,
  StyledInfoProgressIndicator,
  StyledDefaultProgressIndicator,
  LabelWrapper,
  LabelLeft,
  LabelRight,
  StyledProgressBar,
} from './progress-bar.styles';

export type ProgressBarProps = {
  max?: number;
  maxLabel?: string | number;
  min?: number;
  minLabel?: string | number;
  value?: number;
  className?: string;
  use?: 'success' | 'warning' | 'error' | 'info' | 'default';
};

const MINIMUM_WIDTH = 0.02;
const MAXIMUM_WIDTH = 1;

const COMPONENT_BY_USE = {
  success: StyledSuccessProgressIndicator,
  warning: StyledWarningProgressIndicator,
  error: StyledErrorProgressIndicator,
  info: StyledInfoProgressIndicator,
  default: StyledDefaultProgressIndicator,
};

export function ProgressBar({
  max = 100,
  maxLabel,
  min = 0,
  minLabel,
  value = 0,
  className,
  use = 'info',
}: ProgressBarProps) {
  const getWidthPercentage = useCallback(() => {
    const widthPercentage = value - min > 0 ? (value - min) / (max - min) : 0;

    if (widthPercentage > MAXIMUM_WIDTH) {
      return MAXIMUM_WIDTH;
    }

    if (widthPercentage < MINIMUM_WIDTH) {
      return MINIMUM_WIDTH;
    }

    return widthPercentage;
  }, [max, min, value]);

  const Component = COMPONENT_BY_USE[use];

  const progressBarWidth = useMemo(
    () => `${getWidthPercentage() * 100}%`,
    [getWidthPercentage]
  );

  return (
    <div>
      <LabelWrapper>
        <LabelLeft>{minLabel || min}</LabelLeft>
        <LabelRight>{maxLabel || max}</LabelRight>
      </LabelWrapper>
      <StyledProgressBar className={className}>
        <Component style={{ width: progressBarWidth }} />
      </StyledProgressBar>
    </div>
  );
}
