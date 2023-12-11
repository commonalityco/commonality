import { file, File } from './file';
import fs from 'fs-extra';
import omit from 'lodash-es/omit';
import merge from 'lodash-es/merge';
import isMatch from 'lodash-es/isMatch';
import detectIndent from 'detect-indent';

type Data = Record<string, unknown>;

export interface JsonFile<T extends Data> extends Omit<File, 'get'> {
  get: () => Promise<T | undefined>;
  contains(value: Partial<Data>): Promise<boolean>;
  set(value: Data): Promise<void>;
  merge(value: Partial<Data>): Promise<void>;
  remove(path: string): Promise<void>;
}

export function json<T extends Data>(filepath: string): JsonFile<T> {
  const rawFile = file(filepath);

  const _exists = rawFile.exists();

  const getText = async (): Promise<string | undefined> => {
    return (await _exists) ? await fs.readFile(filepath, 'utf8') : undefined;
  };

  const _text = getText();

  const writeFile = async (json: Data) => {
    const text = await _text;
    const defaultIndent = '    ';
    const indent = text
      ? detectIndent(text).indent || defaultIndent
      : defaultIndent;

    await fs.writeFile(filepath, JSON.stringify(json, undefined, indent));
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
