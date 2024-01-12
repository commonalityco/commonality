import { describe, expect, it, vi } from 'vitest';
import { getInstallCommonality } from './get-install-commonality';
import * as localPkg from 'local-pkg';

vi.mock('local-pkg');

describe('getInstallCommonality', () => {
  it('returns true when module is not resolved', async () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    vi.mocked(localPkg.resolveModule).mockReturnValue(undefined);

    const result = await getInstallCommonality({ rootDirectory: './' });

    expect(result).toEqual(true);
  });

  it('returns false when module is resolved', async () => {
    vi.mocked(localPkg.resolveModule).mockReturnValue('/path/to/pkg');

    const result = await getInstallCommonality({ rootDirectory: './' });

    expect(result).toEqual(false);
  });
});
