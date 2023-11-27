import { describe, expect, it } from 'vitest';
import { ensureCodeowner } from '../src/ensure-codeowner';
import { createTestConformer } from '@commonalityco/utils-file';

describe('ensureCodeowner', () => {
  describe('validate', () => {
    it('should return false if codeowners are not present', async () => {
      const conformer = createTestConformer(ensureCodeowner(), {
        codeowners: [],
      });

      const result = await conformer.validate();
      expect(result).toBe(false);
    });

    it('should return true if codeowners are present', async () => {
      const conformer = createTestConformer(ensureCodeowner(), {
        codeowners: ['owner-1', 'owner-2'],
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });
  });
});
