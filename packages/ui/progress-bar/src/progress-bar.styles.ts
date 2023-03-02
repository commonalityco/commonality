import styled from 'styled-components';
import {
  BLUE_500,
  GRAY_500,
  GRAY_100,
  EMERALD_500,
  YELLOW_500,
  RED_500,
} from '@commonality/colors';

export const StyledProgressBar = styled.div<any>`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 6px;
  background-color: ${GRAY_100};
  border-radius: 6px;
`;

export const LabelLeft = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: 12px;
  letter-spacing: 0em;
  line-height: 1;
  color: ${GRAY_500};
  font-weight: 500;
  flex-grow: 0;
  text-align: left;
`;

export const LabelRight = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.primary};
  font-size: 12px;
  letter-spacing: 0em;
  line-height: 1;
  color: ${GRAY_500};
  font-weight: 500;
  text-align: right;
`;

export const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  max-width: 500px;
  position: relative;
`;

export const CurrentValueLabel = styled.div<any>`
  font-size: 12px;
  color: ${GRAY_500};
  font-weight: 600;
  text-align: center;
  position: absolute;
  left: ${(props) => props.left};
  transform: translateX(-50%);
`;

const StyledProgressIndicator = styled.div`
  height: 100%;
  border-radius: 6px;
`;

export const StyledSuccessProgressIndicator = styled(StyledProgressIndicator)`
  background-color: ${EMERALD_500};
`;

export const StyledWarningProgressIndicator = styled(StyledProgressIndicator)`
  background-color: ${YELLOW_500};
`;

export const StyledErrorProgressIndicator = styled(StyledProgressIndicator)`
  background-color: ${RED_500};
`;

export const StyledInfoProgressIndicator = styled(StyledProgressIndicator)`
  background-color: ${BLUE_500};
`;

export const StyledDefaultProgressIndicator = styled(StyledProgressIndicator)`
  background-color: ${GRAY_500};
`;
