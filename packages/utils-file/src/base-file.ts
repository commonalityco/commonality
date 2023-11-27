import { File } from '@commonalityco/types';
import fs from 'fs-extra';

export const baseFile = (
  filepath: string,
  options: {
    onDelete?: (filePath: string) => Promise<void> | void;
    onExists?: (filePath: string) => Promise<boolean> | boolean;
  } = {},
): File => {
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
