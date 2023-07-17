'use client';
import ReactSelect, {
  ClearIndicatorProps,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  InputProps,
  MenuListProps,
  OptionProps,
  Props,
} from 'react-select';
import { ChevronDown, X } from 'lucide-react';
import { CSSProperties } from 'react';
import { cn } from '../utils/cn';
import Creatable, { CreatableProps } from 'react-select/creatable';
import { cva, VariantProps } from 'class-variance-authority';

const controlStyles = cva(
  '!flex !min-h-0 !w-full !items-center !justify-between !rounded-md !border !text-sm antialiased h-9',
  {
    variants: {
      variant: {
        default: '!border-input !bg-background',
        ghost: '!border-none !bg-transparent',
        inline:
          '!border-x-0 !border-t-0 !bg-background !border-b-border !rounded-none !shadow-none !rounded-t-md !px-0',
      },
      isFocused: {
        true: '!text-accent-foreground',
        false: '!ring-offset-background',
      },
      isDisabled: { true: '!disabled:cursor-not-allowed !disabled:opacity-50' },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function getClassNames<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(className?: string, variant?: VariantProps<typeof controlStyles>['variant']) {
  return {
    multiValue: () =>
      '!bg-secondary !text-foreground !rounded-sm !font-regular',
    placeholder: () => '!text-muted-foreground antialiased',
    valueContainer: () => {
      return cn('!m-0', {
        '!px-2 !py-0': variant !== 'inline',
        '!px-3 !py-0': variant === 'inline',
      });
    },
    multiValueRemove: () => {
      return '!bg-transparent !text-muted-foreground transition hover:!bg-secondary-background hover:!text-foreground !rounded-sm !px-1';
    },
    indicatorsContainer: () => {
      return cn('!pr-3', {
        '!hidden': variant === 'inline',
      });
    },
    multiValueLabel: () =>
      '!rounded-sm !text-foreground !text-sm !py-1 !pl-2 !pr-1',
    input: (props: InputProps<Option, IsMulti, Group>) => {
      return cn('!text-foreground antialiased', {
        '!p-0 !m-0': props.isMulti,
        '!px-0 !m-0': !props.isMulti,
      });
    },

    menu: () => {
      const isInline = variant === 'inline';

      return cn(
        {
          '!relative !m-0 !shadow-none': isInline,
          '!animate-in !fade-in-80 !bg-popover !shadow-md !border !z-50':
            !isInline,
        },
        '!overflow-hidden !min-w-[8rem] !text-popover-foreground !bg-background !rounded-md antialiased'
      );
    },
    noOptionsMessage: () => '!text-muted-foreground !text-sm antialiased !py-6',
    menuList: (state: MenuListProps<Option, IsMulti, Group>) => {
      return cn('!relative !p-1 !flex !flex-col !gap-1');
    },
    option: (state: OptionProps<Option, IsMulti, Group>) => {
      return cn(
        '!relative !block !truncate !w-full !cursor-pointer !select-none !items-center !rounded-sm !font-normal antialiased !py-1.5 !outline-none !font-sans !shrink-0',
        {
          '!bg-accent !text-accent-foreground': state.isFocused,
          '!pointer-events-none !opacity-50': state.isDisabled,
          '!bg-secondary !text-foreground': state.isSelected && !state.isMulti,
          '!pr-2 !pl-7 ': state.isMulti,
          '!bg-transparent hover:!bg-accent !text-foreground before:content-["•"] before:absolute before:my-auto before:left-2 before:!text-[24px] before:-translate-y-0.5':
            state.isMulti && state.isSelected,
          '!px-2': !state.isMulti,
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
          <X className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer transition-colors" />
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
          <ChevronDown className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer transition-colors" />
        </div>
      );
    },
  };
}

function Select<
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

function CreatebleSelect<
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

export { Select, CreatebleSelect };
