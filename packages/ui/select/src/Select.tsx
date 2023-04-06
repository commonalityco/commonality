import { Icon } from '@commonalityco/ui-icon';
import ReactSelect, { GroupBase, Props } from 'react-select';
import { getSelectStyles } from './selectStyles';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ className, ...restProps }: Props<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      {...restProps}
      classNames={getSelectStyles(className) as any}
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: (state) => {
          return (
            <div className="h-[34px] w-[34px] flex items-center justify-center">
              <Icon
                icon={faChevronDown}
                size="xs"
                className={clsx({
                  '!text-zinc-400 dark:!text-zinc-500': state.isDisabled,
                  '!text-zinc-800 dark:!text-white': !state.isDisabled,
                })}
              />
            </div>
          );
        },
      }}
    />
  );
}
