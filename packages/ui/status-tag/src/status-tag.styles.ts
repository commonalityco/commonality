import {
  zinc_100,
  BLUE_100,
  EMERALD_700,
  EMERALD_100,
  YELLOW_700,
  YELLOW_100,
  RED_700,
  RED_100,
  BLUE_700,
  BLUE_200,
  zinc_200,
  EMERALD_200,
  YELLOW_200,
  RED_200,
} from '@commonality/colors';
import styled from 'styled-components';

export const Text = styled.span`
  font-size: 12px;
  letter-spacing: 0em;
  line-height: 1;
  font-weight: 600;
  color: inherit;
  padding-left: 8px;
  margin: 0;
  white-space: pre;
  word-break: keep-all;
  font-family: ${({ theme }) => theme.fontFamily.primary};
`;

export const StatusTagContainer = styled.div`
  border-radius: 5px;
  display: inline-block;
  padding: 4px 8px;
`;

export const InfoStatusTag = styled(StatusTagContainer)`
  background: ${BLUE_100};
  color: ${BLUE_700};
  border: solid 1px ${BLUE_200};
`;

export const DefaultStatusTag = styled(StatusTagContainer)`
  background: ${zinc_100};
  color: var(--color-secondary);
  border: solid 1px ${zinc_200};
`;

export const SuccessStatusTag = styled(StatusTagContainer)`
  color: ${EMERALD_700};
  background-color: ${EMERALD_100};
  border: solid 1px ${EMERALD_200};
`;

export const WarningStatusTag = styled(StatusTagContainer)`
  color: ${YELLOW_700};
  background-color: ${YELLOW_100};
  border: solid 1px ${YELLOW_200};
`;

export const ErrorStatusTag = styled(StatusTagContainer)`
  color: ${RED_700};
  background-color: ${RED_100};
  border: solid 1px ${RED_200};
`;

export const StatusContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
`;
