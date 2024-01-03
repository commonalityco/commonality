import { Meta, StoryObj } from '@storybook/react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@commonalityco/ui-design-system';
import { Button } from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <Story />
        </Tooltip>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Hello',
  },
};

export const Open: Story = {
  args: {
    children: 'Hello',
  },
};
