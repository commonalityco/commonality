import { beforeEach, describe, expect, it } from 'vitest';
import { sortedDependencies } from '../src/sorted-dependencies';
import { createTestConformer, json } from 'commonality';
import mockFs from 'mock-fs';

describe('sortedDependencies', () => {
  beforeEach(() => {
    mockFs.restore();
  });

  describe('validate', () => {
    it('should return false if dependencies are not sorted', async () => {
      mockFs({
        'package.json': JSON.stringify({
          dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
        }),
      });

      const conformer = createTestConformer(sortedDependencies());

      const result = await conformer.validate();

      expect(result).toBe(false);
    });

    it('should return true if dependencies are already sorted', async () => {
      mockFs({
        'package.json': JSON.stringify({
          dependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          devDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
          peerDependencies: { 'a-dep': '1.0.0', 'b-dep': '1.0.0' },
        }),
      });

      const conformer = createTestConformer(sortedDependencies());

      const result = await conformer.validate();

      expect(result).toBe(true);
    });
  });

  describe('fix', () => {
    it('should fix unsorted dependencies', async () => {
      mockFs({
        'package.json': JSON.stringify({
          dependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          devDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
          peerDependencies: { 'b-dep': '1.0.0', 'a-dep': '1.0.0' },
        }),
      });
      const conformer = createTestConformer(sortedDependencies());

      await conformer.fix();

      const result = await json('package.json').get();

      expect(result).toEqual({
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