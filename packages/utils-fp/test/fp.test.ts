export * from '../src/fp';
import { describe, expect, it } from 'vitest';
import { matchKeys } from '../src/fp';

describe('matchKeys', () => {
  it('should return an object with matching keys', () => {
    const source = { a: 1, b: 2, c: 3 };
    const target = { a: 10, b: 20 };
    const result = matchKeys(source, target);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should return an empty object if no keys match', () => {
    const source = { a: 1, b: 2, c: 3 };
    const target = { d: 10, e: 20 };
    const result = matchKeys(source, target);

    expect(result).toEqual({});
  });

  it('should return an object with matching nested keys', () => {
    const source = { a: 1, b: { c: 2, d: 3 } };
    const target = { b: { c: 20 } };
    const result = matchKeys(source, target);

    expect(result).toEqual({ b: { c: 2 } });
  });

  it('should not return nested objects that do not match the source object', () => {
    const source = { a: 1, b: { c: 2, d: 3 } };
    const target = { a: 1, b: { e: 20 } };
    const result = matchKeys(source, target);

    expect(result).toEqual({ a: 1 });
  });
});
