import { file, File } from './file';
import fs from 'fs-extra';
import { isMatch, merge, omit } from 'lodash-es';
import detectIndent from 'detect-indent';
import path from 'pathe';

type Data = Record<string, unknown>;

export interface JsonFile<T extends Data> extends Omit<File, 'get'> {
  get: () => Promise<T | undefined>;
  contains(value: Partial<Data>): Promise<boolean>;
  set(value: Data): Promise<void>;
  merge(value: Partial<Data>): Promise<void>;
  remove(path: string): Promise<void>;
}

export function json<T extends Data>(
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

  const writeFile = async (json: Data) => {
    const text = await _text;
    const defaultIndent = '    ';
    const indent = text
      ? detectIndent(text).indent || defaultIndent
      : defaultIndent;

    await fs.writeFile(fullPath, JSON.stringify(json, undefined, indent));
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
