import { Meta, StoryObj } from '@storybook/react';
import {
  CodeownersCell,
  ColumnData,
  ConformanceCell,
  NameCell,
  PackageTableColumns,
  PackagesTable,
  SortableHeader,
  TagsCell,
} from '@commonalityco/ui-conformance';
import { PackageType, Status } from '@commonalityco/utils-core';
import { Package } from '@commonalityco/types';

const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <SortableHeader column={column} title="Name" />;
    },
    cell: NameCell,
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
  {
    accessorKey: 'results',
    header: 'Conformance',
    cell: ConformanceCell,
  },
] satisfies PackageTableColumns<Package>;

const meta = {
  title: 'Conformance/PackagesTable',
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
        package: {
          path: '/',
          name: 'package-one',
          type: PackageType.NODE,
          version: '1.0.0',
        },
        results: [],
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
      },
      {
        package: {
          name: 'package-two',
          type: PackageType.NODE,
          version: '1.0.0',
          path: '/path',
        },
        results: [],
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
      },
      {
        package: {
          name: 'package-three',
          type: PackageType.NODE,
          version: '1.0.0',
          path: '/path',
        },
        results: [],
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
      },
    ] satisfies ColumnData[],
  },
};

export const Basic: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: columns as any,
    data: [
      {
        package: {
          name: 'package-one',
          type: PackageType.NODE,
          version: '1.0.0',
          path: '/path',
        },
        results: [
          {
            status: Status.Warn,
            id: 'conformance-one',
            filter: 'tag-one',
            message: {
              message: 'This package should adhere to a certain standard',
              path: 'package.json',
              suggestion: `
              "  Object {
                  \\"devDependencies\\": Object {
                    \\"pkg-b\\": \\"^18.0.2\\",
                  },
                  \\"peerDependencies\\": Object {
                    \\"pkg-b\\": \\">=18\\",
                  },
                }"
            `,
            },
            package: {
              name: 'package-one',
              type: PackageType.NODE,
              version: '1.0.0',
              path: '/path',
              description: 'description',
            },
          },
          {
            status: Status.Fail,
            id: 'conformance-two',
            filter: 'tag-two',
            message: {
              message: 'This package is bad',
              path: 'package.json',
              suggestion: `
              "  Object {
                  \\"devDependencies\\": Object {
                    \\"pkg-b\\": \\"^18.0.2\\",
                  },
                  \\"peerDependencies\\": Object {
                    \\"pkg-b\\": \\">=18\\",
                  },
                }"
                `,
            },
            package: {
              name: 'package-one',
              type: PackageType.NODE,
              version: '1.0.0',
              path: '/path',
              description: 'description',
            },
          },
        ],
        codeowners: ['@team1', '@team2'],
        tags: ['#tag1', '#tag2'],
      },
      {
        package: {
          name: 'package-two',
          type: PackageType.NODE,
          version: '1.0.0',
          path: '/path',
        },
        results: [],
        codeowners: ['@team1', '@team2'],
        tags: ['#tag1', '#tag2'],
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
        package: {
          name: 'package-one',
          type: PackageType.NODE,
          version: '1.0.0',
          path: '/path',
        },
        results: [],
        codeowners: [],
        tags: [],
      },
      {
        package: {
          name: 'package-two',
          type: PackageType.NODE,
          version: '1.0.0',
          path: '/path',
        },
        results: [],
        codeowners: [],
        tags: [],
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
