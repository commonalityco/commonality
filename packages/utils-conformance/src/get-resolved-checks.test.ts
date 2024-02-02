import { afterAll, describe, expect, test } from 'vitest';
import { getResolvedChecks, toRelativePath } from './get-resolved-checks';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

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

describe('getResolvedChecks', () => {
  const temporaryDirectoryPath = process.env['RUNNER_TEMP'] || os.tmpdir();
  const temporaryPath = fs.mkdtempSync(temporaryDirectoryPath);

  afterAll(async () => {
    await fs.remove(temporaryPath);
  });

  const kitchenSinkPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../local-fixtures/kitchen-sink',
  );

  test('should correctly resolve all path types', async () => {
    await fs.copy(kitchenSinkPath, temporaryPath);

    await fs.copy(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../local-fixtures/commonality-checks-test',
      ),
      temporaryPath,
    );

    await fs.copy(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../local-fixtures/scoped-checks',
      ),
      temporaryPath,
    );

    const result = getResolvedChecks({
      projectConfig: {
        checks: {
          '*': ['has-foo', 'test/has-foo', '@scope/team/has-foo'],
        },
      },
      rootDirectory: kitchenSinkPath,
    });

    expect(result.resolved).toEqual({
      '*': [
        { name: 'local-test' },
        { name: 'prefix-test' },
        { name: 'scoped-test' },
      ],
    });
  });
});
