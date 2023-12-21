import { describe, expect, it, vi } from 'vitest';
import { runFixes } from './run-fixes';
import { Package, TagsData, CodeownersData } from '@commonalityco/types';
import { PackageType, Status } from '@commonalityco/utils-core';
import { ConformanceResult } from './get-conformance-results';

describe('runFixes', () => {
  it('should call .fix with correct arguments', async () => {
    const mockFix = vi.fn();
    const conformanceResults: ConformanceResult[] = [
      {
        name: 'test',
        status: Status.Fail,
        fix: mockFix,
        filter: '#tag-one',
        message: {
          title: 'test',
        },
        package: {
          name: 'test-package',
          path: 'path/to/test-package',
          type: PackageType.NODE,
          version: '1.0.0',
        },
      },
    ];
    const allPackages: Package[] = [
      {
        name: 'test-package',
        path: 'path/to/test-package',
        type: PackageType.NODE,
        version: '1.0.0',
      },
    ];
    const rootDirectory = 'root/directory';
    const tagsData: TagsData[] = [
      {
        packageName: 'test-package',
        tags: ['tag1', 'tag2'],
      },
    ];
    const codeownersData: CodeownersData[] = [
      {
        packageName: 'test-package',
        codeowners: ['owner1', 'owner2'],
      },
    ];

    await runFixes({
      conformanceResults,
      allPackages,
      rootDirectory,
      tagsData,
      codeownersData,
    });

    expect(mockFix).toHaveBeenCalledWith({
      workspace: Object.freeze({
        path: 'root/directory/path/to/test-package',
        relativePath: 'path/to/test-package',
      }),
      allWorkspaces: [
        {
          path: 'root/directory/path/to/test-package',
          relativePath: 'path/to/test-package',
        },
      ],
      rootWorkspace: {
        path: 'root/directory',
        relativePath: '.',
      },
      tags: ['tag1', 'tag2'],
      codeowners: ['owner1', 'owner2'],
    });
  });
});
