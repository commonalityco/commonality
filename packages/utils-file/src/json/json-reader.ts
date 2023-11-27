import isMatch from 'lodash-es/isMatch';
import fs from 'fs-extra';
import { JsonFile } from '@commonalityco/types';

export const jsonReader = (
  filepath: string,
  options: {
    onExists?: (filepath: string) => Promise<boolean> | boolean;
    onRead?: (
      filepath: string,
    ) => Record<string, unknown> | Promise<Record<string, unknown>>;
  } = {},
): Pick<JsonFile, 'get' | 'contains'> => {
  const getExists = async (): Promise<boolean> => {
    if (options.onExists) {
      return options.onExists(filepath);
    }

    return fs.pathExists(filepath);
  };
  const _exists = getExists();

  const getSource = async () => {
    if (options.onRead) {
      return options.onRead(filepath);
    }

    return fs.readJSON(filepath);
  };

  return {
    async get() {
      try {
        const exists = await _exists;

        if (!exists) {
          return;
        }

        const source = await getSource();

        return source;
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

        const source = await getSource();

        return isMatch(source, value);
      } catch {
        return false;
      }
    },
  };
};
