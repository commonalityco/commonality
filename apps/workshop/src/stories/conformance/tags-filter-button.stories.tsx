import { Meta, StoryObj } from '@storybook/react';
import { TagsFilterButton } from '@commonalityco/ui-package';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Conformance/TagsFilterButton',
  component: TagsFilterButton,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof TagsFilterButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    tags: ['#one', '#two', '#three'],
  },
};

export const Empty: Story = {
  args: {
    tags: [],
  },
};
