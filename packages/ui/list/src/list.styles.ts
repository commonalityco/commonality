import {
  GRAY_700,
  GRAY_100,
  GRAY_200,
  GRAY_500,
  WHITE,
} from '@commonality/colors';
import styled, { CSSProperties } from 'styled-components';

export const StyledListItem = styled.li<any>`
  font-family: ${({ theme }) => theme.fontFamily.primary};
  color: ${({ theme }) => theme.color.secondary};
`;

export const StyledOrderedList = styled.ol<{
  listStyle: CSSProperties['listStyle'];
}>`
  padding-left: 16px;
  margin: 0;
  list-style: ${(props) => props.listStyle};
`;

export const StyledUnorderedList = styled.ul<{
  listStyle: CSSProperties['listStyle'];
}>`
  padding: ${(props) => (props.listStyle !== 'none' ? '0 0 0 20px' : '0')};
  margin: 0;
  list-style: ${(props) => props.listStyle};

  a,
  button {
    background: ${WHITE};
    border: none;
    display: inline-block;
    vertical-align: middle;
    text-decoration: none;
    width: 100%;
    text-align: left;
    color: ${({ theme }) => theme.color.secondary};
    min-height: 32px;
    padding: 0 12px;
    font-weight: 500;
    border-radius: 3px;
    position: relative;
    font-size: 14px;
    user-select: none;
    letter-spacing: -0.006em;
    line-height: 32px;
    font-family: ${({ theme }) => theme.fontFamily.primary};
    outline: none;

    svg {
      color: ${GRAY_500} !important;
    }

    &:hover {
      background-color: ${GRAY_100};

      svg {
        color: ${GRAY_700} !important;
      }

      &:after {
        opacity: 1;
      }
    }

    &:active {
      background-color: ${GRAY_200};
    }
  }
`;
