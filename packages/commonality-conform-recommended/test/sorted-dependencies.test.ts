import { describe, expect, it, vi } from 'vitest';
import { sortedDependencies } from '../src/sorted-dependencies';
import { createTestConformer } from '@commonalityco/utils-file';

describe('sortedDependencies', () => {
  describe('validate', () => {
    it('should return false if dependencies are not sorted', async () => {
      const conformer = createTestConformer(sortedDependencies(), {
        files: {
          'package.json': {
            dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
            devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
            peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return true if dependencies are already sorted', async () => {
      const conformer = createTestConformer(sortedDependencies(), {
        files: {
          'package.json': {
            dependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
            devDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
            peerDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          },
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });
  });

  describe('fix', () => {
    it('should fix unsorted dependencies', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(sortedDependencies(), {
        onWrite,
        files: {
          'package.json': {
            dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
            devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
            peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          },
        },
      });

      await conformer.fix();

      expect(onWrite).toHaveBeenCalledTimes(1);
      expect(onWrite).toHaveBeenCalledWith('package.json', {
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
