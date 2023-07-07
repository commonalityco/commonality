import type { Meta, StoryObj } from '@storybook/react';
import { PackageSheet } from '@commonalityco/ui-graph';
import README from '../../../assets/README';
import {
  CodeownersData,
  DocumentsData,
  Package,
  TagsData,
} from '@commonalityco/types';
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
  dependencies: [{ name: 'react', version: '18', type: 'PRODUCTION' as any }],
  devDependencies: [],
  peerDependencies: [],
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
    codeowners: ['@team-one', '@team-two', '@team-three'],
  },
] satisfies CodeownersData[];

const tagsData = [
  {
    packageName: pkg.name,
    tags: ['tag-one', 'tag-two', 'tag-three'],
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
