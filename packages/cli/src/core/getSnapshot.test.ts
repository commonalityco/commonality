import mock from 'mock-fs';
import lastCommit from 'git-last-commit';
import { getSnapshot } from './getSnapshot';
import * as getCurrentBranch from './getCurrentBranch';
import { PackageType } from '@commonalityco/types';

describe('getSnapshot', () => {
  beforeEach(() => {
    jest
      .spyOn(getCurrentBranch, 'getCurrentBranch')
      .mockResolvedValue('my-branch');

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
    jest.spyOn(lastCommit, 'getLastCommit').mockImplementation((fn) => {
      fn(undefined as any, { branch: 'my-branch' } as any);
    });

    const snapshot = await getSnapshot('root', [
      'apps/app-foo',
      'packages/pkg-foo',
    ]);

    expect(snapshot.branch).toEqual('my-branch');
  });

  it('returns the correct projectId', async () => {
    const snapshot = await getSnapshot('root', [
      'apps/app-foo',
      'packages/pkg-foo',
    ]);

    expect(snapshot.projectId).toEqual('123');
  });

  it('returns the correct packages', async () => {
    const snapshot = await getSnapshot('root', [
      'apps/app-foo',
      'packages/pkg-foo',
    ]);

    expect(snapshot.packages).toEqual([
      {
        path: 'apps/app-foo',
        name: '@scope/app-foo',
        tags: ['tag-one'],
        version: '1.0.0',
        type: PackageType.NODE,
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
        tags: ['tag-two'],
        version: '2.0.0',
        dependencies: [],
        type: PackageType.NODE,
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
