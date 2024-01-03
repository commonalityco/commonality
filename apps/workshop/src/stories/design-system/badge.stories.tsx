import { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    children: 'Hello Badge',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
};

export const DefaultDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    className: 'dark',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const SecondaryDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    variant: 'secondary',
    className: 'dark',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

export const DestructiveDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    variant: 'destructive',
    className: 'dark',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
  },
};

export const SuccessDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    variant: 'success',
    className: 'dark',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const OutlineDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    variant: 'outline',
    className: 'dark',
  },
};
