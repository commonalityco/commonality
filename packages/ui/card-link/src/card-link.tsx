import { Root, RootProps } from './root';
import { Content } from './content';

export interface CardProps extends RootProps {}

export function CardLink({ children, ...props }: RootProps) {
  return (
    <Root {...props}>
      <Content>{children}</Content>
    </Root>
  );
}

CardLink.defaultProps = {
  className: '',
  use: 'primary',
};
