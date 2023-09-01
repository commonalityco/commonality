import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from '@commonalityco/ui-core';
import README from '../../../assets/README';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Features/Core/Markdown',
  component: Markdown,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args

export const Simple: Story = {
  args: {
    children: README,
  },
};
