import { Meta, StoryObj } from '@storybook/react';
import { ConformanceResults } from '@commonalityco/ui-conformance';
import { PackageType, Status } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Conformance/ConformanceResults',
  component: ConformanceResults,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
  decorators: [
    (Story, props) => {
      return (
        <div style={{ width: '300px' }}>
          <Story {...props} />
        </div>
      );
    },
  ],
} satisfies Meta<typeof ConformanceResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KitchenSink: Story = {
  args: {
    results: [
      {
        status: Status.Pass,
        id: 'test-one',
        filter: 'filter-one',
        package: {
          name: 'package-one',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          message: 'test-one',
          path: 'package.json',
          suggestion: 'package.json',
        },
      },
      {
        status: Status.Warn,
        id: 'test-one',
        filter: 'filter-two',
        package: {
          name: 'package-three',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          message: 'test-one',
          path: 'package.json',
          suggestion: 'package.json',
        },
      },
      {
        status: Status.Pass,
        id: 'test-one-two',
        filter: 'filter-two',
        package: {
          name: 'package-three',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          message:
            'test-oneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          path: 'package.jsonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
          suggestion:
            'const foo = "fehfwiuheiufhwihuehufwiuhefwuiehfiuhweiufweiuhfwuhefhwiuhefhwiuehfiwuheifhuwihefiuwheihfwieuhfiwuhefihwiehufiwhehfwiheifhwiuehfiwuhefihuweifuhhiwhefiwuh"',
        },
      },
      {
        status: Status.Fail,
        id: 'test-one',
        filter: 'filter-one',
        package: {
          name: 'package-two',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          message: 'test-one',
          path: 'package.json',
          suggestion: 'package.json',
        },
      },
      {
        status: Status.Pass,
        id: 'test-one/testone',
        filter: 'filter-one',
        package: {
          name: 'package-two',
          version: '1.0.0',
          path: '/path/to/package-one',
          type: PackageType.NODE,
        },
        message: {
          message: 'test-one',
        },
      },
    ],
  },
};

export const NoConstraints: Story = {
  args: {
    results: [],
  },
};
