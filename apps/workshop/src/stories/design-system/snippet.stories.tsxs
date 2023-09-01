import type { Meta, StoryObj } from '@storybook/react';
import { Snippet } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Snippet',
  component: Snippet,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Snippet>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'pnpx commonality init',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'pnpx commonality init',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'pnpx commonality init',
  },
};
