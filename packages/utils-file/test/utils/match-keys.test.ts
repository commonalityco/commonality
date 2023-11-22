import { describe, expect, it } from 'vitest';
import { isObject, intersectObjects } from '../../src/utils/intersect-objects';

describe('intersectObjects', () => {
  it('should return an empty object when both source and target are empty', () => {
    const source = {};
    const target = {};
    const result = intersectObjects(source, target);
    expect(result).toEqual({});
  });

  it('should return an empty object when source is empty', () => {
    const source = {};
    const target = { key1: 'value1', key2: 'value2' };
    const result = intersectObjects(source, target);
    expect(result).toEqual({});
  });

  it('should return an empty object when target is empty', () => {
    const source = { key1: 'value1', key2: 'value2' };
    const target = {};
    const result = intersectObjects(source, target);
    expect(result).toEqual({});
  });

  it('should return an object with keys that exist in both source and target', () => {
    const source = { key1: 'value1', key2: 'value2' };
    const target = { key1: 'value3', key3: 'value4' };
    const result = intersectObjects(source, target);
    expect(result).toEqual({ key1: 'value1' });
  });

  it('should recursively match keys when the corresponding values are objects', () => {
    const source = { key1: { subKey1: 'value1', subKey2: 'value2' } };
    const target = { key1: { subKey1: 'value3', subKey3: 'value4' } };
    const result = intersectObjects(source, target);
    expect(result).toEqual({ key1: { subKey1: 'value1' } });
  });
});
