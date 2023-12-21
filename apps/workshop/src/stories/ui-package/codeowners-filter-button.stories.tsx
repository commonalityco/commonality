import { Meta, StoryObj } from '@storybook/react';
import { CodeownersFilterButton } from '@commonalityco/ui-package';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'ui-package/CodeownersFilterButton',
  component: CodeownersFilterButton,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof CodeownersFilterButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    codeowners: ['@teamAlpha', '@teamBeta', '@teamGamma'],
  },
};

export const Empty: Story = {
  args: {
    codeowners: [],
  },
};
