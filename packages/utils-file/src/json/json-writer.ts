import { JsonFileWriter } from '@commonalityco/types';
import fs from 'fs-extra';
import omit from 'lodash-es/omit';
import merge from 'lodash-es/merge';

export const jsonWriter = (
  filepath: string,
  options: {
    onDelete?: (filePath: string) => Promise<void>;
    onWrite?: (filePath: string, data: unknown) => Promise<void>;
    defaultSource?: Record<string, unknown>;
  } = {},
): JsonFileWriter => {
  const getExists = async () =>
    Boolean(options.defaultSource) || (await fs.pathExists(filepath));

  const getSource = async () =>
    options.defaultSource ||
    ((await getExists()) ? await fs.readJSON(filepath) : {});

  const writeFile = async (json: unknown) =>
    options.onWrite
      ? options.onWrite(filepath, json)
      : await fs.outputJSON(filepath, json);

  const deleteFile = async () =>
    options.onDelete ? options.onDelete(filepath) : await fs.remove(filepath);

  return {
    async update(value): Promise<void> {
      try {
        const exists = await getExists();

        if (!exists || !value) {
          return;
        }

        const json = await getSource();

        const updateRecursive = <T extends Record<string, unknown>>(
          source: T,
          target: T,
        ): void => {
          for (const key of Object.keys(target)) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              if (
                typeof target[key] === 'object' &&
                target[key] !== null &&
                !Array.isArray(target[key])
              ) {
                updateRecursive(source[key] as T, target[key] as T);
              } else {
                (source as Record<string, unknown>)[key] = target[key];
              }
            }
          }
        };

        updateRecursive(json, value);

        await writeFile(json);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }

        throw error;
      }
    },

    async merge(value): Promise<void> {
      try {
        const json = await getSource();
        const updatedJson = merge(json, value);

        await writeFile(updatedJson);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }

        throw error;
      }
    },

    async set(value): Promise<void> {
      try {
        await writeFile(value);
      } catch {
        return;
      }
    },

    async remove(accessPath: string) {
      try {
        const json = await getSource();
        const updatedJson = omit(json, accessPath);

        await writeFile(updatedJson);
      } catch {
        return;
      }
    },
    async delete(): Promise<void> {
      try {
        await deleteFile();
      } catch (error) {
        console.error(`Error deleting file: ${error}`);
      }
    },
  };
};
