import { Root, RootProps } from './Root';
import { Content } from './Content';

export interface CardProps extends RootProps {}

export function Card({ children, ...props }: RootProps) {
  return (
    <Root {...props}>
      <Content>{children}</Content>
    </Root>
  );
}

Card.defaultProps = {
  className: '',
  use: 'primary',
};
