import type { Meta, StoryObj } from '@storybook/react';
import { GraphChart } from '@commonalityco/ui-graph';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'ui-graph/GraphChart',
  component: GraphChart,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
  args: {
    onShowAllPackages: () => {},
  },
  decorators: [
    (Story) => (
      <div className="flex h-64 flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GraphChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { isEmpty: true },
};

export const Zero: Story = {
  args: { isEmpty: false },
};
