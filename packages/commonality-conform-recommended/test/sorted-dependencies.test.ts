import { describe, expect, it, vi } from 'vitest';
import { sortedDependencies } from '../src/sorted-dependencies';
import { json } from '@commonalityco/utils-file';

const rootWorkspace = {
  path: '/root',
  relativePath: '.',
  packageJson: {
    name: 'root',
  },
};

describe('sortedDependencies', () => {
  describe('validate', () => {
    it('should return false if dependencies are not sorted', async () => {
      const workspace = {
        path: '/path/to/workspace',
        relativePath: '',
        packageJson: {
          dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
        },
      };

      const allWorkspaces = [];
      const conformer = sortedDependencies();
      const result = await conformer.validate({
        workspace,
        json: () =>
          json('package.json', {
            defaultSource: workspace.packageJson,
          }),
        text: vi.fn(),
        allWorkspaces,
        tags: [],
        codeowners: [],
        rootWorkspace,
      });
      expect(result).toBe(false);
    });

    it('should return true if dependencies are already sorted', async () => {
      const workspace = {
        path: '/path/to/workspace',
        relativePath: '',
        packageJson: {
          dependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          devDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          peerDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
        },
      };

      const allWorkspaces = [];
      const conformer = sortedDependencies();
      const result = await conformer.validate({
        workspace,
        json: () =>
          json('package.json', {
            defaultSource: workspace.packageJson,
          }),
        text: vi.fn(),
        allWorkspaces,
        tags: [],
        codeowners: [],
        rootWorkspace,
      });
      expect(result).toBe(true);
    });
  });

  describe('fix', () => {
    it('should fix unsorted dependencies', async () => {
      const workspace = {
        path: '/path/to/workspace',
        relativePath: '',
        packageJson: {
          dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
        },
      };

      const conformer = sortedDependencies();
      const onWriteMock = vi.fn();

      await conformer?.fix?.({
        workspace,
        json: () =>
          json('package.json', {
            defaultSource: workspace.packageJson,
            onWrite: onWriteMock,
          }),
        text: vi.fn(),
        allWorkspaces: [],
        tags: [],
        codeowners: [],
        rootWorkspace,
      });

      expect(onWriteMock).toHaveBeenCalledTimes(1);
      expect(onWriteMock).toHaveBeenCalledWith('package.json', {
        dependencies: {
          'a-dep': '1.0.0',
          'b-dep': '1.0.0',
        },
        devDependencies: {
          'a-dep': '1.0.0',
          'b-dep': '1.0.0',
        },
        peerDependencies: {
          'a-dep': '1.0.0',
          'b-dep': '1.0.0',
        },
      });
    });
  });
});
