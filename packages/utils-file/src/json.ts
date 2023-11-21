import { matchKeys } from './utils/match-keys';
import isEqual from 'lodash-es/isEqual';
import get from 'lodash-es/get';
import merge from 'lodash-es/merge';
import isMatch from 'lodash-es/isMatch';
import omit from 'lodash-es/omit';
import type {
  JsonFileWriter as JsonFileWriterType,
  JsonFileReader as JsonFileReaderType,
  JsonFileFormatter,
} from '@commonalityco/types';
import fs from 'fs-extra';
import { diff as jestDiff } from 'jest-diff';
import chalk from 'chalk';

export const createJsonFileReader = (
  filepath: string,
  options: { defaultSource?: Record<string, unknown> } = {},
): JsonFileReaderType => {
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

class WriteError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = 'WriteError';
  }
}

export const createJsonFileWriter = (
  filepath: string,
  options: {
    onDelete?: (filePath: string) => Promise<void>;
    onWrite?: (filePath: string, data: unknown) => Promise<void>;
    defaultSource?: Record<string, unknown>;
  } = {},
): JsonFileWriterType => {
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
          throw new WriteError(error.message);
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
          throw new WriteError(error.message);
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

export const createJsonFileFormatter = (
  filepath: string,
  options: { defaultSource?: Record<string, unknown> } = {},
): JsonFileFormatter => {
  const getExists = async () =>
    Boolean(options.defaultSource) ?? (await fs.pathExists(filepath));
  const getSource = async () => {
    return options.defaultSource ?? (await fs.readJSON(filepath)) ?? {};
  };

  return {
    async diff(value) {
      const sourceData = await getSource();
      const isValueSuperset = isMatch(value, sourceData);
      const source = isValueSuperset
        ? sourceData
        : matchKeys(sourceData, value);

      if (!source || Object.keys(source).length === 0) {
        return chalk.dim(`No match found`);
      }

      if (isEqual(source, value)) {
        return chalk.dim(chalk.green(JSON.stringify(source, undefined, 2)));
      }

      if (isMatch(sourceData, value)) {
        return chalk.dim(chalk.green(JSON.stringify(source, undefined, 2)));
      }

      const target = isValueSuperset ? value : matchKeys(value, sourceData);

      if (isEqual(source, target)) {
        return chalk.dim(chalk.green(JSON.stringify(target, undefined, 2)));
      }

      const result = jestDiff(source, target, {
        omitAnnotationLines: true,
        aColor: chalk.dim,
        bColor: chalk.red,
        changeColor: chalk.red,
        commonColor: chalk.green.dim,
        aIndicator: ' ',
        bIndicator: isValueSuperset ? '+' : '-',
      });

      return result || undefined;
    },

    async diffAdded(value) {
      const json = await getSource();

      if (isEqual(json, value)) {
        return chalk.dim(chalk.green(JSON.stringify(json, undefined, 2)));
      }

      const result = jestDiff(json, value, {
        omitAnnotationLines: true,
        aColor: chalk.dim,
        bColor: chalk.red,
        changeColor: chalk.red,
        commonColor: chalk.green.dim,
        aIndicator: ' ',
        bIndicator: '+',
      });

      return result || undefined;
    },

    async diffRemoved(value) {
      const json = await getSource();

      if (isEqual(json, value)) {
        return chalk.dim(chalk.green(JSON.stringify(json, undefined, 2)));
      }

      const result = jestDiff(json, value, {
        omitAnnotationLines: true,
        aColor: chalk.dim,
        bColor: chalk.red,
        changeColor: chalk.red,
        commonColor: chalk.green.dim,
        aIndicator: ' ',
        bIndicator: '-',
      });

      return result || undefined;
    },
  };
};
