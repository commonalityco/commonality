import fs from 'fs-extra';

export interface File {
  get: () => Promise<string | undefined>;
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
}

export interface FileOptions {
  onDelete?: (filepath: string) => Awaitable<void>;
  onExists?: (filepath: string) => Awaitable<boolean>;
}

type Awaitable<T> = T | PromiseLike<T>;

export function file(filepath: string, options: FileOptions = {}): File {
  const _exists = options.onExists
    ? options.onExists(filepath)
    : fs.pathExists(filepath);

  const get = async () => {
    const exists = await _exists;

    if (!exists) {
      return;
    }

    return fs.readFile(filepath, 'utf8');
  };

  return {
    get: async () => {
      try {
        return await get();
      } catch {
        return;
      }
    },
    delete: async () => {
      options.onDelete ? options.onDelete(filepath) : await fs.remove(filepath);
    },
    exists: async () => {
      const foo = await _exists;

      return foo;
    },
  } satisfies File;
}
