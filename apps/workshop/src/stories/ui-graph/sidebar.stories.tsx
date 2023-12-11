import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from '@commonalityco/feature-constraints/components';
import type { Package } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'ui-graph/Sidebar',
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

const pkgOne = {
  path: `/path/to/package-one`,
  name: `@scope/one`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const pkgTwo = {
  path: `/path/to/package-two`,
  name: `@scope/two`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const pkgThree = {
  path: `/path/to/package-three`,
  name: `@scope/three`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const pkgFour = {
  path: `/path/to/package-four`,
  name: `@scope/four`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

const pkgFive = {
  path: `/path/to/package-five-looooooooooooooonnnnnngggggggg`,
  name: `@scope/five-looooooooooooooonnnnnngggggggg`,
  version: '1.0.0',
  type: PackageType.NODE,
} satisfies Package;

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

export const ZeroPackages: Story = {
  args: {
    initialSearch: 'tag',
    visiblePackages: [],
    packages: [],
    tagsData: [],
    codeownersData: [],
  },
};

export const ZeroTags: Story = {
  args: {
    initialSearch: '@scope',
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

export const ZeroCodeowners: Story = {
  args: {
    initialSearch: 'tag',
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
        packageName: '@owner/one',
        codeowners: [],
      },
      {
        packageName: '@owner/two',
        codeowners: [],
      },
      {
        packageName: '@owner/three',
        codeowners: [],
      },
      {
        packageName: '@owner/four',
        codeowners: [],
      },
      {
        packageName: '@owner/five',
        codeowners: [],
      },
    ],
  },
};

export const ZeroItems: Story = {
  args: {
    initialSearch: 'zzzzzz',
    visiblePackages: [],
    packages: [],
    tagsData: [],
    codeownersData: [],
  },
};

export const EmptyPackages: Story = {
  args: {
    visiblePackages: [],
    packages: [],
    tagsData: [],
    codeownersData: [],
  },
};

export const EmptyTags: Story = {
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

export const EmptyCodeowners: Story = {
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
        packageName: '@owner/one',
        codeowners: [],
      },
      {
        packageName: '@owner/two',
        codeowners: [],
      },
      {
        packageName: '@owner/three',
        codeowners: [],
      },
      {
        packageName: '@owner/four',
        codeowners: [],
      },
      {
        packageName: '@owner/five',
        codeowners: [],
      },
    ],
  },
};

export const EmptyItems: Story = {
  args: {
    visiblePackages: [],
    packages: [],
    tagsData: [],
    codeownersData: [],
  },
};
