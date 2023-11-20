import {
  isMatch,
  merge,
  get,
  set,
  omit,
  matchKeys,
  isEqual,
} from '@commonalityco/utils-fp';
import type {
  JsonFileWriter as JsonFileWriterType,
  JsonFileReader as JsonFileReaderType,
  JSONValue,
  JsonFileFormatter,
} from '@commonalityco/types';
import fs from 'fs-extra';
import detectIndent from 'detect-indent';
import { diff as jestDiff } from 'jest-diff';
import chalk from 'chalk';

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
    async merge(value): Promise<void> {
      try {
        const exists = await fs.pathExists(filepath);
        const json = exists ? await fs.readJSON(filepath) : {};
        const updatedJson = merge(json, value);

        await fs.outputJSON(filepath, updatedJson);
      } catch (error: unknown) {
        console.log({ writeError: error });
        if (error instanceof Error) {
          throw new WriteError(error.message);
        }

        throw error;
      }
    },

    async set(pathOrValue, value?: JSONValue | undefined): Promise<void> {
      try {
        const jsonRaw = await fs.readFile(filepath, 'utf8');
        const json = await fs.readJSON(filepath);

        const updatedJson =
          typeof pathOrValue === 'string' && value !== undefined
            ? set(json, pathOrValue, value)
            : (pathOrValue as JSONValue);
        const indent = detectIndent(jsonRaw).indent || '    ';

        const formattedJson = JSON.stringify(updatedJson, undefined, indent);

        await fs.outputFile(filepath, formattedJson);
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
    async diffPartial(value) {
      const json = await fs.readJSON(filepath);
      const jsonSubset = matchKeys(json, value);
      const valueSubset = matchKeys(value, json);

      if (!jsonSubset || Object.keys(jsonSubset).length === 0) {
        return chalk.dim(`No match found`);
      }

      if (isEqual(jsonSubset, valueSubset)) {
        return chalk.dim(chalk.green(JSON.stringify(jsonSubset, undefined, 2)));
      }

      if (isMatch(json, value)) {
        return chalk.dim(chalk.green(JSON.stringify(jsonSubset, undefined, 2)));
      }

      const isValueSuperset = isMatch(value, json);

      const result = jestDiff(jsonSubset, valueSubset, {
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
    async diff(value) {
      const json = await fs.readJSON(filepath);

      if (isEqual(json, value)) {
        return chalk.dim(chalk.green(JSON.stringify(json, undefined, 2)));
      }

      const isValueSuperset = isMatch(value, json);

      const result = jestDiff(json, value, {
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
  };
};
