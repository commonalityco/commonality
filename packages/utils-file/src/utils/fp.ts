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

export function get<T extends Record<string, unknown>, V extends JSONValue>(
  obj: T,
  path: string,
  defaultValue?: V,
) {
  if (!path) return;

  const pathArray = toPathParts(path);

  if (!pathArray) return;

  let result: unknown = obj;

  for (const key of pathArray) {
    if (result === undefined) break;
    result = (result as Record<string, unknown>)[key];
  }

  return result === undefined ? defaultValue : (result as V);
}
