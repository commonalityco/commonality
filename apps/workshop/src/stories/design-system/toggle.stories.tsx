import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    children: 'This is some text.',
  },
};
