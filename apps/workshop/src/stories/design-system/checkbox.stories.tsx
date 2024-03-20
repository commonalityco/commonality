import { Meta, StoryObj } from '@storybook/react';
import { Checkbox, Label } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    id: 'foo',
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-2">
        <Story />
        <Label htmlFor="foo">Hello</Label>
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {},
};
