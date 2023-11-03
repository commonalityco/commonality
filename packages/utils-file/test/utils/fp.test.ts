import { describe, expect, it } from 'vitest';
import { toPathParts, omit, set, get } from '../../src/utils/fp';

describe('toPathParts', () => {
  it('should correctly split path into parts', () => {
    const result = toPathParts('path.to.property');
    expect(result).toEqual(['path', 'to', 'property']);
  });

  it('should correctly split path with brackets into parts', () => {
    const result = toPathParts('path[to]property');
    expect(result).toEqual(['path', 'to', 'property']);
  });

  it('should return null for empty path', () => {
    const result = toPathParts('');
    expect(result).toBeNull();
  });
});

describe('omit', () => {
  it('should correctly omit property from object', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = omit(obj, 'a.b');
    expect(result).toEqual({ a: {} });
  });

  it('should return same object if path is not found', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = omit(obj, 'a.d');
    expect(result).toEqual(obj);
  });
});

describe('set', () => {
  it('should correctly set property in object', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = set(obj, 'a.b', 2);
    expect(result).toEqual({ a: { b: 2 } });
  });

  it('should add property if it does not exist', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = set(obj, 'a.d', 2);
    expect(result).toEqual({ a: { b: { c: 1 }, d: 2 } });
  });
});

describe('get', () => {
  it('should correctly get property from object', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = get(obj, 'a.b');
    expect(result).toEqual({ c: 1 });
  });

  it('should return undefined if property does not exist', () => {
    const obj = { a: { b: { c: 1 } } };
    const result = get(obj, 'a.d');
    expect(result).toBeUndefined();
  });
});
