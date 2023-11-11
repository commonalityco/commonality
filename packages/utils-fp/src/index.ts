import { JSONValue } from '@commonalityco/types';

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
  object: Record<string, unknown>,
  source: Record<string, unknown>,
): boolean {
  const keys = Object.keys(source);

  for (const key of keys) {
    if (
      !Object.prototype.hasOwnProperty.call(object, key) ||
      !isEqual(object[key], source[key])
    ) {
      return false;
    }
  }

  return true;
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
