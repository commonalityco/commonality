import { JSONValue } from '@commonalityco/types';
import {
  deletedDiff as deletedDiffUtil,
  updatedDiff as updatedDiffUtil,
} from 'deep-object-diff';

export const toPathParts = (path: string) => path.match(/([^.[\]])+/g);

export function omit<T extends Record<string, unknown>>(
  obj: T,
  ...paths: string[]
): Partial<T> {
  const result = { ...obj };

  for (const path of paths) {
    const pathParts = toPathParts(path);

    if (!pathParts) continue;

    let currentObj: Record<string, unknown> | T = result;

    for (let i = 0; i < pathParts.length; i++) {
      const key = pathParts[i] as keyof T;

      if (i === pathParts.length - 1) {
        delete (currentObj as T)[key];
      } else {
        currentObj = (currentObj as T)[key] as Record<string, unknown>;
      }
    }
  }

  return result as Partial<T>;
}

export function set<T extends Record<string, unknown>, V extends JSONValue>(
  obj: T,
  path: string,
  value: V,
): T {
  const pathParts = toPathParts(path);

  if (!pathParts) return obj;

  let currentObj: Record<string, unknown> | T = obj;

  for (let i = 0; i < pathParts.length; i++) {
    const key = pathParts[i] as keyof T;

    if (i === pathParts.length - 1) {
      (currentObj as T)[key] = value as T[keyof T];
    } else {
      currentObj = ((currentObj as T)[key] || {}) as Record<string, unknown>;
    }
  }

  return obj;
}

export function get<T extends Record<string, JSONValue>, V extends JSONValue>(
  obj: T,
  path: string,
  defaultValue?: V,
): JSONValue {
  if (!path) {
    throw new Error('Path is required');
  }

  const pathArray = toPathParts(path);

  if (!pathArray) {
    throw new Error('Invalid path');
  }

  let result: JSONValue = obj;

  for (const key of pathArray) {
    if (result === undefined) break;
    result = (result as Record<string, JSONValue>)[key];
  }

  return result === undefined && defaultValue ? defaultValue : (result as V);
}

export function isEqual(value: unknown, other: unknown): boolean {
  if (typeof value !== typeof other) return false;

  if (typeof value === 'object' && value !== null && other !== null) {
    const valueKeys = Object.keys(value as Record<string, unknown>);
    const otherKeys = Object.keys(other as Record<string, unknown>);

    if (valueKeys.length !== otherKeys.length) return false;

    for (const key of valueKeys) {
      if (
        !isEqual(
          (value as Record<string, unknown>)[key],
          (other as Record<string, unknown>)[key],
        )
      )
        return false;
    }

    return true;
  }

  return value === other;
}

export function isMatch(
  superObj: Record<string, unknown>,
  subObj: Record<string, unknown>,
): boolean {
  return Object.keys(subObj).every((ele) => {
    if (typeof subObj[ele] == 'object') {
      return isMatch(
        superObj[ele] as Record<string, unknown>,
        subObj[ele] as Record<string, unknown>,
      );
    }
    return subObj[ele] === superObj[ele];
  });
}

export const isObject = (item: unknown): item is Record<string, unknown> =>
  typeof item === 'object' && !Array.isArray(item) && item !== null;

export function merge<
  T extends Record<string, unknown>,
  S extends Record<string, unknown>,
>(object: T, source: S): T {
  const result: T = { ...object };

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const sourceValue = source[key];
    const objectValue = object[key];

    const shouldMerge =
      isObject(sourceValue) &&
      Object.prototype.hasOwnProperty.call(object, key) &&
      isObject(objectValue);

    result[key as keyof T] = shouldMerge
      ? (merge(
          objectValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>,
        ) as unknown as T[keyof T])
      : (sourceValue as unknown as T[keyof T]);
  }

  return result;
}

export const deletedDiff = (
  sourceItem: unknown,
  comparedItem: unknown,
): object => {
  if (!isObject(sourceItem)) {
    throw new TypeError('sourceItem must be an object');
  }

  if (!isObject(comparedItem)) {
    throw new TypeError('comparedItem must be an object');
  }

  return deletedDiffUtil(sourceItem, comparedItem);
};

export const updatedDiff = (
  sourceItem: unknown,
  comparedItem: unknown,
): object => {
  if (!isObject(sourceItem)) {
    throw new TypeError('sourceItem must be an object');
  }

  if (!isObject(comparedItem)) {
    throw new TypeError('comparedItem must be an object');
  }

  return updatedDiffUtil(sourceItem, comparedItem);
};

/**
 * matchKeys
 *
 * Takes two objects, source and target, and returns a new object with keys that exist in both source and target.
 * The values of the returned object will be that of the source object.
 * If the corresponding values are objects, it recursively matches their keys. Throws a TypeError if either parameter is not an object.
 *
 * @param {unknown} source - The source object to match keys from.
 * @param {unknown} target - The target object to match keys to.
 * @returns {T} - An object with keys that match between the source and target, with values from the source object.
 */
export const matchKeys = <
  T extends Record<string, unknown>,
  K extends Record<string, unknown>,
>(
  source: T,
  target: K,
): Partial<T> => {
  if (!isObject(source)) {
    throw new TypeError('source must be an object');
  }

  if (!isObject(target)) {
    throw new TypeError('target must be an object');
  }

  const result: Partial<T> = {};

  for (const key in target) {
    if (key in source) {
      const sourceValue = source[key];
      const targetValue = target[key];

      result[key as keyof T] =
        isObject(targetValue) && isObject(sourceValue)
          ? (matchKeys(sourceValue, targetValue) as T[keyof T])
          : sourceValue;
    }
  }

  return result;
};
