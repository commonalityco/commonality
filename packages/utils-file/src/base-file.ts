import type { FileCreator } from '@commonalityco/types';
import fs from 'fs-extra';

export const baseFile: FileCreator<unknown> = (
  filepath: string,
  options: {
    defaultSource?: unknown;
    onDelete?: (filePath: string) => Promise<void> | void;
    onExists?: (filePath: string) => Promise<boolean> | boolean;
  } = {},
) => {
  const exists = async () =>
    options.onExists
      ? options.onExists(filepath)
      : await fs.pathExists(filepath);

  return {
    delete: async () => {
      options.onDelete ? options.onDelete(filepath) : await fs.remove(filepath);
    },
    exists: async () => {
      return await exists();
    },
  };
};
