import stripAnsi from 'strip-ansi';
import { describe, expect, it, vi } from 'vitest';
import {
  getExternalVersionMap,
  noExternalMismatch,
} from '../src/no-external-mismatch';
import { Workspace } from '@commonalityco/types';
import { json } from '@commonalityco/utils-file';

describe('getExternalVersionMap', () => {
  it('should return an empty map when no workspaces are provided', () => {
    const workspaces: Workspace[] = [];
    const versionMap = getExternalVersionMap(workspaces);
    expect(versionMap.size).toBe(0);
  });

  it('should return a map with the most common package versions when workspaces are provided', async () => {
    const workspaces: Workspace[] = [
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgA',
          dependencies: {
            package1: '3.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      },
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgB',
          dependencies: {
            package1: '2.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      },
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgC',
          dependencies: {},
          devDependencies: {
            package1: '2.0.0',
          },
          peerDependencies: {},
        },
      },
    ];
    const versionMap = getExternalVersionMap(workspaces);
    expect(versionMap.size).toBe(1);
    expect(versionMap.get('package1')).toBe('2.0.0');
  });

  it('should return a map with the most common package versions when workspaces are provided', async () => {
    const workspaces: Workspace[] = [
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgA',
          dependencies: {
            package1: '3.0.0',
            package2: '2.0.0',
            package3: '2.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      },
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgB',
          dependencies: {
            package1: '2.0.0',
            package2: '2.0.0',
            package3: '2.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      },
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgC',
          dependencies: {},
          devDependencies: {
            package1: '2.0.0',
            package3: '3.0.0',
          },
          peerDependencies: {},
        },
      },
    ];
    const versionMap = getExternalVersionMap(workspaces);
    expect(versionMap.size).toBe(3);
    expect(versionMap.get('package1')).toBe('2.0.0');
    expect(versionMap.get('package2')).toBe('2.0.0');
    expect(versionMap.get('package3')).toBe('2.0.0');
  });

  it('should return a map with the highest package versions when occurances of a dependency are equal across workspaces', async () => {
    const workspaces: Workspace[] = [
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgA',
          dependencies: {
            package1: '1.0.0',
            package2: '1.0.0',
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      },
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgB',
          dependencies: {},
          devDependencies: {
            package1: '2.0.0',
            package2: '2.0.0',
            package3: '2.0.0',
          },
          peerDependencies: {},
        },
      },
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgC',
          dependencies: {},
          devDependencies: {
            package1: '3.0.0',
            package3: '3.0.0',
          },
          peerDependencies: {},
        },
      },
    ];
    const versionMap = getExternalVersionMap(workspaces);
    expect(versionMap.size).toBe(3);
    expect(versionMap.get('package1')).toBe('3.0.0');
    expect(versionMap.get('package2')).toBe('2.0.0');
    expect(versionMap.get('package3')).toBe('3.0.0');
  });

  it('should return a map with the highest version when multiple workspaces have the same package', () => {
    const workspaces: Workspace[] = [
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgA',
          dependencies: {
            package1: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      },
      {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'pkgB',
          dependencies: {},
          devDependencies: {
            package1: '2.0.0',
          },
          peerDependencies: {},
        },
      },
    ];
    const versionMap = getExternalVersionMap(workspaces);
    expect(versionMap.size).toBe(1);
    expect(versionMap.get('package1')).toBe('2.0.0');
  });

  it('should not include internal packages in the map', () => {
    const workspaceA = {
      path: '',
      tags: [],
      codeowners: [],
      packageJson: {
        name: 'package-a',
        dependencies: {
          'package-b': 'workspace:*',
          package3: '3.0.0',
        },
        devDependencies: {},
        peerDependencies: {},
      },
    };
    const workspaceB = {
      path: '',
      tags: [],
      codeowners: [],
      packageJson: {
        name: 'package-b',
        dependencies: {
          package3: '1.0.0',
        },
        devDependencies: {},
        peerDependencies: {},
      },
    };
    const workspaceC = {
      path: '',
      tags: [],
      codeowners: [],
      packageJson: {
        name: 'package-c',
        dependencies: {},
        devDependencies: {
          package3: '1.0.0',
        },
        peerDependencies: {},
      },
    };
    const versionMap = getExternalVersionMap([
      workspaceA,
      workspaceB,
      workspaceC,
    ]);

    expect(versionMap.size).toBe(1);
    expect(versionMap.get('package-b')).toEqual(undefined);
    expect(versionMap.get('package3')).toBe('1.0.0');
  });
});

describe('no-external-mismatch', () => {
  describe('validate', () => {
    it('should return true when there are no external mismatches', async () => {
      const conformer = noExternalMismatch();
      const workspaceA = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'package1',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceB = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'package2',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceC = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'package3',
          dependencies: {},
          devDependencies: {
            package3: '1.0.0',
          },
          peerDependencies: {},
        },
      };

      const result = await conformer.validate({
        projectWorkspaces: [workspaceA, workspaceB, workspaceC],
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
      });

      expect(result).toEqual(true);
    });

    it('should return false when are external mismatches', async () => {
      const conformer = noExternalMismatch();
      const workspaceA = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'packageA',
          dependencies: {
            package3: '3.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceB = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'packageB',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceC = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'packageC',
          dependencies: {},
          devDependencies: {
            package3: '1.0.0',
          },
          peerDependencies: {},
        },
      };

      const result = await conformer.validate({
        projectWorkspaces: [workspaceA, workspaceB, workspaceC],
        json: vi.fn(),
        text: vi.fn(),
        workspace: workspaceA,
      });

      expect(result).toEqual(false);
    });
  });

  describe('fix', () => {
    it('should write the correct versions to the package.json', async () => {
      const conformer = noExternalMismatch();

      const workspaceA = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'packageA',
          dependencies: {
            package3: '3.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceB = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'packageB',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceC = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'packageC',
          dependencies: {},
          devDependencies: {
            package3: '1.0.0',
          },
          peerDependencies: {},
        },
      };

      const mockOnWrite = vi.fn();

      await conformer.fix({
        json: () =>
          json('package.json', {
            onWrite: mockOnWrite,
            defaultSource: workspaceA.packageJson,
          }),
        text: vi.fn(),
        projectWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
      });

      expect(mockOnWrite).toHaveBeenCalledWith('package.json', {
        name: 'packageA',
        dependencies: {
          package3: '1.0.0',
        },
        devDependencies: {},
        peerDependencies: {},
      });
    });
  });

  describe('message', () => {
    it('should return the correct message', async () => {
      const conformer = noExternalMismatch();

      const workspaceA = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'package-a',
          dependencies: {
            'package-b': 'workspace:*',
            package3: '3.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceB = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'package-b',
          dependencies: {
            package3: '1.0.0',
          },
          devDependencies: {},
          peerDependencies: {},
        },
      };
      const workspaceC = {
        path: '',
        tags: [],
        codeowners: [],
        packageJson: {
          name: 'package-c',
          dependencies: {},
          devDependencies: {
            package3: '1.0.0',
          },
          peerDependencies: {},
        },
      };

      const result = await conformer.message({
        json: () =>
          json('package.json', {
            defaultSource: workspaceA.packageJson,
          }),
        text: vi.fn(),
        projectWorkspaces: [workspaceA, workspaceB, workspaceC],
        workspace: workspaceA,
      });

      expect(stripAnsi(result.context ?? '')).toMatchInlineSnapshot(`
        "  Object {
            \\"dependencies\\": Object {
              \\"package3\\": \\"3.0.0\\",
        +     \\"package3\\": \\"1.0.0\\",
            },
          }"
      `);
    });
  });
});
