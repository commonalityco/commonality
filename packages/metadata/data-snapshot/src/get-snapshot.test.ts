/* eslint-disable @typescript-eslint/naming-convention */
import mock from 'mock-fs';
import {
  describe,
  expect,
  beforeEach,
  afterEach,
  it,
  jest,
} from '@jest/globals';
import { getCurrentBranch } from './get-current-branch';
import { getSnapshot } from './get-snapshot';

jest.mock('./get-current-branch', () => ({
  getCurrentBranch: jest
    .fn<typeof getCurrentBranch>()
    .mockResolvedValue('my-branch'),
}));

describe('getSnapshot', () => {
  beforeEach(() => {
    mock({
      'root/.commonality/config.json': JSON.stringify({ project: '123' }),
      'root/apps/app-foo/package.json': JSON.stringify({
        name: '@scope/app-foo',
        version: '1.0.0',
        dependencies: {
          bar: '^1.0.0',
        },
      }),
      'root/apps/app-foo/commonality.json': JSON.stringify({
        tags: ['tag-one'],
      }),
      'root/packages/pkg-foo/package.json': JSON.stringify({
        name: '@scope/pkg-foo',
        version: '2.0.0',
        devDependencies: {
          bar: '^1.0.0',
        },
      }),
      'root/packages/pkg-foo/commonality.json': JSON.stringify({
        tags: ['tag-two'],
      }),
    });
  });

  afterEach(mock.restore);

  it('returns the correct branch', async () => {
    const snapshot = await getSnapshot(
      'root',
      '123'
    );

    expect(snapshot.branch).toEqual('my-branch');
  });

  it('returns the correct projectId', async () => {
    const snapshot = await getSnapshot(
      'root',
      '123'
    );

    expect(snapshot.projectId).toEqual('123');
  });

  it('returns the correct packages', async () => {
    const snapshot = await getSnapshot(
      'root',
      '123'
    );

    expect(snapshot.packages).toEqual([
      {
        path: 'apps/app-foo',
        name: '@scope/app-foo',
        owners: [],
        tags: ['tag-one'],
        version: '1.0.0',
        dependencies: [
          {
            name: 'bar',
            version: '^1.0.0',
          },
        ],
        devDependencies: [],
        peerDependencies: [],
      },
      {
        path: 'packages/pkg-foo',
        name: '@scope/pkg-foo',
        owners: [],
        tags: ['tag-two'],
        version: '2.0.0',
        dependencies: [],
        devDependencies: [
          {
            name: 'bar',
            version: '^1.0.0',
          },
        ],
        peerDependencies: [],
      },
    ]);
  });
});
