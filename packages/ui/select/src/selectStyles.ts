import clsx from 'clsx';
import { ClassNamesConfig } from 'react-select';

export const getSelectStyles = (
  className?: string
): ClassNamesConfig<unknown> => ({
  placeholder: () => '!text-sm dark:!text-zinc-600 antialiased',
  control: (state) => {
    return clsx(
      '!cursor-pointer rounded !bg-white dark:!bg-zinc-900 !shadow-none !min-h-0 !h-9 !border-zinc-300 dark:!border-zinc-600 hover:!border-zinc-400 dark:hover:!border-zinc-500',

      className,
      {
        '!border-zinc-500 dark:!border-zinc-400': state.isFocused,
        '!border-zinc-300 dark:!border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500':
          !state.isFocused,
      }
    );
  },
  noOptionsMessage: () => 'text-sm text-zinc-800 dark:text-white antialiased',
  valueContainer: () => '!h-full antialiased',
  indicatorsContainer: () => '!h-full',
  input: () =>
    '!py-0 !text-ellipsis !text-zinc-800 dark:!text-white !antialiased !text-sm',
  singleValue: (state) =>
    clsx('!py-0 !text-ellipsis !antialiased !text-sm', {
      '!text-zinc-400 dark:!text-zinc-500': state.isDisabled,
      '!text-zinc-800 dark:!text-white': !state.isDisabled,
    }),
  indicatorSeparator: () => '!display-none',
  menu: () =>
    '!absolute !bg-white dark:!bg-zinc-900 rounded !border !border-solid !border-zinc-300 dark:!border-zinc-600 !p-2 !shadow-xl !font-sans',
  menuList: () => '!py-0 !flex !flex-col gap-1',
  option: (state) => {
    return clsx(
      '!truncate !text-sm !rounded !flex !align-center !h-9 !py-2 !px-3 !relative !font-regular !select-none !cursor-pointer !outline-none !antialiased',
      {
        '!text-zinc-800 dark:!text-white hover:!bg-zinc-100 dark:hover:!bg-zinc-700':
          !state.isFocused && !state.isSelected && !state.isDisabled,
        '!bg-sky-600 !text-white': state.isSelected,
        '!bg-zinc-100 dark:!bg-zinc-800 dark:!text-white active:!bg-zinc-200 active:dark:!bg-zinc-700':
          state.isFocused && !state.isSelected,
        '': state.isDisabled,
      }
    );
  },
});

export const getSearchableSelectStyles = (
  className?: string
): ClassNamesConfig<unknown> => ({
  container: () => '!p-2',
  placeholder: () => '!text-sm !text-zinc-500 dark:!text-zinc-500 antialiased',
  control: (state) => {
    return clsx(
      'mb-2 h-9 antialiased text-sm appearance-none rounded font-sans cursor-text w-full border border-solid outline-none border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 text-ellipsis align-middle text-zinc-800 dark:text-white placeholder:text-zinc-400 !antialiased !bg-zinc-50 dark:!bg-zinc-800',

      className,
      {
        '!border-sky-600 dark:!border-sky-400 !shadow-[0_0_0_3px_black] !shadow-sky-300/50 dark:!shadow-sky-700/[0.5]':
          state.isFocused,
        '!border-zinc-300 dark:!border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500':
          !state.isFocused,
      }
    );
  },
  noOptionsMessage: () => 'text-sm text-zinc-800 dark:text-white antialiased',
  valueContainer: () => '!h-full antialiased',
  indicatorsContainer: () => '!h-full mr-1',
  input: () =>
    '!py-0 !text-ellipsis !text-zinc-800 dark:!text-white !antialiased !text-sm !font-sans',
  singleValue: (state) =>
    clsx(
      '!py-0 !text-ellipsis !text-zinc-800 dark:!text-white !antialiased !text-sm !font-sans',
      {
        '!text-zinc-400 dark:!text-zinc-500': state.isDisabled,
        '!text-zinc-800 dark:!text-white': !state.isDisabled,
      }
    ),
  indicatorSeparator: () => '!display-none',
  menu: () => '!bg-transparent !my-0 !shadow-none !relative',
  menuList: () => '!py-0 !flex !flex-col gap-1',
  option: (state) => {
    return clsx(
      '!text-sm !rounded !flex !align-center !h-9 !py-2 !px-3 !relative !font-regular !select-none !cursor-pointer !outline-none !antialiased',
      {
        '!text-zinc-800 dark:!text-white hover:!bg-zinc-100 dark:hover:!bg-zinc-800':
          !state.isFocused && !state.isSelected && !state.isDisabled,
        '!bg-transparent !text-white hover:!bg-zinc-100 dark:hover:!bg-zinc-800':
          state.isSelected,
        '!bg-zinc-100 dark:!bg-zinc-800 dark:!text-white active:!bg-zinc-200 active:dark:!bg-zinc-800':
          state.isFocused,
        '': state.isDisabled,
      }
    );
  },
});
