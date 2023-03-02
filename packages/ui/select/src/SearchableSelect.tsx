import { Icon } from '@commonalityco/ui-icon';
import ReactSelect, { GroupBase, Props } from 'react-select';
import { getSearchableSelectStyles } from './selectStyles';
import { Checkbox } from '@commonalityco/ui-checkbox';
import {
  faCheck,
  faChevronDown,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

export function SearchableSelectLabel({
  isSelected,
  children,
  className,
}: {
  isSelected: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'w-full flex gap-2 justify-between items-center',
        className
      )}
    >
      <div className="truncate text-zinc-800 dark:text-white antialiased">
        {children}
      </div>
      <Checkbox checked={isSelected} />
    </div>
  );
}

export function SearchableSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ className, ...restProps }: Props<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      {...restProps}
      classNames={getSearchableSelectStyles(className) as any}
      autoFocus={true}
      backspaceRemovesValue={false}
      controlShouldRenderValue={false}
      hideSelectedOptions={false}
      isClearable={false}
      tabSelectsValue={false}
      menuIsOpen={true}
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: () => (
          <div className="h-[34px] w-[34px] flex items-center justify-center">
            <Icon icon={faSearch} />
          </div>
        ),
      }}
    />
  );
}
