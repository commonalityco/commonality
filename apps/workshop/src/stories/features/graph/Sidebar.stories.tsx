import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '@commonalityco/ui-graph';
import type { Package } from '@commonalityco/types';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Features/Graph/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (Story) => (
      <div style={{ height: '900px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args

const pkgOne = {
  path: `/path/to/package-one`,
  name: `@scope/one`,
  version: '1.0.0',
  dependencies: [
    {
      name: '@scope/two',
      version: '1.0.0',
      type: 'PRODUCTION' as any,
    },
    {
      name: '@scope/three',
      version: '1.0.0',
      type: 'DEVELOPMENT' as any,
    },
  ],
  tags: ['tag-one', 'tag-two'],
  owners: ['@team-one', '@team-two'],
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const pkgTwo = {
  path: `/path/to/package-two`,
  name: `@scope/two`,
  version: '1.0.0',
  tags: ['tag-three'],
  owners: ['@team-three'],
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
};

const pkgThree = {
  path: `/path/to/package-three`,
  name: `@scope/three`,
  version: '1.0.0',
  tags: ['tag-three'],
  owners: ['@team-three'],
  dependencies: [
    {
      name: '@scope/four',
      version: '1.0.0',
      type: 'PRODUCTION' as any,
    },
  ],
  devDependencies: [],
  peerDependencies: [],
};

const pkgFour = {
  path: `/path/to/package-four`,
  name: `@scope/four`,
  version: '1.0.0',
  tags: ['tag-four'],
  owners: ['@team-four'],
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
};

const pkgFive = {
  path: `/path/to/package-five-looooooooooooooonnnnnngggggggg`,
  name: `@scope/five-looooooooooooooonnnnnngggggggg`,
  version: '1.0.0',
  tags: ['tag-five'],
  owners: ['@team-five'],
  dependencies: [
    {
      name: '@scope/four',
      version: '1.0.0',
      type: 'PEER' as any,
    },
  ],
  devDependencies: [],
  peerDependencies: [],
};

export const KitchenSink: Story = {
  args: {
    visiblePackages: [pkgOne, pkgTwo, pkgThree],
    packages: [pkgOne, pkgTwo, pkgThree, pkgFour, pkgFive],
    tags: [
      'tag-one',
      'tag-two',
      'tag-three',
      'tag-four',
      'tag-five',
      'tag-loooooooooooonnnnnnnnnnnnnngggggggggggg',
    ],
    teams: [
      '@team-one',
      '@team-two',
      '@team-three',
      '@team-four',
      '@team-five',
      '@team-looooooooooooooooonnnnnnnnnnnnnnnnnngggggggggggg',
    ],
  },
};

export const NoPackages: Story = {
  args: {
    visiblePackages: [],
    packages: [],
    tags: ['tag-one', 'tag-two', 'tag-three', 'tag-four', 'tag-five'],
    teams: [
      '@team-one',
      '@team-two',
      '@team-three',
      '@team-four',
      '@team-five',
    ],
  },
};

export const NoTags: Story = {
  args: {
    visiblePackages: [pkgOne, pkgTwo, pkgThree],
    packages: [pkgOne, pkgTwo, pkgThree, pkgFour, pkgFive],
    tags: [],
    teams: [
      '@team-one',
      '@team-two',
      '@team-three',
      '@team-four',
      '@team-five',
    ],
  },
};

export const NoTeams: Story = {
  args: {
    visiblePackages: [pkgOne, pkgTwo, pkgThree],
    packages: [pkgOne, pkgTwo, pkgThree, pkgFour, pkgFive],
    tags: ['tag-one', 'tag-two', 'tag-three', 'tag-four', 'tag-five'],
    teams: [],
  },
};

export const NoItems: Story = {
  args: {
    visiblePackages: [],
    packages: [],
    tags: [],
    teams: [],
  },
};
