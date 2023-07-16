import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    children: 'Hello Tag',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Rounded: Story = {
  args: {
    variant: 'rounded',
  },
};

export const Grey: Story = {
  args: {
    color: 'grey',
  },
};

export const GreyDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    color: 'grey',
    className: 'dark',
  },
};

export const Green: Story = {
  args: {
    color: 'green',
  },
};

export const GreenDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    color: 'green',
    className: 'dark',
  },
};

export const Red: Story = {
  args: {
    color: 'red',
  },
};

export const RedDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    color: 'red',
    className: 'dark',
  },
};
