import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from '@commonalityco/ui-core';
import { Button } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Features/Core/Navigation',
  component: Navigation,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args

export const Simple: Story = {
  args: {
    title: '@commonalityco/helloworld',
    links: [
      {
        label: 'Link one',
        href: '/link-one',
      },
      {
        label: 'Link two',
        href: '/link-two',
      },
      {
        label: 'Link three',
        href: '/link-three',
      },
      {
        label: 'Link four',
        href: '/link-four',
      },
    ],
    activeHref: '/link-one',
    children: <Button>Login</Button>,
  },
};
