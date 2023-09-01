import type { Meta, StoryObj } from '@storybook/react';
import { TableHeadSortButton } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/TableHeadSortButton',
  component: TableHeadSortButton,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof TableHeadSortButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const NoSort: Story = {
  args: {
    children: 'Name',
    sort: false,
  },
};

export const Asc: Story = {
  args: {
    children: 'Name',
    sort: 'asc',
  },
};

export const Desc: Story = {
  args: {
    children: 'Name',
    sort: 'desc',
  },
};
