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
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const pkgTwo = {
  path: `/path/to/package-two`,
  name: `@scope/two`,
  version: '1.0.0',
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const pkgThree = {
  path: `/path/to/package-three`,
  name: `@scope/three`,
  version: '1.0.0',
  dependencies: [
    {
      name: '@scope/four',
      version: '1.0.0',
      type: 'PRODUCTION' as any,
    },
  ],
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

const pkgFour = {
  path: `/path/to/package-four`,
  name: `@scope/four`,
  version: '1.0.0',
  dependencies: [],
  devDependencies: [],
  peerDependencies: [],
} satisfies Package;

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
    tagsData: [
      { packageName: '@scope/one', tags: ['tag-one', 'tag-two'] },
      { packageName: '@scope/two', tags: ['tag-three'] },
      { packageName: '@scope/three', tags: ['tag-four'] },
      { packageName: '@scope/four', tags: ['tag-five'] },
      {
        packageName: '@scope/five',
        tags: [
          'tag-sixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        ],
      },
    ],
    codeownersData: [
      {
        packageName: '@scope/one',
        codeowners: ['@team-one'],
      },
      {
        packageName: '@scope/two',
        codeowners: ['@team-two'],
      },
      {
        packageName: '@scope/three',
        codeowners: ['@team-three'],
      },
      {
        packageName: '@scope/four',
        codeowners: ['@team-four'],
      },
      {
        packageName: '@scope/five',
        codeowners: [
          '@team-fiveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        ],
      },
    ],
  },
};

export const NoPackages: Story = {
  args: {
    visiblePackages: [],
    packages: [],
    tagsData: [],
    codeownersData: [],
  },
};

export const NoTags: Story = {
  args: {
    visiblePackages: [pkgOne, pkgTwo, pkgThree],
    packages: [pkgOne, pkgTwo, pkgThree, pkgFour, pkgFive],
    tagsData: [],
    codeownersData: [
      {
        packageName: '@scope/one',
        codeowners: ['@team-one'],
      },
      {
        packageName: '@scope/two',
        codeowners: ['@team-two'],
      },
      {
        packageName: '@scope/three',
        codeowners: ['@team-three'],
      },
      {
        packageName: '@scope/four',
        codeowners: ['@team-four'],
      },
      {
        packageName: '@scope/five',
        codeowners: ['@team-five'],
      },
    ],
  },
};

export const NoTeams: Story = {
  args: {
    visiblePackages: [pkgOne, pkgTwo, pkgThree],
    packages: [pkgOne, pkgTwo, pkgThree, pkgFour, pkgFive],
    tagsData: [
      { packageName: '@scope/one', tags: ['tag-one', 'tag-two'] },
      { packageName: '@scope/two', tags: ['tag-three'] },
      { packageName: '@scope/three', tags: ['tag-four'] },
      { packageName: '@scope/four', tags: ['tag-five'] },
      { packageName: '@scope/five', tags: ['tag-six'] },
    ],
    codeownersData: [
      {
        packageName: '@scope/one',
        codeowners: [],
      },
      {
        packageName: '@scope/two',
        codeowners: [],
      },
      {
        packageName: '@scope/three',
        codeowners: [],
      },
      {
        packageName: '@scope/four',
        codeowners: [],
      },
      {
        packageName: '@scope/five',
        codeowners: [],
      },
    ],
  },
};

export const NoItems: Story = {
  args: {
    visiblePackages: [],
    packages: [],
    tagsData: [],
    codeownersData: [],
  },
};
