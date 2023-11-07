import type {
  JsonFile as JsonFileType,
  JsonFileCreator,
  Workspace,
  JSONValue,
} from '@commonalityco/types';
import { File } from './file.js';
import fs from 'fs-extra';
import detectIndent from 'detect-indent';
import { get, set, omit } from './utils/fp.js';

class JsonFile extends File implements JsonFileType {
  constructor(workspace: Workspace, rootDirectory: string, filename: string) {
    super(workspace, rootDirectory, filename);
  }

  async get(accessPath?: string) {
    try {
      const json = await fs.readJSON(this.filepath);

      if (!accessPath) {
        return json;
      }

      return get(json, accessPath);
    } catch {
      return;
    }
  }

  async set(
    pathOrValue: string | Record<string, JSONValue>,
    value?: JSONValue | undefined,
  ): Promise<void> {
    try {
      const jsonRaw = await fs.readFile(this.filepath, 'utf8');
      const json = await fs.readJSON(this.filepath);

      const updatedJson =
        typeof pathOrValue === 'string' && value !== undefined
          ? set(json, pathOrValue, value)
          : (pathOrValue as JSONValue);
      const indent = detectIndent(jsonRaw).indent || '    ';

      const formattedJson = JSON.stringify(updatedJson, undefined, indent);

      await fs.outputFile(this.filepath, formattedJson);
    } catch {
      return;
    }
  }

  async remove(accessPath: string) {
    try {
      const json = await fs.readJSON(this.filepath);
      const updatedJson = omit(json, accessPath);

      await fs.outputJSON(this.filepath, updatedJson);
    } catch {
      return;
    }
  }
}

export const createJson = ({
  workspace,
  rootDirectory,
}: {
  workspace: Workspace;
  rootDirectory: string;
}): JsonFileCreator => {
  return (filename: string) => new JsonFile(workspace, rootDirectory, filename);
};
