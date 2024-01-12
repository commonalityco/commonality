import { describe, expect, it, vi } from 'vitest';
import prompts from 'prompts';
import { getInstallChecks } from './get-install-checks';
import * as localPkg from 'local-pkg';

vi.mock('local-pkg');

describe('getInstallChecks', () => {
  it('returns false when module is resolved it returns false', async () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    vi.mocked(localPkg.resolveModule).mockReturnValue('/path/to/pkg');

    const result = await getInstallChecks({ rootDirectory: './' });

    expect(result).toEqual(false);
  });

  it('returns user input when module is not resolved and the user answers yes it returns true', async () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    vi.mocked(localPkg.resolveModule).mockReturnValue(undefined);

    prompts.inject([true]);

    const result = await getInstallChecks({ rootDirectory: './' });

    expect(result).toEqual(true);
  });

  it('returns user input when module is not resolved and the user answers no it returns false', async () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    vi.mocked(localPkg.resolveModule).mockReturnValue(undefined);

    prompts.inject([false]);

    const result = await getInstallChecks({ rootDirectory: './' });

    expect(result).toEqual(false);
  });
});
