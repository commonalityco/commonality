import { GroupBase } from 'react-select';
import ReactAsyncCreateableSelect, {
  AsyncCreatableProps,
} from 'react-select/async-creatable';
import { getSelectStyles } from './selectStyles';

export function AsyncCreateableSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({ className, ...restProps }: AsyncCreatableProps<Option, IsMulti, Group>) {
  return (
    <ReactAsyncCreateableSelect
      {...restProps}
      styles={getSelectStyles(className) as any}
    />
  );
}
