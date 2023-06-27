import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    size: 'lg',
    variant: 'default',
    children: 'Click me',
  },
};

export const Secondary: Story = {
  args: {
    size: 'lg',
    variant: 'secondary',
    children: 'Click me',
  },
};

export const Outline: Story = {
  args: {
    size: 'lg',
    variant: 'outline',
    children: 'Click me',
  },
};

export const Ghost: Story = {
  args: {
    size: 'lg',
    variant: 'ghost',
    children: 'Click me',
  },
};

export const Destructive: Story = {
  args: {
    size: 'lg',
    variant: 'destructive',
    children: 'Click me',
  },
};

export const Link: Story = {
  args: {
    size: 'lg',
    variant: 'link',
    children: 'Click me',
  },
};
