import { isMatch, merge } from '@commonalityco/utils-fp';
import type {
  JsonFileWriter as JsonFileWriterType,
  JsonFileReader as JsonFileReaderType,
  JSONValue,
} from '@commonalityco/types';
import fs from 'fs-extra';
import detectIndent from 'detect-indent';
import { get, set, omit } from './utils/fp.js';

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

export const createJsonFileWriter = (filepath: string): JsonFileWriterType => {
  return {
    async merge(value: Record<string, unknown>): Promise<void> {
      try {
        const jsonRaw = await fs.readFile(filepath, 'utf8');
        const json = await fs.readJSON(filepath);
        const updatedJson = merge(json, value);
        const indent = detectIndent(jsonRaw).indent || '    ';

        const formattedJson = JSON.stringify(updatedJson, undefined, indent);

        await fs.outputFile(filepath, formattedJson);
      } catch {
        return;
      }
    },

    async set(
      pathOrValue: string | Record<string, JSONValue>,
      value?: JSONValue | undefined,
    ): Promise<void> {
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
