'use client';
import ReactSelect, {
  ClearIndicatorProps,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  InputProps,
  MenuListProps,
  MultiValueProps,
  OptionProps,
  Props,
  ValueContainerProps,
} from 'react-select';
import { ChevronDown, X } from 'lucide-react';
import { CSSProperties } from 'react';
import { cn } from '../utils/cn';
import Creatable, {
  useCreatable,
  CreatableProps,
} from 'react-select/creatable';
import { cva, VariantProps } from 'class-variance-authority';

const controlStyles = cva(
  '!flex !min-h-[40px] !w-full !items-center !justify-between !rounded-md !border !text-sm',
  {
    variants: {
      variant: {
        default: '!border-input !bg-transparent',
        ghost: '!border-none !bg-transparent',
      },
      isFocused: {
        true: '!bg-accent !text-accent-foreground',
        false: '!ring-offset-background',
      },
      isDisabled: { true: '!disabled:cursor-not-allowed !disabled:opacity-50' },
    },
  }
);

function getClassNames<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  className?: string,
  variant: 'default' | 'ghost' | null | undefined = 'default'
) {
  return {
    multiValue: () =>
      '!bg-secondary !text-foreground !rounded-sm !font-regular',
    placeholder: () => '!text-muted-foreground',
    valueContainer: (props: ValueContainerProps<Option, IsMulti, Group>) => {
      return cn('!p-2 !m-0');
    },
    multiValueRemove: (state: MultiValueProps<Option, IsMulti, Group>) => {
      return '!bg-transparent !text-muted-foreground transition hover:!bg-secondary-background hover:!text-foreground !rounded-sm !px-1';
    },
    indicatorsContainer: () => '!pr-3',
    multiValueLabel: () =>
      '!rounded-sm !text-foreground !text-sm !py-1 !pl-2 !pr-1',
    input: (props: InputProps<Option, IsMulti, Group>) => {
      if (props.isMulti) {
        return '!pr-0 !pl-1 !m-0';
      }

      return '!px-0 !m-0';
    },
    menu: () => {
      return '!animate-in !fade-in-80 !rounded-md !bg-popover !shadow-md !border !overflow-hidden !min-w-[8rem] !z-50 !text-popover-foreground';
    },
    noOptionsMessage: () => '!text-muted-foreground !text-sm',
    menuList: (state: MenuListProps<Option, IsMulti, Group>) => {
      return cn('!relative !p-1 !flex !flex-col !gap-1');
    },
    option: (state: OptionProps<Option, IsMulti, Group>) => {
      return cn(
        '!relative !block !truncate !w-full !cursor-pointer !select-none !items-center !rounded-sm !py-1.5 !px-3 !text-sm !outline-none !font-sans',
        {
          '!bg-accent !text-accent-foreground': state.isFocused,
          '!pointer-events-none !opacity-50': state.isDisabled,
          '!bg-secondary !text-foreground': state.isSelected,
        }
      );
    },
    control: (state: ControlProps<Option, IsMulti, Group>) => {
      return cn(
        controlStyles({
          isDisabled: state.isDisabled,
          isFocused: state.isFocused,
          variant,
        }),
        className
      );
    },
  } as const;
}

function getComponents<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>() {
  return {
    IndicatorSeparator: () => null,
    ClearIndicator: (props: ClearIndicatorProps<Option, IsMulti, Group>) => {
      const {
        getStyles,
        innerProps: { ref, ...restInnerProps },
      } = props;

      return (
        <div
          {...restInnerProps}
          ref={ref}
          style={getStyles('clearIndicator', props) as CSSProperties}
        >
          <X className="h-4 w-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
        </div>
      );
    },
    DropdownIndicator: (
      props: DropdownIndicatorProps<Option, IsMulti, Group>
    ) => {
      const {
        getStyles,
        innerProps: { ref, ...restInnerProps },
      } = props;

      return (
        <div
          style={getStyles('dropdownIndicator', props) as CSSProperties}
          {...restInnerProps}
          ref={ref}
        >
          <ChevronDown className="h-4 w-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
        </div>
      );
    },
  };
}

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  className,
  variant,
  ...restProps
}: Props<Option, IsMulti, Group> & VariantProps<typeof controlStyles>) {
  return (
    <ReactSelect
      {...restProps}
      classNames={getClassNames<Option, IsMulti, Group>(className, variant)}
      components={getComponents<Option, IsMulti, Group>()}
    />
  );
}

export function CreatebleSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  className,
  variant,
  ...restProps
}: CreatableProps<Option, IsMulti, Group> &
  VariantProps<typeof controlStyles>) {
  return (
    <Creatable
      {...restProps}
      classNames={getClassNames<Option, IsMulti, Group>(className, variant)}
      components={getComponents<Option, IsMulti, Group>()}
    />
  );
}
