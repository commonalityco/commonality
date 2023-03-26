import {
  EMERALD_500,
  zinc_400,
  BLUE_500,
  RED_500,
  YELLOW_500,
} from '@commonality/colors';
import styled from 'styled-components';

export const StatusDot = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 4px;
  display: inline-block;
`;

export const SuccessStatusDot = styled(StatusDot)`
  background-color: ${EMERALD_500};
`;

export const WarningStatusDot = styled(StatusDot)`
  background-color: ${YELLOW_500};
`;

export const ErrorStatusDot = styled(StatusDot)`
  background-color: ${RED_500};
`;

export const InfoStatusDot = styled(StatusDot)`
  background-color: ${BLUE_500};
`;

export const PendingStatusDot = styled(StatusDot)`
  background-color: ${zinc_400};
`;
