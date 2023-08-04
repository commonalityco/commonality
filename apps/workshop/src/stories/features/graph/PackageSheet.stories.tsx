import type { Meta, StoryObj } from '@storybook/react';
import { PackageSheet } from '@commonalityco/ui-graph';
import README from '../../../assets/README';
import {
  CodeownersData,
  DocumentsData,
  Package,
  TagsData,
} from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';
// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: 'Features/Graph/PackageSheet',
  component: PackageSheet,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof PackageSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const pkg = {
  name: '@scope/test',
  version: '1.0.0',
  description: 'This is a loooooooonnnnnnnnggggggg description.',
  path: './scope/test',
  type: PackageType.NODE,
} satisfies Package;

const documentsData = [
  {
    packageName: pkg.name,
    documents: [
      { filename: 'README', isReadme: true, isRoot: false, content: README },
    ],
  },
] satisfies DocumentsData[];

const codeownersData = [
  {
    packageName: pkg.name,
    codeowners: [
      '@team-one',
      '@team-two',
      '@team-three',
      '@team-four',
      '@team-five',
      '@team-six',
      '@team-seven',
      '@team-eight',
      '@team-nine',
    ],
  },
] satisfies CodeownersData[];

const tagsData = [
  {
    packageName: pkg.name,
    tags: [
      'tag-one',
      'tag-two',
      'tag-three',
      'tag-four',
      'tag-five',
      'tag-six',
      'tag-seven',
      'tag-eight',
      'tag-nine',
    ],
  },
] satisfies TagsData[];

export const KitchenSink: Story = {
  args: {
    pkg,
    tagsData,
    codeownersData,
    documentsData,
  },
};

export const NoTags: Story = {
  args: {
    pkg,
    tagsData: [],
    codeownersData,
    documentsData,
  },
};

export const NoOwners: Story = {
  args: {
    pkg,
    tagsData,
    codeownersData: [],
    documentsData,
  },
};

export const NoDocs: Story = {
  args: {
    pkg,
    tagsData,
    codeownersData,
    documentsData: [],
  },
};

export const AllEmpty: Story = {
  args: {
    pkg,
    tagsData: [],
    codeownersData: [],
    documentsData: [],
  },
};
