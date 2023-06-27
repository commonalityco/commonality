import type { Meta, StoryObj } from '@storybook/react';
import { FeatureGraph, FeatureGraphLayout } from '@commonalityco/feature-graph';
import { getUpdatedGraphJson } from '@commonalityco/utils-graph';
import { DependencyType, PackageManager } from '@commonalityco/utils-core';

const meta = {
  title: 'Features/Graph/FeatureGraph',
  component: FeatureGraph,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    packageManager: PackageManager.PNPM,
    theme: 'light',
    getUpdatedGraphJson,
    allTags: ['tag-one', 'tag-two'],
  },
  decorators: [
    (Story, props) => {
      return (
        <div style={{ height: '600px', width: '100%' }}>
          <FeatureGraphLayout>
            <Story {...props} />
          </FeatureGraphLayout>
        </div>
      );
    },
  ],
} satisfies Meta<typeof FeatureGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

const packages = [
  {
    name: '@scope/pkg-a',
    path: 'packages/pkg-a',
    version: '1.0.0',
    description: 'This is package A',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [
      {
        name: '@scope/pkg-b',
        version: '1.0.0',
        type: DependencyType.PRODUCTION,
      },
      {
        name: '@scope/pkg-c',
        version: '1.0.0',
        type: DependencyType.DEVELOPMENT,
      },
      { name: '@scope/pkg-d', version: '1.0.0', type: DependencyType.PEER },
      { name: '@scope/pkg-e', version: '1.0.0', type: DependencyType.PEER },
    ],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
  {
    name: '@scope/pkg-b',
    path: 'packages/pkg-b',
    version: '1.0.0',
    description: 'This is package B',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
  {
    name: '@scope/pkg-c',
    path: 'packages/pkg-c',
    version: '1.0.0',
    description: 'This is package C',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
  {
    name: '@scope/pkg-d',
    path: 'packages/pkg-d',
    version: '1.0.0',
    description: 'This is package D',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
  {
    name: '@scope/pkg-e',
    path: 'packages/pkg-e',
    version: '1.0.0',
    description: 'This is package E',
    tags: ['tag1', 'tag2'],
    owners: ['@scope/owner1', '@scope/owner2'],
    dependencies: [],
    devDependencies: [],
    peerDependencies: [],
    docs: {
      readme: {
        filename: 'README.md',
        content: '# This is a readme',
      },
      pages: [],
    },
  },
];

export const Default: Story = {
  args: {
    packages,
  },
};

// export const StressTest: Story = {
//   args: {
//     elements: [
//       {
//         data: {
//           id: 'node-0',
//         },
//       },
//       {
//         data: {
//           id: 'node-1',
//         },
//       },
//       {
//         data: {
//           id: 'node-2',
//         },
//       },
//       {
//         data: {
//           id: 'node-3',
//         },
//       },
//       {
//         data: {
//           id: 'node-4',
//         },
//       },
//       {
//         data: {
//           id: 'node-5',
//         },
//       },
//       {
//         data: {
//           id: 'node-6',
//         },
//       },
//       {
//         data: {
//           id: 'node-7',
//         },
//       },
//       {
//         data: {
//           id: 'node-8',
//         },
//       },
//       {
//         data: {
//           id: 'node-9',
//         },
//       },
//       {
//         data: {
//           id: 'node-10',
//         },
//       },
//       {
//         data: {
//           id: 'node-11',
//         },
//       },
//       {
//         data: {
//           id: 'node-12',
//         },
//       },
//       {
//         data: {
//           id: 'node-13',
//         },
//       },
//       {
//         data: {
//           id: 'node-14',
//         },
//       },
//       {
//         data: {
//           id: 'node-15',
//         },
//       },
//       {
//         data: {
//           id: 'node-16',
//         },
//       },
//       {
//         data: {
//           id: 'node-17',
//         },
//       },
//       {
//         data: {
//           id: 'node-18',
//         },
//       },
//       {
//         data: {
//           id: 'node-19',
//         },
//       },
//       {
//         data: {
//           id: 'node-20',
//         },
//       },
//       {
//         data: {
//           id: 'node-21',
//         },
//       },
//       {
//         data: {
//           id: 'node-22',
//         },
//       },
//       {
//         data: {
//           id: 'node-23',
//         },
//       },
//       {
//         data: {
//           id: 'node-24',
//         },
//       },
//       {
//         data: {
//           id: 'node-25',
//         },
//       },
//       {
//         data: {
//           id: 'node-26',
//         },
//       },
//       {
//         data: {
//           id: 'node-27',
//         },
//       },
//       {
//         data: {
//           id: 'node-28',
//         },
//       },
//       {
//         data: {
//           id: 'node-29',
//         },
//       },
//       {
//         data: {
//           id: 'node-30',
//         },
//       },
//       {
//         data: {
//           id: 'node-31',
//         },
//       },
//       {
//         data: {
//           id: 'node-32',
//         },
//       },
//       {
//         data: {
//           id: 'node-33',
//         },
//       },
//       {
//         data: {
//           id: 'node-34',
//         },
//       },
//       {
//         data: {
//           id: 'node-35',
//         },
//       },
//       {
//         data: {
//           id: 'node-36',
//         },
//       },
//       {
//         data: {
//           id: 'node-37',
//         },
//       },
//       {
//         data: {
//           id: 'node-38',
//         },
//       },
//       {
//         data: {
//           id: 'node-39',
//         },
//       },
//       {
//         data: {
//           id: 'node-40',
//         },
//       },
//       {
//         data: {
//           id: 'node-41',
//         },
//       },
//       {
//         data: {
//           id: 'node-42',
//         },
//       },
//       {
//         data: {
//           id: 'node-43',
//         },
//       },
//       {
//         data: {
//           id: 'node-44',
//         },
//       },
//       {
//         data: {
//           id: 'node-45',
//         },
//       },
//       {
//         data: {
//           id: 'node-46',
//         },
//       },
//       {
//         data: {
//           id: 'node-47',
//         },
//       },
//       {
//         data: {
//           id: 'node-48',
//         },
//       },
//       {
//         data: {
//           id: 'node-49',
//         },
//       },
//       {
//         data: {
//           id: 'node-50',
//         },
//       },
//       {
//         data: {
//           id: 'node-51',
//         },
//       },
//       {
//         data: {
//           id: 'node-52',
//         },
//       },
//       {
//         data: {
//           id: 'node-53',
//         },
//       },
//       {
//         data: {
//           id: 'node-54',
//         },
//       },
//       {
//         data: {
//           id: 'node-55',
//         },
//       },
//       {
//         data: {
//           id: 'node-56',
//         },
//       },
//       {
//         data: {
//           id: 'node-57',
//         },
//       },
//       {
//         data: {
//           id: 'node-58',
//         },
//       },
//       {
//         data: {
//           id: 'node-59',
//         },
//       },
//       {
//         data: {
//           id: 'node-60',
//         },
//       },
//       {
//         data: {
//           id: 'node-61',
//         },
//       },
//       {
//         data: {
//           id: 'node-62',
//         },
//       },
//       {
//         data: {
//           id: 'node-63',
//         },
//       },
//       {
//         data: {
//           id: 'node-64',
//         },
//       },
//       {
//         data: {
//           id: 'node-65',
//         },
//       },
//       {
//         data: {
//           id: 'node-66',
//         },
//       },
//       {
//         data: {
//           id: 'node-67',
//         },
//       },
//       {
//         data: {
//           id: 'node-68',
//         },
//       },
//       {
//         data: {
//           id: 'node-69',
//         },
//       },
//       {
//         data: {
//           id: 'node-70',
//         },
//       },
//       {
//         data: {
//           id: 'node-71',
//         },
//       },
//       {
//         data: {
//           id: 'node-72',
//         },
//       },
//       {
//         data: {
//           id: 'node-73',
//         },
//       },
//       {
//         data: {
//           id: 'node-74',
//         },
//       },
//       {
//         data: {
//           id: 'node-75',
//         },
//       },
//       {
//         data: {
//           id: 'node-76',
//         },
//       },
//       {
//         data: {
//           id: 'node-77',
//         },
//       },
//       {
//         data: {
//           id: 'node-78',
//         },
//       },
//       {
//         data: {
//           id: 'node-79',
//         },
//       },
//       {
//         data: {
//           id: 'node-80',
//         },
//       },
//       {
//         data: {
//           id: 'node-81',
//         },
//       },
//       {
//         data: {
//           id: 'node-82',
//         },
//       },
//       {
//         data: {
//           id: 'node-83',
//         },
//       },
//       {
//         data: {
//           id: 'node-84',
//         },
//       },
//       {
//         data: {
//           id: 'node-85',
//         },
//       },
//       {
//         data: {
//           id: 'node-86',
//         },
//       },
//       {
//         data: {
//           id: 'node-87',
//         },
//       },
//       {
//         data: {
//           id: 'node-88',
//         },
//       },
//       {
//         data: {
//           id: 'node-89',
//         },
//       },
//       {
//         data: {
//           id: 'node-90',
//         },
//       },
//       {
//         data: {
//           id: 'node-91',
//         },
//       },
//       {
//         data: {
//           id: 'node-92',
//         },
//       },
//       {
//         data: {
//           id: 'node-93',
//         },
//       },
//       {
//         data: {
//           id: 'node-94',
//         },
//       },
//       {
//         data: {
//           id: 'node-95',
//         },
//       },
//       {
//         data: {
//           id: 'node-96',
//         },
//       },
//       {
//         data: {
//           id: 'node-97',
//         },
//       },
//       {
//         data: {
//           id: 'node-98',
//         },
//       },
//       {
//         data: {
//           id: 'node-99',
//         },
//       },
//       {
//         data: {
//           id: 'node-100',
//         },
//       },
//       {
//         data: {
//           id: 'node-101',
//         },
//       },
//       {
//         data: {
//           id: 'node-102',
//         },
//       },
//       {
//         data: {
//           id: 'node-103',
//         },
//       },
//       {
//         data: {
//           id: 'node-104',
//         },
//       },
//       {
//         data: {
//           id: 'node-105',
//         },
//       },
//       {
//         data: {
//           id: 'node-106',
//         },
//       },
//       {
//         data: {
//           id: 'node-107',
//         },
//       },
//       {
//         data: {
//           id: 'node-108',
//         },
//       },
//       {
//         data: {
//           id: 'node-109',
//         },
//       },
//       {
//         data: {
//           id: 'node-110',
//         },
//       },
//       {
//         data: {
//           id: 'node-111',
//         },
//       },
//       {
//         data: {
//           id: 'node-112',
//         },
//       },
//       {
//         data: {
//           id: 'node-113',
//         },
//       },
//       {
//         data: {
//           id: 'node-114',
//         },
//       },
//       {
//         data: {
//           id: 'node-115',
//         },
//       },
//       {
//         data: {
//           id: 'node-116',
//         },
//       },
//       {
//         data: {
//           id: 'node-117',
//         },
//       },
//       {
//         data: {
//           id: 'node-118',
//         },
//       },
//       {
//         data: {
//           id: 'node-119',
//         },
//       },
//       {
//         data: {
//           id: 'node-120',
//         },
//       },
//       {
//         data: {
//           id: 'node-121',
//         },
//       },
//       {
//         data: {
//           id: 'node-122',
//         },
//       },
//       {
//         data: {
//           id: 'node-123',
//         },
//       },
//       {
//         data: {
//           id: 'node-124',
//         },
//       },
//       {
//         data: {
//           id: 'node-125',
//         },
//       },
//       {
//         data: {
//           id: 'node-126',
//         },
//       },
//       {
//         data: {
//           id: 'node-127',
//         },
//       },
//       {
//         data: {
//           id: 'node-128',
//         },
//       },
//       {
//         data: {
//           id: 'node-129',
//         },
//       },
//       {
//         data: {
//           id: 'node-130',
//         },
//       },
//       {
//         data: {
//           id: 'node-131',
//         },
//       },
//       {
//         data: {
//           id: 'node-132',
//         },
//       },
//       {
//         data: {
//           id: 'node-133',
//         },
//       },
//       {
//         data: {
//           id: 'node-134',
//         },
//       },
//       {
//         data: {
//           id: 'node-135',
//         },
//       },
//       {
//         data: {
//           id: 'node-136',
//         },
//       },
//       {
//         data: {
//           id: 'node-137',
//         },
//       },
//       {
//         data: {
//           id: 'node-138',
//         },
//       },
//       {
//         data: {
//           id: 'node-139',
//         },
//       },
//       {
//         data: {
//           id: 'node-140',
//         },
//       },
//       {
//         data: {
//           id: 'node-141',
//         },
//       },
//       {
//         data: {
//           id: 'node-142',
//         },
//       },
//       {
//         data: {
//           id: 'node-143',
//         },
//       },
//       {
//         data: {
//           id: 'node-144',
//         },
//       },
//       {
//         data: {
//           id: 'node-145',
//         },
//       },
//       {
//         data: {
//           id: 'node-146',
//         },
//       },
//       {
//         data: {
//           id: 'node-147',
//         },
//       },
//       {
//         data: {
//           id: 'node-148',
//         },
//       },
//       {
//         data: {
//           id: 'node-149',
//         },
//       },
//       {
//         data: {
//           id: 'node-150',
//         },
//       },
//       {
//         data: {
//           id: 'node-151',
//         },
//       },
//       {
//         data: {
//           id: 'node-152',
//         },
//       },
//       {
//         data: {
//           id: 'node-153',
//         },
//       },
//       {
//         data: {
//           id: 'node-154',
//         },
//       },
//       {
//         data: {
//           id: 'node-155',
//         },
//       },
//       {
//         data: {
//           id: 'node-156',
//         },
//       },
//       {
//         data: {
//           id: 'node-157',
//         },
//       },
//       {
//         data: {
//           id: 'node-158',
//         },
//       },
//       {
//         data: {
//           id: 'node-159',
//         },
//       },
//       {
//         data: {
//           id: 'node-160',
//         },
//       },
//       {
//         data: {
//           id: 'node-161',
//         },
//       },
//       {
//         data: {
//           id: 'node-162',
//         },
//       },
//       {
//         data: {
//           id: 'node-163',
//         },
//       },
//       {
//         data: {
//           id: 'node-164',
//         },
//       },
//       {
//         data: {
//           id: 'node-165',
//         },
//       },
//       {
//         data: {
//           id: 'node-166',
//         },
//       },
//       {
//         data: {
//           id: 'node-167',
//         },
//       },
//       {
//         data: {
//           id: 'node-168',
//         },
//       },
//       {
//         data: {
//           id: 'node-169',
//         },
//       },
//       {
//         data: {
//           id: 'node-170',
//         },
//       },
//       {
//         data: {
//           id: 'node-171',
//         },
//       },
//       {
//         data: {
//           id: 'node-172',
//         },
//       },
//       {
//         data: {
//           id: 'node-173',
//         },
//       },
//       {
//         data: {
//           id: 'node-174',
//         },
//       },
//       {
//         data: {
//           id: 'node-175',
//         },
//       },
//       {
//         data: {
//           id: 'node-176',
//         },
//       },
//       {
//         data: {
//           id: 'node-177',
//         },
//       },
//       {
//         data: {
//           id: 'node-178',
//         },
//       },
//       {
//         data: {
//           id: 'node-179',
//         },
//       },
//       {
//         data: {
//           id: 'node-180',
//         },
//       },
//       {
//         data: {
//           id: 'node-181',
//         },
//       },
//       {
//         data: {
//           id: 'node-182',
//         },
//       },
//       {
//         data: {
//           id: 'node-183',
//         },
//       },
//       {
//         data: {
//           id: 'node-184',
//         },
//       },
//       {
//         data: {
//           id: 'node-185',
//         },
//       },
//       {
//         data: {
//           id: 'node-186',
//         },
//       },
//       {
//         data: {
//           id: 'node-187',
//         },
//       },
//       {
//         data: {
//           id: 'node-188',
//         },
//       },
//       {
//         data: {
//           id: 'node-189',
//         },
//       },
//       {
//         data: {
//           id: 'node-190',
//         },
//       },
//       {
//         data: {
//           id: 'node-191',
//         },
//       },
//       {
//         data: {
//           id: 'node-192',
//         },
//       },
//       {
//         data: {
//           id: 'node-193',
//         },
//       },
//       {
//         data: {
//           id: 'node-194',
//         },
//       },
//       {
//         data: {
//           id: 'node-195',
//         },
//       },
//       {
//         data: {
//           id: 'node-196',
//         },
//       },
//       {
//         data: {
//           id: 'node-197',
//         },
//       },
//       {
//         data: {
//           id: 'node-198',
//         },
//       },
//       {
//         data: {
//           id: 'node-199',
//         },
//       },
//       {
//         data: {
//           id: 'node-200',
//         },
//       },
//       {
//         data: {
//           id: 'node-201',
//         },
//       },
//       {
//         data: {
//           id: 'node-202',
//         },
//       },
//       {
//         data: {
//           id: 'node-203',
//         },
//       },
//       {
//         data: {
//           id: 'node-204',
//         },
//       },
//       {
//         data: {
//           id: 'node-205',
//         },
//       },
//       {
//         data: {
//           id: 'node-206',
//         },
//       },
//       {
//         data: {
//           id: 'node-207',
//         },
//       },
//       {
//         data: {
//           id: 'node-208',
//         },
//       },
//       {
//         data: {
//           id: 'node-209',
//         },
//       },
//       {
//         data: {
//           id: 'node-210',
//         },
//       },
//       {
//         data: {
//           id: 'node-211',
//         },
//       },
//       {
//         data: {
//           id: 'node-212',
//         },
//       },
//       {
//         data: {
//           id: 'node-213',
//         },
//       },
//       {
//         data: {
//           id: 'node-214',
//         },
//       },
//       {
//         data: {
//           id: 'node-215',
//         },
//       },
//       {
//         data: {
//           id: 'node-216',
//         },
//       },
//       {
//         data: {
//           id: 'node-217',
//         },
//       },
//       {
//         data: {
//           id: 'node-218',
//         },
//       },
//       {
//         data: {
//           id: 'node-219',
//         },
//       },
//       {
//         data: {
//           id: 'node-220',
//         },
//       },
//       {
//         data: {
//           id: 'node-221',
//         },
//       },
//       {
//         data: {
//           id: 'node-222',
//         },
//       },
//       {
//         data: {
//           id: 'node-223',
//         },
//       },
//       {
//         data: {
//           id: 'node-224',
//         },
//       },
//       {
//         data: {
//           id: 'node-225',
//         },
//       },
//       {
//         data: {
//           id: 'node-226',
//         },
//       },
//       {
//         data: {
//           id: 'node-227',
//         },
//       },
//       {
//         data: {
//           id: 'node-228',
//         },
//       },
//       {
//         data: {
//           id: 'node-229',
//         },
//       },
//       {
//         data: {
//           id: 'node-230',
//         },
//       },
//       {
//         data: {
//           id: 'node-231',
//         },
//       },
//       {
//         data: {
//           id: 'node-232',
//         },
//       },
//       {
//         data: {
//           id: 'node-233',
//         },
//       },
//       {
//         data: {
//           id: 'node-234',
//         },
//       },
//       {
//         data: {
//           id: 'node-235',
//         },
//       },
//       {
//         data: {
//           id: 'node-236',
//         },
//       },
//       {
//         data: {
//           id: 'node-237',
//         },
//       },
//       {
//         data: {
//           id: 'node-238',
//         },
//       },
//       {
//         data: {
//           id: 'node-239',
//         },
//       },
//       {
//         data: {
//           id: 'node-240',
//         },
//       },
//       {
//         data: {
//           id: 'node-241',
//         },
//       },
//       {
//         data: {
//           id: 'node-242',
//         },
//       },
//       {
//         data: {
//           id: 'node-243',
//         },
//       },
//       {
//         data: {
//           id: 'node-244',
//         },
//       },
//       {
//         data: {
//           id: 'node-245',
//         },
//       },
//       {
//         data: {
//           id: 'node-246',
//         },
//       },
//       {
//         data: {
//           id: 'node-247',
//         },
//       },
//       {
//         data: {
//           id: 'node-248',
//         },
//       },
//       {
//         data: {
//           id: 'node-249',
//         },
//       },
//       {
//         data: {
//           id: 'node-250',
//         },
//       },
//       {
//         data: {
//           id: 'node-251',
//         },
//       },
//       {
//         data: {
//           id: 'node-252',
//         },
//       },
//       {
//         data: {
//           id: 'node-253',
//         },
//       },
//       {
//         data: {
//           id: 'node-254',
//         },
//       },
//       {
//         data: {
//           id: 'node-255',
//         },
//       },
//       {
//         data: {
//           id: 'node-256',
//         },
//       },
//       {
//         data: {
//           id: 'node-257',
//         },
//       },
//       {
//         data: {
//           id: 'node-258',
//         },
//       },
//       {
//         data: {
//           id: 'node-259',
//         },
//       },
//       {
//         data: {
//           id: 'node-260',
//         },
//       },
//       {
//         data: {
//           id: 'node-261',
//         },
//       },
//       {
//         data: {
//           id: 'node-262',
//         },
//       },
//       {
//         data: {
//           id: 'node-263',
//         },
//       },
//       {
//         data: {
//           id: 'node-264',
//         },
//       },
//       {
//         data: {
//           id: 'node-265',
//         },
//       },
//       {
//         data: {
//           id: 'node-266',
//         },
//       },
//       {
//         data: {
//           id: 'node-267',
//         },
//       },
//       {
//         data: {
//           id: 'node-268',
//         },
//       },
//       {
//         data: {
//           id: 'node-269',
//         },
//       },
//       {
//         data: {
//           id: 'node-270',
//         },
//       },
//       {
//         data: {
//           id: 'node-271',
//         },
//       },
//       {
//         data: {
//           id: 'node-272',
//         },
//       },
//       {
//         data: {
//           id: 'node-273',
//         },
//       },
//       {
//         data: {
//           id: 'node-274',
//         },
//       },
//       {
//         data: {
//           id: 'node-275',
//         },
//       },
//       {
//         data: {
//           id: 'node-276',
//         },
//       },
//       {
//         data: {
//           id: 'node-277',
//         },
//       },
//       {
//         data: {
//           id: 'node-278',
//         },
//       },
//       {
//         data: {
//           id: 'node-279',
//         },
//       },
//       {
//         data: {
//           id: 'node-280',
//         },
//       },
//       {
//         data: {
//           id: 'node-281',
//         },
//       },
//       {
//         data: {
//           id: 'node-282',
//         },
//       },
//       {
//         data: {
//           id: 'node-283',
//         },
//       },
//       {
//         data: {
//           id: 'node-284',
//         },
//       },
//       {
//         data: {
//           id: 'node-285',
//         },
//       },
//       {
//         data: {
//           id: 'node-286',
//         },
//       },
//       {
//         data: {
//           id: 'node-287',
//         },
//       },
//       {
//         data: {
//           id: 'node-288',
//         },
//       },
//       {
//         data: {
//           id: 'node-289',
//         },
//       },
//       {
//         data: {
//           id: 'node-290',
//         },
//       },
//       {
//         data: {
//           id: 'node-291',
//         },
//       },
//       {
//         data: {
//           id: 'node-292',
//         },
//       },
//       {
//         data: {
//           id: 'node-293',
//         },
//       },
//       {
//         data: {
//           id: 'node-294',
//         },
//       },
//       {
//         data: {
//           id: 'node-295',
//         },
//       },
//       {
//         data: {
//           id: 'node-296',
//         },
//       },
//       {
//         data: {
//           id: 'node-297',
//         },
//       },
//       {
//         data: {
//           id: 'node-298',
//         },
//       },
//       {
//         data: {
//           id: 'node-299',
//         },
//       },
//       {
//         data: {
//           id: 'node-70->node-285',
//           source: 'node-70',
//           target: 'node-285',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-76->node-12',
//           source: 'node-76',
//           target: 'node-12',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-14->node-6',
//           source: 'node-14',
//           target: 'node-6',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-2->node-163',
//           source: 'node-2',
//           target: 'node-163',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-296->node-11',
//           source: 'node-296',
//           target: 'node-11',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-296->node-115',
//           source: 'node-296',
//           target: 'node-115',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-16->node-99',
//           source: 'node-16',
//           target: 'node-99',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-69->node-211',
//           source: 'node-69',
//           target: 'node-211',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-188->node-11',
//           source: 'node-188',
//           target: 'node-11',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-40->node-211',
//           source: 'node-40',
//           target: 'node-211',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-105->node-189',
//           source: 'node-105',
//           target: 'node-189',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-275->node-296',
//           source: 'node-275',
//           target: 'node-296',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-141->node-71',
//           source: 'node-141',
//           target: 'node-71',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-98->node-7',
//           source: 'node-98',
//           target: 'node-7',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-120->node-210',
//           source: 'node-120',
//           target: 'node-210',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-288->node-297',
//           source: 'node-288',
//           target: 'node-297',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-93->node-228',
//           source: 'node-93',
//           target: 'node-228',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-48->node-76',
//           source: 'node-48',
//           target: 'node-76',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-45->node-276',
//           source: 'node-45',
//           target: 'node-276',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-179->node-84',
//           source: 'node-179',
//           target: 'node-84',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-247->node-112',
//           source: 'node-247',
//           target: 'node-112',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-245->node-239',
//           source: 'node-245',
//           target: 'node-239',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-282->node-267',
//           source: 'node-282',
//           target: 'node-267',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-70->node-56',
//           source: 'node-70',
//           target: 'node-56',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-85->node-81',
//           source: 'node-85',
//           target: 'node-81',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-233->node-241',
//           source: 'node-233',
//           target: 'node-241',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-163->node-151',
//           source: 'node-163',
//           target: 'node-151',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-0->node-187',
//           source: 'node-0',
//           target: 'node-187',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-194->node-146',
//           source: 'node-194',
//           target: 'node-146',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-246->node-74',
//           source: 'node-246',
//           target: 'node-74',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-261->node-118',
//           source: 'node-261',
//           target: 'node-118',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-277->node-199',
//           source: 'node-277',
//           target: 'node-199',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-25->node-5',
//           source: 'node-25',
//           target: 'node-5',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-260->node-131',
//           source: 'node-260',
//           target: 'node-131',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-118->node-250',
//           source: 'node-118',
//           target: 'node-250',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-29->node-55',
//           source: 'node-29',
//           target: 'node-55',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-276->node-254',
//           source: 'node-276',
//           target: 'node-254',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-153->node-276',
//           source: 'node-153',
//           target: 'node-276',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-190->node-13',
//           source: 'node-190',
//           target: 'node-13',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-191->node-222',
//           source: 'node-191',
//           target: 'node-222',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-211->node-119',
//           source: 'node-211',
//           target: 'node-119',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-283->node-103',
//           source: 'node-283',
//           target: 'node-103',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-11->node-35',
//           source: 'node-11',
//           target: 'node-35',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-173->node-164',
//           source: 'node-173',
//           target: 'node-164',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-130->node-206',
//           source: 'node-130',
//           target: 'node-206',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-282->node-125',
//           source: 'node-282',
//           target: 'node-125',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-123->node-225',
//           source: 'node-123',
//           target: 'node-225',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-73->node-113',
//           source: 'node-73',
//           target: 'node-113',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-254->node-35',
//           source: 'node-254',
//           target: 'node-35',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-95->node-233',
//           source: 'node-95',
//           target: 'node-233',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-64->node-269',
//           source: 'node-64',
//           target: 'node-269',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-49->node-250',
//           source: 'node-49',
//           target: 'node-250',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-188->node-199',
//           source: 'node-188',
//           target: 'node-199',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-156->node-97',
//           source: 'node-156',
//           target: 'node-97',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-19->node-151',
//           source: 'node-19',
//           target: 'node-151',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-186->node-115',
//           source: 'node-186',
//           target: 'node-115',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-130->node-116',
//           source: 'node-130',
//           target: 'node-116',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-103->node-78',
//           source: 'node-103',
//           target: 'node-78',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-155->node-9',
//           source: 'node-155',
//           target: 'node-9',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-11->node-109',
//           source: 'node-11',
//           target: 'node-109',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-188->node-146',
//           source: 'node-188',
//           target: 'node-146',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-94->node-88',
//           source: 'node-94',
//           target: 'node-88',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-278->node-269',
//           source: 'node-278',
//           target: 'node-269',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-90->node-47',
//           source: 'node-90',
//           target: 'node-47',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-107->node-290',
//           source: 'node-107',
//           target: 'node-290',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-273->node-214',
//           source: 'node-273',
//           target: 'node-214',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-136->node-269',
//           source: 'node-136',
//           target: 'node-269',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-36->node-86',
//           source: 'node-36',
//           target: 'node-86',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-100->node-65',
//           source: 'node-100',
//           target: 'node-65',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-213->node-81',
//           source: 'node-213',
//           target: 'node-81',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-43->node-56',
//           source: 'node-43',
//           target: 'node-56',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-122->node-93',
//           source: 'node-122',
//           target: 'node-93',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-265->node-215',
//           source: 'node-265',
//           target: 'node-215',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-110->node-131',
//           source: 'node-110',
//           target: 'node-131',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-203->node-146',
//           source: 'node-203',
//           target: 'node-146',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-221->node-204',
//           source: 'node-221',
//           target: 'node-204',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-206->node-274',
//           source: 'node-206',
//           target: 'node-274',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-31->node-200',
//           source: 'node-31',
//           target: 'node-200',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-76->node-59',
//           source: 'node-76',
//           target: 'node-59',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-85->node-178',
//           source: 'node-85',
//           target: 'node-178',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-147->node-162',
//           source: 'node-147',
//           target: 'node-162',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-144->node-41',
//           source: 'node-144',
//           target: 'node-41',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-97->node-124',
//           source: 'node-97',
//           target: 'node-124',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-108->node-87',
//           source: 'node-108',
//           target: 'node-87',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-191->node-210',
//           source: 'node-191',
//           target: 'node-210',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-136->node-296',
//           source: 'node-136',
//           target: 'node-296',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-37->node-265',
//           source: 'node-37',
//           target: 'node-265',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-181->node-153',
//           source: 'node-181',
//           target: 'node-153',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-3->node-238',
//           source: 'node-3',
//           target: 'node-238',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-75->node-85',
//           source: 'node-75',
//           target: 'node-85',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-54->node-272',
//           source: 'node-54',
//           target: 'node-272',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-203->node-131',
//           source: 'node-203',
//           target: 'node-131',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-112->node-209',
//           source: 'node-112',
//           target: 'node-209',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-283->node-92',
//           source: 'node-283',
//           target: 'node-92',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-14->node-53',
//           source: 'node-14',
//           target: 'node-53',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-64->node-112',
//           source: 'node-64',
//           target: 'node-112',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-31->node-113',
//           source: 'node-31',
//           target: 'node-113',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-239->node-249',
//           source: 'node-239',
//           target: 'node-249',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-111->node-230',
//           source: 'node-111',
//           target: 'node-230',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-45->node-43',
//           source: 'node-45',
//           target: 'node-43',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-38->node-56',
//           source: 'node-38',
//           target: 'node-56',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-38->node-289',
//           source: 'node-38',
//           target: 'node-289',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-294->node-212',
//           source: 'node-294',
//           target: 'node-212',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-247->node-39',
//           source: 'node-247',
//           target: 'node-39',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-28->node-78',
//           source: 'node-28',
//           target: 'node-78',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-225->node-125',
//           source: 'node-225',
//           target: 'node-125',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-45->node-225',
//           source: 'node-45',
//           target: 'node-225',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-244->node-280',
//           source: 'node-244',
//           target: 'node-280',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-222->node-142',
//           source: 'node-222',
//           target: 'node-142',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-7->node-146',
//           source: 'node-7',
//           target: 'node-146',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-194->node-295',
//           source: 'node-194',
//           target: 'node-295',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-269->node-96',
//           source: 'node-269',
//           target: 'node-96',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-73->node-10',
//           source: 'node-73',
//           target: 'node-10',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-157->node-288',
//           source: 'node-157',
//           target: 'node-288',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-61->node-86',
//           source: 'node-61',
//           target: 'node-86',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-162->node-248',
//           source: 'node-162',
//           target: 'node-248',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-134->node-240',
//           source: 'node-134',
//           target: 'node-240',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-168->node-169',
//           source: 'node-168',
//           target: 'node-169',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-181->node-106',
//           source: 'node-181',
//           target: 'node-106',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-102->node-262',
//           source: 'node-102',
//           target: 'node-262',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-165->node-297',
//           source: 'node-165',
//           target: 'node-297',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-295->node-195',
//           source: 'node-295',
//           target: 'node-195',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-215->node-212',
//           source: 'node-215',
//           target: 'node-212',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-89->node-84',
//           source: 'node-89',
//           target: 'node-84',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-106->node-227',
//           source: 'node-106',
//           target: 'node-227',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-203->node-3',
//           source: 'node-203',
//           target: 'node-3',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-201->node-186',
//           source: 'node-201',
//           target: 'node-186',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-284->node-134',
//           source: 'node-284',
//           target: 'node-134',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-109->node-155',
//           source: 'node-109',
//           target: 'node-155',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-61->node-89',
//           source: 'node-61',
//           target: 'node-89',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-116->node-102',
//           source: 'node-116',
//           target: 'node-102',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-61->node-264',
//           source: 'node-61',
//           target: 'node-264',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-115->node-145',
//           source: 'node-115',
//           target: 'node-145',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-253->node-222',
//           source: 'node-253',
//           target: 'node-222',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-45->node-40',
//           source: 'node-45',
//           target: 'node-40',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-191->node-244',
//           source: 'node-191',
//           target: 'node-244',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-115->node-67',
//           source: 'node-115',
//           target: 'node-67',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-113->node-53',
//           source: 'node-113',
//           target: 'node-53',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-265->node-57',
//           source: 'node-265',
//           target: 'node-57',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-271->node-72',
//           source: 'node-271',
//           target: 'node-72',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-225->node-248',
//           source: 'node-225',
//           target: 'node-248',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-113->node-40',
//           source: 'node-113',
//           target: 'node-40',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-38->node-285',
//           source: 'node-38',
//           target: 'node-285',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-136->node-152',
//           source: 'node-136',
//           target: 'node-152',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-94->node-187',
//           source: 'node-94',
//           target: 'node-187',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-274->node-150',
//           source: 'node-274',
//           target: 'node-150',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-241->node-127',
//           source: 'node-241',
//           target: 'node-127',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-119->node-193',
//           source: 'node-119',
//           target: 'node-193',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-117->node-298',
//           source: 'node-117',
//           target: 'node-298',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-44->node-139',
//           source: 'node-44',
//           target: 'node-139',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-209->node-98',
//           source: 'node-209',
//           target: 'node-98',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-194->node-174',
//           source: 'node-194',
//           target: 'node-174',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-297->node-27',
//           source: 'node-297',
//           target: 'node-27',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-200->node-276',
//           source: 'node-200',
//           target: 'node-276',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-279->node-70',
//           source: 'node-279',
//           target: 'node-70',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-149->node-74',
//           source: 'node-149',
//           target: 'node-74',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-89->node-49',
//           source: 'node-89',
//           target: 'node-49',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-250->node-41',
//           source: 'node-250',
//           target: 'node-41',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-7->node-36',
//           source: 'node-7',
//           target: 'node-36',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-19->node-215',
//           source: 'node-19',
//           target: 'node-215',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-131->node-256',
//           source: 'node-131',
//           target: 'node-256',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-245->node-158',
//           source: 'node-245',
//           target: 'node-158',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-164->node-206',
//           source: 'node-164',
//           target: 'node-206',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-263->node-96',
//           source: 'node-263',
//           target: 'node-96',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-95->node-63',
//           source: 'node-95',
//           target: 'node-63',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-36->node-263',
//           source: 'node-36',
//           target: 'node-263',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-60->node-39',
//           source: 'node-60',
//           target: 'node-39',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-46->node-206',
//           source: 'node-46',
//           target: 'node-206',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-120->node-8',
//           source: 'node-120',
//           target: 'node-8',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-108->node-260',
//           source: 'node-108',
//           target: 'node-260',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-258->node-260',
//           source: 'node-258',
//           target: 'node-260',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-223->node-136',
//           source: 'node-223',
//           target: 'node-136',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-294->node-38',
//           source: 'node-294',
//           target: 'node-38',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-140->node-150',
//           source: 'node-140',
//           target: 'node-150',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-150->node-109',
//           source: 'node-150',
//           target: 'node-109',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-39->node-131',
//           source: 'node-39',
//           target: 'node-131',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-273->node-121',
//           source: 'node-273',
//           target: 'node-121',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-48->node-28',
//           source: 'node-48',
//           target: 'node-28',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-33->node-289',
//           source: 'node-33',
//           target: 'node-289',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-11->node-182',
//           source: 'node-11',
//           target: 'node-182',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-15->node-152',
//           source: 'node-15',
//           target: 'node-152',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-51->node-75',
//           source: 'node-51',
//           target: 'node-75',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-94->node-157',
//           source: 'node-94',
//           target: 'node-157',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-76->node-237',
//           source: 'node-76',
//           target: 'node-237',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-225->node-87',
//           source: 'node-225',
//           target: 'node-87',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-57->node-219',
//           source: 'node-57',
//           target: 'node-219',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-168->node-171',
//           source: 'node-168',
//           target: 'node-171',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-288->node-213',
//           source: 'node-288',
//           target: 'node-213',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-178->node-17',
//           source: 'node-178',
//           target: 'node-17',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-73->node-84',
//           source: 'node-73',
//           target: 'node-84',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-167->node-235',
//           source: 'node-167',
//           target: 'node-235',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-100->node-196',
//           source: 'node-100',
//           target: 'node-196',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-22->node-288',
//           source: 'node-22',
//           target: 'node-288',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-275->node-79',
//           source: 'node-275',
//           target: 'node-79',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-124->node-41',
//           source: 'node-124',
//           target: 'node-41',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-266->node-116',
//           source: 'node-266',
//           target: 'node-116',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-280->node-215',
//           source: 'node-280',
//           target: 'node-215',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-243->node-290',
//           source: 'node-243',
//           target: 'node-290',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-6->node-157',
//           source: 'node-6',
//           target: 'node-157',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-22->node-238',
//           source: 'node-22',
//           target: 'node-238',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-248->node-96',
//           source: 'node-248',
//           target: 'node-96',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-50->node-38',
//           source: 'node-50',
//           target: 'node-38',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-92->node-213',
//           source: 'node-92',
//           target: 'node-213',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-112->node-240',
//           source: 'node-112',
//           target: 'node-240',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-211->node-290',
//           source: 'node-211',
//           target: 'node-290',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-210->node-120',
//           source: 'node-210',
//           target: 'node-120',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-288->node-64',
//           source: 'node-288',
//           target: 'node-64',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-249->node-79',
//           source: 'node-249',
//           target: 'node-79',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-171->node-250',
//           source: 'node-171',
//           target: 'node-250',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-179->node-6',
//           source: 'node-179',
//           target: 'node-6',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-74->node-129',
//           source: 'node-74',
//           target: 'node-129',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-256->node-264',
//           source: 'node-256',
//           target: 'node-264',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-257->node-43',
//           source: 'node-257',
//           target: 'node-43',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-227->node-171',
//           source: 'node-227',
//           target: 'node-171',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-156->node-50',
//           source: 'node-156',
//           target: 'node-50',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-89->node-190',
//           source: 'node-89',
//           target: 'node-190',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-291->node-92',
//           source: 'node-291',
//           target: 'node-92',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-131->node-282',
//           source: 'node-131',
//           target: 'node-282',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-73->node-250',
//           source: 'node-73',
//           target: 'node-250',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-245->node-263',
//           source: 'node-245',
//           target: 'node-263',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-271->node-197',
//           source: 'node-271',
//           target: 'node-197',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-226->node-42',
//           source: 'node-226',
//           target: 'node-42',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-207->node-264',
//           source: 'node-207',
//           target: 'node-264',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-44->node-248',
//           source: 'node-44',
//           target: 'node-248',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-165->node-36',
//           source: 'node-165',
//           target: 'node-36',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-76->node-297',
//           source: 'node-76',
//           target: 'node-297',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-278->node-84',
//           source: 'node-278',
//           target: 'node-84',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-261->node-183',
//           source: 'node-261',
//           target: 'node-183',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-63->node-163',
//           source: 'node-63',
//           target: 'node-163',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-166->node-17',
//           source: 'node-166',
//           target: 'node-17',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-2->node-230',
//           source: 'node-2',
//           target: 'node-230',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-154->node-146',
//           source: 'node-154',
//           target: 'node-146',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-146->node-1',
//           source: 'node-146',
//           target: 'node-1',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-30->node-299',
//           source: 'node-30',
//           target: 'node-299',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-158->node-213',
//           source: 'node-158',
//           target: 'node-213',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-66->node-242',
//           source: 'node-66',
//           target: 'node-242',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-262->node-16',
//           source: 'node-262',
//           target: 'node-16',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-109->node-55',
//           source: 'node-109',
//           target: 'node-55',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-174->node-236',
//           source: 'node-174',
//           target: 'node-236',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-238->node-255',
//           source: 'node-238',
//           target: 'node-255',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-197->node-193',
//           source: 'node-197',
//           target: 'node-193',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-71->node-204',
//           source: 'node-71',
//           target: 'node-204',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-271->node-122',
//           source: 'node-271',
//           target: 'node-122',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-36->node-278',
//           source: 'node-36',
//           target: 'node-278',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-162->node-244',
//           source: 'node-162',
//           target: 'node-244',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-234->node-23',
//           source: 'node-234',
//           target: 'node-23',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-160->node-47',
//           source: 'node-160',
//           target: 'node-47',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-93->node-288',
//           source: 'node-93',
//           target: 'node-288',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-257->node-239',
//           source: 'node-257',
//           target: 'node-239',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-14->node-202',
//           source: 'node-14',
//           target: 'node-202',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-193->node-260',
//           source: 'node-193',
//           target: 'node-260',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-244->node-94',
//           source: 'node-244',
//           target: 'node-94',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-132->node-114',
//           source: 'node-132',
//           target: 'node-114',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-88->node-93',
//           source: 'node-88',
//           target: 'node-93',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-52->node-186',
//           source: 'node-52',
//           target: 'node-186',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-275->node-134',
//           source: 'node-275',
//           target: 'node-134',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-6->node-15',
//           source: 'node-6',
//           target: 'node-15',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-31->node-11',
//           source: 'node-31',
//           target: 'node-11',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-160->node-74',
//           source: 'node-160',
//           target: 'node-74',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-135->node-213',
//           source: 'node-135',
//           target: 'node-213',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-170->node-167',
//           source: 'node-170',
//           target: 'node-167',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-298->node-29',
//           source: 'node-298',
//           target: 'node-29',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-236->node-213',
//           source: 'node-236',
//           target: 'node-213',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-172->node-234',
//           source: 'node-172',
//           target: 'node-234',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-245->node-77',
//           source: 'node-245',
//           target: 'node-77',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-125->node-276',
//           source: 'node-125',
//           target: 'node-276',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-15->node-293',
//           source: 'node-15',
//           target: 'node-293',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-222->node-216',
//           source: 'node-222',
//           target: 'node-216',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-36->node-259',
//           source: 'node-36',
//           target: 'node-259',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-5->node-93',
//           source: 'node-5',
//           target: 'node-93',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-187->node-291',
//           source: 'node-187',
//           target: 'node-291',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-16->node-291',
//           source: 'node-16',
//           target: 'node-291',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-1->node-124',
//           source: 'node-1',
//           target: 'node-124',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-191->node-127',
//           source: 'node-191',
//           target: 'node-127',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-110->node-208',
//           source: 'node-110',
//           target: 'node-208',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-105->node-169',
//           source: 'node-105',
//           target: 'node-169',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-290->node-187',
//           source: 'node-290',
//           target: 'node-187',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-233->node-263',
//           source: 'node-233',
//           target: 'node-263',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-273->node-22',
//           source: 'node-273',
//           target: 'node-22',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-124->node-298',
//           source: 'node-124',
//           target: 'node-298',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-225->node-49',
//           source: 'node-225',
//           target: 'node-49',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-114->node-192',
//           source: 'node-114',
//           target: 'node-192',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-87->node-126',
//           source: 'node-87',
//           target: 'node-126',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-5->node-37',
//           source: 'node-5',
//           target: 'node-37',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-113->node-273',
//           source: 'node-113',
//           target: 'node-273',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-57->node-152',
//           source: 'node-57',
//           target: 'node-152',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-203->node-48',
//           source: 'node-203',
//           target: 'node-48',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-37->node-50',
//           source: 'node-37',
//           target: 'node-50',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-173->node-140',
//           source: 'node-173',
//           target: 'node-140',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-223->node-18',
//           source: 'node-223',
//           target: 'node-18',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-244->node-35',
//           source: 'node-244',
//           target: 'node-35',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-236->node-291',
//           source: 'node-236',
//           target: 'node-291',
//           type: 'PRODUCTION',
//         },
//       },
//       {
//         data: {
//           id: 'node-180->node-270',
//           source: 'node-180',
//           target: 'node-270',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-228->node-30',
//           source: 'node-228',
//           target: 'node-30',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-5->node-43',
//           source: 'node-5',
//           target: 'node-43',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-156->node-299',
//           source: 'node-156',
//           target: 'node-299',
//           type: 'DEVELOPMENT',
//         },
//       },
//       {
//         data: {
//           id: 'node-259->node-260',
//           source: 'node-259',
//           target: 'node-260',
//           type: 'PEER',
//         },
//       },
//       {
//         data: {
//           id: 'node-214->node-169',
//           source: 'node-214',
//           target: 'node-169',
//           type: 'DEVELOPMENT',
//         },
//       },
//     ],
//   },
// };
