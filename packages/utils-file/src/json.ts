import { file, File } from './file';
import fs from 'fs-extra';
import isMatch from 'lodash-es/isMatch';
import merge from 'lodash-es/merge';
import omit from 'lodash-es/omit';
import detectIndent from 'detect-indent';
import path from 'pathe';

export interface JsonFile<T extends Record<string, unknown>>
  extends Omit<File, 'get'> {
  /**
   * Returns the contents of a JSON file as an object.
   * If the file does not exist or is not valid JSON, `undefined` will be returned.
   *
   * @example
   * const packageJson = await json(ctx.package.path, 'package.json').get();
   *
   * console.log(packageJson);
   * // {
   * //   "name": "my-package",
   * //   "version": "1.0.0",
   * // }
   */
  get: () => Promise<T | undefined>;
  /**
   * Returns a boolean value indicating whether or not the object is a subset of the JSON file's contents.
   * If the file does not exist or is not valid JSON, `false` will be returned.
   *
   * @param value - An object to check against the JSON file's contents.
   * @example
   * const containsValue = await json(ctx.package.path, 'package.json').contains({
   *   name: 'my-package',
   * });
   *
   * console.log(containsValue);
   *
   * // true
   */
  contains(value: Partial<Record<string, unknown>>): Promise<boolean>;
  /**
   * Overwrites the entire contents of a JSON file with the provided value.
   * If the file does not exist, it will be created.
   *
   * @param value - An object that will be used to overwrite the JSON file's contents.
   * @example
   * await json(ctx.package.path, 'package.json').set({
   *   name: 'my-package',
   *   version: '1.0.0',
   * });
   */
  set(value: Record<string, unknown>): Promise<void>;
  /**
   * Merges an object with the contents of a JSON file.
   * If the file has the same keys as the passed-in object, the values for those keys will be overwritten.
   * If the file does not exist, it will be created.
   *
   * @param value - An object that will be deeply merged with the JSON file's contents.
   * @example
   * await json(ctx.package.path, 'package.json').merge({
   *   private: true,
   * });
   */
  merge(value: Partial<Record<string, unknown>>): Promise<void>;

  /**
   * Removes a property from a JSON file using a lodash style object path.
   *
   * @param accessPath - A lodash-style path object that will be used to determine which property to remove.
   * @example
   * await json(ctx.package.path, 'package.json').remove('scripts.dev');
   *
   * await json(ctx.package.path, 'package.json').remove(`dependencies[${dependencyName}]`);
   */
  remove(path: string): Promise<void>;
}

/**
 *
 * The `json` utility provides methods for reading, writing, and manipulating JSON files with optional type safety.
 *
 * Documentation: https://docs.commonality.co/reference/json
 *
 * @example
 * const packageJson = await json(ctx.package.path, 'package.json').get();
 *
 * console.log(packageJson);
 * // {
 * //   "name": "my-package",
 * //   "version": "1.0.0",
 * // }
 */
export function json<T extends Record<string, unknown>>(
  rootPath: string,
  filePath: string,
): JsonFile<T> {
  const fullPath = path.join(rootPath, filePath);

  const rawFile = file(fullPath);

  const _exists = rawFile.exists();

  const getText = async (): Promise<string | undefined> => {
    return (await _exists) ? await fs.readFile(fullPath, 'utf8') : undefined;
  };

  const _text = getText();

  const writeFile = async (json: Record<string, unknown>) => {
    const text = await _text;
    const defaultIndent = '    ';
    const indent = text
      ? detectIndent(text).indent || defaultIndent
      : defaultIndent;

    await fs.outputFile(fullPath, JSON.stringify(json, undefined, indent));
  };

  const getJson = async (): Promise<T | undefined> => {
    const data = await rawFile.get();

    if (!data) {
      return;
    }

    try {
      return JSON.parse(data);
    } catch {
      return;
    }
  };

  return {
    ...rawFile,

    async get() {
      try {
        return await getJson();
      } catch {
        return;
      }
    },

    async contains(value) {
      try {
        const exists = await _exists;

        if (!exists) {
          return false;
        }

        const data = await getJson();

        if (!data) {
          return false;
        }

        return isMatch(data, value);
      } catch {
        return false;
      }
    },
    async merge(value) {
      try {
        const json = await getJson();
        const updatedJson = merge(json, value);

        await writeFile(updatedJson);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }

        throw error;
      }
    },

    async set(value) {
      if (!value) {
        return;
      }

      await writeFile(value);
    },

    async remove(accessPath: string) {
      try {
        const json = await getJson();

        if (!json) {
          return;
        }

        const updatedJson = omit(json, accessPath) as T;

        await writeFile(updatedJson);
      } catch {
        return;
      }
    },
  } satisfies JsonFile<T>;
}
