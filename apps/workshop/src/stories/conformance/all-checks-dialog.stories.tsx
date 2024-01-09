import { Meta, StoryObj } from '@storybook/react';
import { AllChecksDialog } from '@commonalityco/ui-conformance';
import { PackageType, Status } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Conformance/AllChecksDialog',
  component: AllChecksDialog,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const KitchenSink: Story = {
  args: {
    open: true,
    results: [
      {
        status: Status.Pass,
        name: 'test-one',
        filter: 'filter-one',
        package: {
          name: 'package-one',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          title: 'test-one',
          filePath: 'package.json',
          suggestion: 'package.json',
        },
      },
      {
        status: Status.Warn,
        name: 'test-one',
        filter: 'filter-two',
        package: {
          name: 'package-three',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          title: 'test-one',
          filePath: 'package.json',
          suggestion: 'package.json',
        },
      },
      {
        status: Status.Pass,
        name: 'test-one-two',
        filter: 'filter-two',
        package: {
          name: 'package-three',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          title:
            'test-oneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          filePath:
            'package.jsonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
          suggestion:
            'const foo = "fehfwiuheiufhwihuehufwiuhefwuiehfiuhweiufweiuhfwuhefhwiuhefhwiuehfiwuheifhuwihefiuwheihfwieuhfiwuhefihwiehufiwhehfwiheifhwiuehfiwuhefihuweifuhhiwhefiwuh"',
        },
      },
      {
        status: Status.Fail,
        name: 'test-one',
        filter: 'filter-one',
        package: {
          name: 'package-two',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          title: 'test-one',
          filePath: 'package.json',
          suggestion: 'package.json',
        },
      },
      {
        status: Status.Pass,
        name: 'test-one/testone',
        filter: 'filter-one',
        package: {
          name: 'package-two',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          title: 'test-one',
        },
      },
    ],
  },
};

export const NoConstraints: Story = {
  args: {
    open: true,
    results: [],
  },
};
