import React from 'react';
import type { Properties } from 'csstype';
import {
  StyledOrderedList,
  StyledUnorderedList,
  StyledListItem,
} from './list.styles';

export interface ListProps {
  children?: React.ReactNode;
  childClassname?: string;
  className?: string;
  ordered: boolean;
  testId?: string;
  listStyle: Properties['listStyle'];
}

export function List({
  children,
  className,
  childClassname,
  testId,
  ordered,
  listStyle,
}: ListProps) {
  const ListComponent = ordered ? StyledOrderedList : StyledUnorderedList;

  return (
    <ListComponent
      listStyle={listStyle}
      className={className}
      data-testid={testId}
    >
      {React.Children.map(children, (child) => {
        return (
          <StyledListItem className={childClassname}>{child}</StyledListItem>
        );
      })}
    </ListComponent>
  );
}

List.defaultProps = {
  ordered: false,
};
