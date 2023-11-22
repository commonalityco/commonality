export const isObject = (item: unknown): item is Record<string, unknown> =>
  typeof item === 'object' && !Array.isArray(item) && item !== null;

/**
 * intersectObjects
 *
 * Takes two objects, source and target, and returns a new object with keys that exist in both source and target.
 * The values of the returned object will be that of the source object.
 * If the corresponding values are objects, it recursively matches their keys. Throws a TypeError if either parameter is not an object.
 *
 * @param {unknown} source - The source object to match keys from.
 * @param {unknown} target - The target object to match keys to.
 * @returns {T} - An object with keys that match between the source and target, with values from the source object.
 */
type AnyObject = {
  [key: string]: unknown;
};
export function intersectObjects(
  source: AnyObject,
  target: AnyObject,
): AnyObject {
  const result: AnyObject = {};

  for (const key in source) {
    if (key in target) {
      if (isObject(source[key]) && isObject(target[key])) {
        const matchedSubObject = intersectObjects(
          source[key] as AnyObject,
          target[key] as AnyObject,
        );
        if (Object.keys(matchedSubObject).length > 0) {
          result[key] = matchedSubObject;
        }
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}
