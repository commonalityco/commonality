import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    className: 'max-',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const SynchronousDefault: Story = {
  args: {
    menuIsOpen: true,
    defaultValue: { value: 'chocolate', label: 'Chocolate' },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      {
        value: 'vanilla',
        label:
          'Vanillaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ],
  },
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const SynchronousGhost: Story = {
  args: {
    variant: 'ghost',
    menuIsOpen: true,
    defaultValue: { value: 'chocolate', label: 'Chocolate' },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      {
        value: 'vanilla',
        label:
          'Vanillaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ],
  },
};

export const SynchronousMulti: Story = {
  args: {
    menuIsOpen: true,
    isMulti: true,
    defaultValue: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
    ],
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ],
  },
};
