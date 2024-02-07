import { describe, expect, it } from 'vitest';
import hasCodeowner from './has-codeowner';
import { defineTestCheck } from 'commonality';

describe('hasCodeowner', () => {
  describe('validate', () => {
    it('should return false if codeowners are not present', async () => {
      const conformer = defineTestCheck(hasCodeowner, {
        codeowners: [],
      });

      const result = await conformer.validate();
      expect(result).toBe(false);
    });

    it('should return true if codeowners are present', async () => {
      const conformer = defineTestCheck(hasCodeowner, {
        codeowners: ['owner-1', 'owner-2'],
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });
  });
});
