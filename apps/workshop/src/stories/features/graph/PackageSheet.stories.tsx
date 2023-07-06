import type { Meta, StoryObj } from '@storybook/react';
import { PackageSheet } from '@commonalityco/ui-graph';
import README from '../../../assets/README';
import { Package } from '@commonalityco/types';
// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Features/Graph/PackageSheet',
  component: PackageSheet,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    open: true,
    tags: [
      {
        packageName: 'pkg-one',
        tags: ['tag-one'],
      },
      {
        packageName: 'pkg-two',
        tags: ['tag-two'],
      },
      {
        packageName: 'pkg-three',
        tags: ['tag-three'],
      },
      {
        packageName: 'pkg-four',
        tags: ['tag-four'],
      },
      {
        packageName: 'pkg-five',
        tags: ['tag-five'],
      },
    ],
  },
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof PackageSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const pkgData: Package = {
  name: '@scope/test',
  version: '1.0.0',
  description: 'This is a loooooooonnnnnnnnggggggg description.',
  path: './scope/test',
  tags: ['tag-one', 'tag-two', 'tag-three', 'tag-four', 'tag-five'],
  owners: ['owner-one', 'owner-two', 'owner-three'],
  dependencies: [{ name: 'react', version: '18', type: 'PRODUCTION' as any }],
  devDependencies: [],
  peerDependencies: [],
  docs: {
    readme: {
      filename: 'README',
      content: README,
    },
    pages: [],
  },
};

export const KitchenSink: Story = {
  args: {
    node: {
      data: () => pkgData,
    },
  },
};

export const NoTags: Story = {
  args: {
    node: {
      data: () => ({ ...pkgData, tags: [] }),
    },
  },
};

export const NoOwners: Story = {
  args: {
    node: {
      data: () => ({ ...pkgData, owners: [] }),
    },
  },
};

export const NoDocs: Story = {
  args: {
    node: {
      data: () => ({ ...pkgData, docs: { readme: undefined, pages: [] } }),
    },
  },
};

export const AllEmpty: Story = {
  args: {
    node: {
      data: () => ({
        ...pkgData,
        tags: [],
        owners: [],
        docs: { readme: undefined, pages: [] },
      }),
    },
  },
};
