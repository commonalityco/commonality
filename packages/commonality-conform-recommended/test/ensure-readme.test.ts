import { describe, expect, it, vi } from 'vitest';
import { ensureReadme } from '../src/ensure-readme';
import { createTestConformer } from '@commonalityco/utils-file';

describe('ensureReadme', () => {
  describe('validate', () => {
    it('should return true if README.md exists', async () => {
      const conformer = createTestConformer(ensureReadme(), {
        files: {
          'README.md': '# Hello',
        },
      });

      const result = await conformer.validate();

      expect(result).toBe(true);
    });

    it('should return false if README.md does not exist', async () => {
      const conformer = createTestConformer(ensureReadme(), { files: {} });

      const result = await conformer.validate();

      expect(result).toBe(false);
    });
  });

  describe('fix', () => {
    it('should create README.md with correct content', async () => {
      const onWrite = vi.fn();
      const conformer = createTestConformer(ensureReadme(), {
        onWrite,
        files: {
          'package.json': {
            name: 'workspaceName',
          },
        },
      });

      await conformer.fix();

      expect(onWrite).toHaveBeenCalledWith(
        'README.md',
        expect.stringMatching('# workspaceName'),
      );
    });
  });
});
