import { afterAll, describe, expect, test } from 'vitest';
import { getResolvedChecks, toRelativePath } from './get-resolved-checks';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { execa } from 'execa';

describe('toRelativePath', () => {
  test('returns a relative path when string has no prefix', () => {
    const result = toRelativePath('path/to/file.js');

    expect(result).toBe('./path/to/file.js');
  });

  test('returns a relative path when string has prefix of "./"', () => {
    const result = toRelativePath('./path/to/file.js');

    expect(result).toBe('./path/to/file.js');
  });

  test('returns a relative path when string has prefix of "/"', () => {
    const result = toRelativePath('/path/to/file.js');

    expect(result).toBe('./path/to/file.js');
  });

  test('returns a relative path when string has prefix of "../../"', () => {
    const result = toRelativePath('../../path/to/file.js');

    expect(result).toBe('../../path/to/file.js');
  });
});

describe(
  'getResolvedChecks',
  () => {
    const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
    const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

    afterAll(async () => {
      await fs.remove(temporaryPath);
    });

    const kitchenSinkPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../fixtures/kitchen-sink',
    );

    test(
      'should correctly resolve all path types',
      async () => {
        await fs.copy(
          kitchenSinkPath,
          path.join(temporaryPath, 'kitchen-sink'),
        );

        await fs.copy(
          path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            '../fixtures/commonality-checks-test',
          ),
          path.join(temporaryPath, 'commonality-checks-test'),
        );

        await fs.copy(
          path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            '../fixtures/scoped-checks',
          ),
          path.join(temporaryPath, 'scoped-checks'),
        );

        await execa('pnpm', ['install'], {
          cwd: path.join(temporaryPath, 'kitchen-sink'),
        });

        const result = getResolvedChecks({
          projectConfig: {
            checks: {
              '*': ['has-foo', 'test/has-foo', '@scope/team/has-foo', 'foo'],
            },
          },
          rootDirectory: path.join(temporaryPath, 'kitchen-sink'),
        });

        expect(result.resolved).toEqual({
          '*': [
            { name: 'local-test' },
            { name: 'prefix-test' },
            { name: 'scoped-test' },
          ],
        });

        expect(result.unresolved).toEqual(['foo']);
      },
      { timeout: 200_000 },
    );
  },
  { timeout: 200_000 },
);
