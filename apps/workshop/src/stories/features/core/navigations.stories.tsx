import type { Meta, StoryObj } from '@storybook/react';
import { Divider, Navigation, NavigationLogo } from '@commonalityco/ui-core';

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
    children: (
      <>
        <div className="flex">
          <NavigationLogo />
          <Divider />
        </div>
      </>
    ),
  },
};
