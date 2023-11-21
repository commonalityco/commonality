import { matchKeys } from '@commonalityco/utils-fp';
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

export function containsPartial<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(source: T, target: U): boolean {
  if (!source || !target) {
    return false;
  }

  // Base condition to handle non-object types
  if (typeof target !== 'object' || target === null) {
    return source === target;
  }

  // Iterate over keys in the target object
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        // If the key exists in the source and both are objects, recursively check
        if (
          key in source &&
          typeof source[key] === 'object' &&
          source[key] !== null
        ) {
          if (
            !containsPartial(
              source[key] as Record<string, unknown>,
              target[key] as Record<string, unknown>,
            )
          ) {
            return false;
          }
        } else {
          // Key exists in target but not as an object in source, or doesn't exist at all
          return false;
        }
      } else {
        // Indirect value comparison
        if (!(key in source) || !isEqual(source[key], target[key])) {
          return false;
        }
      }
    }
  }

  return true;
}

export const createJsonFileReader = (filepath: string): JsonFileReaderType => {
  return {
    async get(accessPath?: string) {
      try {
        const json = await fs.readJSON(filepath);

        if (!accessPath) {
          return json;
        }

        return get(json, accessPath);
      } catch {
        return;
      }
    },

    async contains(value) {
      try {
        const json = await fs.readJSON(filepath);

        return isMatch(json, value);
      } catch {
        return false;
      }
    },
    async containsPartial(value) {
      try {
        const json = await fs.readJSON(filepath);

        return containsPartial(json, value);
      } catch {
        return false;
      }
    },
    async exists() {
      try {
        return await fs.pathExists(filepath);
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

export const createJsonFileWriter = (filepath: string): JsonFileWriterType => {
  return {
    async update(value): Promise<void> {
      try {
        const exists = await fs.pathExists(filepath);

        if (!exists || !value) {
          return;
        }

        const json = await fs.readJSON(filepath);

        const updateRecursive = <T extends Record<string, unknown>>(
          src: T,
          tgt: T,
        ): void => {
          for (const key of Object.keys(tgt)) {
            if (Object.prototype.hasOwnProperty.call(src, key)) {
              if (
                typeof tgt[key] === 'object' &&
                tgt[key] !== null &&
                !Array.isArray(tgt[key])
              ) {
                updateRecursive(src[key] as T, tgt[key] as T);
              } else {
                (src as Record<string, unknown>)[key] = tgt[key];
              }
            }
          }
        };

        updateRecursive(json, value);

        await fs.outputJSON(filepath, json);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new WriteError(error.message);
        }

        throw error;
      }
    },

    async merge(value): Promise<void> {
      try {
        const exists = await fs.pathExists(filepath);
        const json = exists ? await fs.readJSON(filepath) : {};
        const updatedJson = merge(json, value);

        await fs.outputJSON(filepath, updatedJson);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new WriteError(error.message);
        }

        throw error;
      }
    },

    async set(value): Promise<void> {
      try {
        await fs.outputJSON(filepath, value);
      } catch {
        return;
      }
    },

    async remove(accessPath: string) {
      try {
        const json = await fs.readJSON(filepath);
        const updatedJson = omit(json, accessPath);

        await fs.outputJSON(filepath, updatedJson);
      } catch {
        return;
      }
    },
    async delete(): Promise<void> {
      try {
        await fs.remove(filepath);
      } catch (error) {
        console.error(`Error deleting file: ${error}`);
      }
    },
  };
};

export const createJsonFileFormatter = (
  filepath: string,
): JsonFileFormatter => {
  return {
    async diff(value) {
      const json = await fs.readJSON(filepath);
      const isValueSuperset = isMatch(value, json);
      const source = isValueSuperset ? json : matchKeys(json, value);

      if (!source || Object.keys(source).length === 0) {
        return chalk.dim(`No match found`);
      }

      if (isEqual(source, value)) {
        return chalk.dim(chalk.green(JSON.stringify(source, undefined, 2)));
      }

      if (isMatch(json, value)) {
        return chalk.dim(chalk.green(JSON.stringify(source, undefined, 2)));
      }

      const target = isValueSuperset ? value : matchKeys(value, json);

      if (target === source) {
        return chalk.dim(chalk.green(JSON.stringify(source, undefined, 2)));
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
      const json = await fs.readJSON(filepath);

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
      const json = await fs.readJSON(filepath);

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
