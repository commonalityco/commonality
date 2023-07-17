import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
} from '@commonalityco/ui-design-system';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Design System/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    className: 'max-',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    menuIsOpen: true,
    defaultValue: { value: 'chocolate', label: 'Chocolate' },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      {
        value: 'vanilla',
        label:
          'Vanillaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ],
  },
};

export const DefaultDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
  args: {
    className: 'dark',
    menuIsOpen: true,
    defaultValue: { value: 'chocolate', label: 'Chocolate' },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      {
        value: 'vanilla',
        label:
          'Vanillaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ],
  },
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const PopoverMode: Story = {
  decorators: [
    (Story) => (
      <Popover open>
        <PopoverTrigger asChild>
          <Button>Click me</Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Story />
        </PopoverContent>
      </Popover>
    ),
  ],
  args: {
    autoFocus: true,
    menuIsOpen: true,
    backspaceRemovesValue: false,
    controlShouldRenderValue: false,
    hideSelectedOptions: false,
    closeMenuOnSelect: false,
    isClearable: false,
    variant: 'inline',
    defaultValue: { value: 'chocolate', label: 'Chocolate' },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      {
        value: 'vanilla',
        label:
          'Vanillaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ],
  },
};

export const PopoverModeMulti: Story = {
  decorators: [
    (Story) => (
      <Popover open>
        <PopoverTrigger asChild>
          <Button>Click me</Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Story />
        </PopoverContent>
      </Popover>
    ),
  ],
  args: {
    isMulti: true,
    autoFocus: true,
    menuIsOpen: true,
    backspaceRemovesValue: false,
    controlShouldRenderValue: false,
    hideSelectedOptions: false,
    closeMenuOnSelect: false,
    isClearable: false,
    variant: 'inline',
    defaultValue: { value: 'chocolate', label: 'Chocolate' },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      {
        value: 'vanilla',
        label:
          'Vanillaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ],
  },
};

export const PopoverModeDark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Popover>
          <PopoverTrigger asChild>
            <Button>Click me</Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Story />
          </PopoverContent>
        </Popover>
      </div>
    ),
  ],
  args: {
    className: 'dark',
    autoFocus: true,
    menuIsOpen: true,
    backspaceRemovesValue: false,
    closeMenuOnSelect: false,
    controlShouldRenderValue: false,
    hideSelectedOptions: false,
    isClearable: false,
    variant: 'inline',
    defaultValue: { value: 'chocolate', label: 'Chocolate' },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      {
        value: 'vanilla',
        label:
          'Vanillaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ],
  },
};

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const SynchronousGhost: Story = {
  args: {
    variant: 'ghost',
    menuIsOpen: true,
    defaultValue: { value: 'chocolate', label: 'Chocolate' },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      {
        value: 'vanilla',
        label:
          'Vanillaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      },
    ],
  },
};

export const SynchronousMulti: Story = {
  args: {
    menuIsOpen: true,
    isMulti: true,
    defaultValue: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
    ],
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ],
  },
};
