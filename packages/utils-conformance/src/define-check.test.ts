import { defineCheck } from './define-check';
import { describe, expect, it } from 'vitest';

const noArgsFn = () => ({
  name: 'test',
  message: `message`,
  validate: () => true,
});

const singleArgFn = (arg1: string) => ({
  name: 'test',
  message: `message ${arg1}`,
  validate: () => true,
});

const multiArgFn = (arg1: string, arg2?: Record<string, unknown>) => ({
  name: 'test',
  message: `message ${arg1} ${arg2}`,
  validate: () => true,
});

describe('defineCheck', () => {
  it('when passed no arguments return the function passed to it', async () => {
    const result = defineCheck(noArgsFn);
    expect(result).toBe(noArgsFn);
  });

  it('should return the function passed to it', async () => {
    const result = defineCheck(singleArgFn);
    expect(result).toBe(singleArgFn);
  });

  it('should correctly handle arguments when the returned function is called', async () => {
    const result = defineCheck(multiArgFn);

    expect(result).toBe(multiArgFn);
  });
});
