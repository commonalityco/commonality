export * from '../src/fp';
import { describe, expect, it } from 'vitest';
import {
  toPathParts,
  omit,
  set,
  get,
  isEqual,
  merge,
  isMatch,
} from '../src/fp';

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

describe('isEqual', () => {
  it('should return true for equal JSONValues', () => {
    const value1 = { a: { b: { c: 1 } } };
    const value2 = { a: { b: { c: 1 } } };
    const result = isEqual(value1, value2);
    expect(result).toBe(true);
  });

  it('should return false for unequal JSONValues', () => {
    const value1 = { a: { b: { c: 1 } } };
    const value2 = { a: { b: { c: 2 } } };
    const result = isEqual(value1, value2);
    expect(result).toBe(false);
  });
});

describe('merge', () => {
  it('should correctly merge two objects', () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { c: 2 } };
    const result = merge(obj1, obj2);

    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it('should overwrite properties in the first object with the second', () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { b: 2 } };
    const result = merge(obj1, obj2);

    expect(result).toEqual({ a: { b: 2 } });
  });

  it('should not mutate the original objects', () => {
    const obj1 = { a: { b: 1 } };
    const obj2 = { a: { c: 2 } };

    expect(obj1).toEqual({ a: { b: 1 } });
    expect(obj2).toEqual({ a: { c: 2 } });
  });
});

describe('isMatch', () => {
  it('should return true if objects match', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    const result = isMatch(obj1, obj2);

    expect(result).toBe(true);
  });

  it('should return true if the value is a subset of the object', () => {
    const obj1 = { a: 1, b: { c: 1, d: 1 } };
    const obj2 = { a: 1, b: { c: 1 } };
    const result = isMatch(obj1, obj2);

    expect(result).toBe(true);
  });

  it('should return false if objects do not match', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 2, b: 3 };
    const result = isMatch(obj1, obj2);

    expect(result).toBe(false);
  });
});
