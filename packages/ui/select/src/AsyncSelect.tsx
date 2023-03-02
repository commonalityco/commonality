import { GroupBase } from 'react-select';
import ReactSelectAsync, { AsyncProps } from 'react-select/async';
import { getSelectStyles } from './selectStyles';

export function AsyncSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ className, ...restProps }: AsyncProps<Option, IsMulti, Group>) {
  return (
    <ReactSelectAsync
      {...restProps}
      styles={getSelectStyles(className) as any}
    />
  );
}
