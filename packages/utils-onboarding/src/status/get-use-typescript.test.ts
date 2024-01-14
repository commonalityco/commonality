import { describe, expect, it } from 'vitest';
import prompts from 'prompts';
import { getUseTypeScript } from './get-use-typescript';

describe('getUseTypeScript', () => {
  it('returns true when user chooses to use TypeScript', async () => {
    prompts.inject([true]);

    const result = await getUseTypeScript();

    expect(result).toEqual(true);
  });

  it('returns false when user chooses not to use TypeScript', async () => {
    prompts.inject([false]);

    const result = await getUseTypeScript();

    expect(result).toEqual(false);
  });
});
