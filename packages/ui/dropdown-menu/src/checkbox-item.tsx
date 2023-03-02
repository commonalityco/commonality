'use client';
import { CheckboxItem as RadixCheckboxItem } from '@radix-ui/react-dropdown-menu';
import { itemClassname } from './itemClassname';

export const CheckboxItem = () => {
  return <RadixCheckboxItem className={itemClassname} />;
};
