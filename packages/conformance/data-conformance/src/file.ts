import fs from 'fs-extra';

export interface File {
  get: () => Promise<string | undefined>;
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
}

export function file(filePath: string): File {
  const _exists = fs.pathExists(filePath);

  const get = async () => {
    const exists = await _exists;

    if (!exists) {
      return;
    }

    return fs.readFile(filePath, 'utf8');
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
      await fs.remove(filePath);
    },
    exists: async () => {
      const foo = await _exists;

      return foo;
    },
  } satisfies File;
}
