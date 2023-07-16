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

export const PrimaryDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
  args: {
    size: 'lg',
    variant: 'default',
    children: 'Click me',
  },
};

export const Sm: Story = {
  args: {
    size: 'sm',
    variant: 'secondary',
    children: 'Click me',
  },
};

export const Md: Story = {
  args: {
    size: 'md',
    variant: 'secondary',
    children: 'Click me',
  },
};

export const Lg: Story = {
  args: {
    size: 'lg',
    variant: 'secondary',
    children: 'Click me',
  },
};

export const Xl: Story = {
  args: {
    size: 'xl',
    variant: 'secondary',
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

export const SecondaryDark: Story = {
  args: {
    size: 'lg',
    variant: 'secondary',
    children: 'Click me',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

export const Ghost: Story = {
  args: {
    size: 'lg',
    variant: 'ghost',
    children: 'Click me',
  },
};

export const GhostDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
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
