import type { FileCreator } from '@commonalityco/types';
import fs from 'fs-extra';

export const baseFile: FileCreator = (filepath, options = {}) => {
  return {
    delete: async () => {
      options.onDelete ? options.onDelete(filepath) : await fs.remove(filepath);
    },
    exists: async () => {
      return Boolean(options.defaultSource) || (await fs.pathExists(filepath));
    },
  };
};
