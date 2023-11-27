import get from 'lodash-es/get';
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
  const getSource = async () => {
    if (options.onRead) {
      return options.onRead(filepath);
    }

    return fs.readJSON(filepath);
  };

  return {
    async get(accessPath?: string) {
      try {
        const source = await getSource();

        if (!accessPath) {
          return source;
        }

        return get(source, accessPath);
      } catch {
        return;
      }
    },

    async contains(value) {
      try {
        const source = await getSource();

        return isMatch(source, value);
      } catch {
        return false;
      }
    },
  };
};
