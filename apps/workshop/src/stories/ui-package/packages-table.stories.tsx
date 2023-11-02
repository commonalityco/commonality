import type { Meta, StoryObj } from '@storybook/react';
import {
  CodeownersCell,
  ColumnData,
  DocumentsCell,
  NameCell,
  PackageTableColumns,
  PackagesTable,
  SortableHeader,
  TagsCell,
} from '@commonalityco/ui-package';
import { PackageType } from '@commonalityco/utils-core';
import { Package } from '@commonalityco/types';

const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <SortableHeader column={column} title="Name" />;
    },
    size: 300,
    cell: NameCell,
  },
  {
    accessorKey: 'documents',
    header: 'Documents',
    cell: (props) => (
      <DocumentsCell {...props} onDocumentOpen={async () => {}} />
    ),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: (props) => <TagsCell {...props} onAddTags={async () => {}} />,
  },
  {
    accessorKey: 'codeowners',
    header: 'Codeowners',
    cell: CodeownersCell,
  },
] satisfies PackageTableColumns<Package>;

const meta = {
  title: 'ui-package/PackagesTable',
  component: PackagesTable,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    backgrounds: {
      default: 'light/secondary',
    },
  },
} satisfies Meta<typeof PackagesTable<ColumnData, unknown>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StressTest: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: columns as any,
    data: [
      {
        name: 'package-one',
        type: PackageType.NODE,
        version: '1.0.0',
        path: '/path',
        codeowners: [
          '@team1',
          '@team2',
          '@team3',
          '@team4',
          '@team5',
          '@team6',
          '@team7',
          '@team8',
          '@team9',
          '@team10',
        ],
        tags: [
          '#tag1',
          '#tag2',
          '#tag3',
          '#tag4',
          '#tag5',
          '#tag6',
          '#tag7',
          '#tag8',
          '#tag9',
          '#tag10',
        ],
        documents: [
          {
            filename: 'README',
            isRoot: true,
            content: 'content1',
            path: '/path/doc1',
          },
          {
            filename: 'CHANGELOG',
            isRoot: false,
            content: 'content2',
            path: '/path/doc2',
          },
          {
            filename: 'doc3',
            isRoot: false,
            content: 'content3',
            path: '/path/doc3',
          },
          {
            filename: 'doc4',
            isRoot: false,
            content: 'content4',
            path: '/path/doc4',
          },
          {
            filename: 'doc5',
            isRoot: false,
            content: 'content5',
            path: '/path/doc5',
          },
        ],
      },
      {
        name: 'package-two',
        type: PackageType.NODE,
        version: '1.0.0',
        path: '/path',
        codeowners: [
          '@team11',
          '@team12',
          '@team13',
          '@team14',
          '@team15',
          '@team16',
          '@team17',
          '@team18',
          '@team19',
          '@team20',
        ],
        tags: [
          '#tag11',
          '#tag12',
          '#tag13',
          '#tag14',
          '#tag15',
          '#tag16',
          '#tag17',
          '#tag18',
          '#tag19',
          '#tag20',
        ],
        documents: [
          {
            filename: 'README',
            isRoot: true,
            content: 'content6',
            path: '/path/doc6',
          },
          {
            filename: 'doc7',
            isRoot: false,
            content: 'content7',
            path: '/path/doc7',
          },
          {
            filename: 'doc8',
            isRoot: false,
            content: 'content8',
            path: '/path/doc8',
          },
          {
            filename: 'doc9',
            isRoot: false,
            content: 'content9',
            path: '/path/doc9',
          },
          {
            filename: 'doc10',
            isRoot: false,
            content: 'content10',
            path: '/path/doc10',
          },
        ],
      },
      {
        name: 'package-three',
        type: PackageType.NODE,
        version: '1.0.0',
        path: '/path',
        codeowners: [
          '@team21',
          '@team22',
          '@team23',
          '@team24',
          '@team25',
          '@team26',
          '@team27',
          '@team28',
          '@team29',
          '@team30',
        ],
        tags: [
          '#tag21',
          '#tag22',
          '#tag23',
          '#tag24',
          '#tag25',
          '#tag26',
          '#tag27',
          '#tag28',
          '#tag29',
          '#tag30',
        ],
        documents: [
          {
            filename: 'CHANGELOG',
            isRoot: false,
            content: 'content11',
            path: '/path/doc11',
          },
          {
            filename: 'doc12',
            isRoot: false,
            content: 'content12',
            path: '/path/doc12',
          },
          {
            filename: 'doc13',
            isRoot: false,
            content: 'content13',
            path: '/path/doc13',
          },
          {
            filename: 'doc14',
            isRoot: false,
            content: 'content14',
            path: '/path/doc14',
          },
          {
            filename: 'doc15',
            isRoot: false,
            content: 'content15',
            path: '/path/doc15',
          },
        ],
      },
    ] satisfies ColumnData[],
  },
};

export const EmptyMetadata: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: columns as any,
    data: [
      {
        name: 'package-one',
        type: PackageType.NODE,
        version: '1.0.0',
        path: '/path',
        codeowners: [],
        tags: [],
        documents: [],
      },
      {
        name: 'package-two',
        type: PackageType.NODE,
        version: '1.0.0',
        path: '/path',
        codeowners: [],
        tags: [],
        documents: [],
      },
    ] satisfies ColumnData[],
  },
};

export const Empty: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: columns as any,
    data: [] satisfies ColumnData[],
  },
};
