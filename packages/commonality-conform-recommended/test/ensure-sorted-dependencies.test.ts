import { describe, expect, it, vi } from 'vitest';
import { ensureSortedDependencies } from '../src/ensure-sorted-dependencies';
import { jsonReader, jsonWriter } from '@commonalityco/utils-file';

describe('ensureSortedDependencies', () => {
  describe('validate', () => {
    it('should return false if dependencies are not sorted', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
        },
      };

      const projectWorkspaces = [];
      const conformer = ensureSortedDependencies();
      const result = await conformer.validate({
        workspace,
        json: () =>
          jsonReader('package.json', {
            defaultSource: workspace.packageJson,
          }),
        text: vi.fn(),
        projectWorkspaces,
      });
      expect(result).toBe(false);
    });

    it('should return true if dependencies are already sorted', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          dependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          devDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          peerDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
        },
      };

      const projectWorkspaces = [];
      const conformer = ensureSortedDependencies();
      const result = await conformer.validate({
        workspace,
        json: () =>
          jsonReader('package.json', {
            defaultSource: workspace.packageJson,
          }),
        text: vi.fn(),
        projectWorkspaces,
      });
      expect(result).toBe(true);
    });
  });

  describe('fix', () => {
    it('should fix unsorted dependencies', async () => {
      const workspace = {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['owner1', 'owner2'],
        packageJson: {
          dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
        },
      };

      const conformer = ensureSortedDependencies();
      const onWriteMock = vi.fn();

      await conformer?.fix?.({
        workspace,
        json: () =>
          jsonWriter('package.json', {
            defaultSource: workspace.packageJson,
            onWrite: onWriteMock,
          }),
        text: vi.fn(),
        projectWorkspaces: [],
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
