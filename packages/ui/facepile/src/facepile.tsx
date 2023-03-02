import { Tooltip } from '@commonalityco/ui-tooltip';
import { Avatar, AvatarProps } from '@commonalityco/ui-avatar';
import { FacepileContainer, AvatarContainer } from './facepile.styles';

export interface FacepileProps extends AvatarProps {
  options: Array<{ src?: string; alt?: string; title?: string }>;
  max: number;
}

export function Facepile({ options, max, ...restProps }: FacepileProps) {
  const displayedOptions = options.slice(0, max);

  return (
    <FacepileContainer>
      {displayedOptions.map((option, index) => {
        return (
          <AvatarContainer key={index}>
            <Tooltip text={option.title} placement="top">
              <Avatar {...restProps} src={option.src || ''} alt={option.alt} />
            </Tooltip>
          </AvatarContainer>
        );
      })}
    </FacepileContainer>
  );
}

Facepile.defaultProps = {
  max: 5,
  options: [],
};
