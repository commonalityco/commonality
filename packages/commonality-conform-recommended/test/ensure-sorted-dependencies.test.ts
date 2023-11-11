import { describe, expect, it, vi } from 'vitest';
import { ensureSortedDependencies } from '../src/ensure-sorted-dependencies';

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
        json: vi.fn(),
        yaml: vi.fn(),
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
        json: vi.fn(),
        yaml: vi.fn(),
        text: vi.fn(),
        projectWorkspaces,
      });
      expect(result).toBe(true);
    });
  });

  describe('fix', () => {
    it('should not call set if dependencies are already sorted', async () => {
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
      const setMock = vi.fn();
      const json = vi.fn().mockImplementation(() => ({
        set: setMock,
      }));

      const conformer = ensureSortedDependencies();
      await conformer?.fix?.({
        workspace,
        json,
        yaml: vi.fn(),
        text: vi.fn(),
        projectWorkspaces: [],
      });

      expect(setMock).not.toHaveBeenCalled();
    });

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
      const setMock = vi.fn();
      const json = vi.fn().mockImplementation(() => ({
        set: setMock,
      }));

      const conformer = ensureSortedDependencies();
      await conformer?.fix?.({
        workspace,
        json,
        yaml: vi.fn(),
        text: vi.fn(),
        projectWorkspaces: [],
      });

      expect(setMock).toHaveBeenCalledTimes(3);
      expect(setMock).toHaveBeenCalledWith('dependencies', {
        'a-dep': '1.0.0',
        'b-dep': '1.0.0',
      });
      expect(setMock).toHaveBeenCalledWith('devDependencies', {
        'a-dep': '1.0.0',
        'b-dep': '1.0.0',
      });
      expect(setMock).toHaveBeenCalledWith('peerDependencies', {
        'a-dep': '1.0.0',
        'b-dep': '1.0.0',
      });
    });
  });
});