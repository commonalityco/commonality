import { GroupBase } from 'react-select';
import ReactCreateableSelect, { CreatableProps } from 'react-select/creatable';
import { getSelectStyles } from './selectStyles';

export function CreateableSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ className, ...restProps }: CreatableProps<Option, IsMulti, Group>) {
  return (
    <ReactCreateableSelect
      {...restProps}
      styles={getSelectStyles(className) as any}
    />
  );
}
