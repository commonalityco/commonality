import type { Meta, StoryObj } from '@storybook/react';
import { PackagesTablePaginator } from '@commonalityco/ui-package';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'ui-package/PackagesTablePaginator',
  component: PackagesTablePaginator,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof PackagesTablePaginator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MiddlePage: Story = {
  args: {
    totalCount: 100,
    pageCount: 25,
    page: 2,
    onNext: () => {},
    onPrevious: () => {},
    onPageCountChange: () => {},
  },
};

export const FirstPage: Story = {
  args: {
    totalCount: 100,
    pageCount: 25,
    page: 1,
    onNext: () => {},
    onPrevious: () => {},
    onPageCountChange: () => {},
  },
};

export const LastPage: Story = {
  args: {
    totalCount: 100,
    pageCount: 25,
    page: 4,
    onNext: () => {},
    onPrevious: () => {},
    onPageCountChange: () => {},
  },
};
