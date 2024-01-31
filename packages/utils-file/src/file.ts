import fs from 'fs-extra';

export interface File {
  get: () => Promise<string | undefined>;
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
}

export function file(filepath: string): File {
  const _exists = fs.pathExists(filepath);

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
      await fs.remove(filepath);
    },
    exists: async () => {
      try {
        return await _exists;
      } catch {
        return false;
      }
    },
  } satisfies File;
}
