import { JsonFileReader } from '@commonalityco/types';
import get from 'lodash-es/get';
import isMatch from 'lodash-es/isMatch';
import fs from 'fs-extra';

export const jsonReader = (
  filepath: string,
  options: { defaultSource?: Record<string, unknown> } = {},
): JsonFileReader => {
  const getExists = async () =>
    Boolean(options.defaultSource) || (await fs.pathExists(filepath));
  const getSource = async () =>
    options.defaultSource || (await fs.readJSON(filepath));

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
    async exists() {
      try {
        return await getExists();
      } catch (error) {
        console.error(`Error checking if file exists: ${error}`);
        return false;
      }
    },
  };
};
