import type {
  YamlFile as YamlFileType,
  YamlFileCreator,
  Workspace,
} from '@commonalityco/types';
import { File } from './file.js';
import fs from 'fs-extra';
import yaml from 'yaml';
import get from 'lodash.get';
import set from 'lodash.set';
import omit from 'lodash.omit';

class YamlFile extends File implements YamlFileType {
  constructor(workspace: Workspace, rootDirectory: string, filename: string) {
    super(workspace, rootDirectory, filename);
  }

  async get(accessPath?: string) {
    try {
      const file = await fs.readFile(this.filepath, 'utf8');
      const yamlData = yaml.parse(file);

      if (!accessPath) {
        return yamlData;
      }

      return get(yamlData, accessPath);
    } catch {
      return;
    }
  }

  async set(
    pathOrValue: string | Record<string, unknown>,
    defaultValue?: string,
  ) {
    try {
      if (typeof pathOrValue === 'string') {
        const yamlData = await this.get();
        const updatedYaml = set(yamlData, pathOrValue, defaultValue);

        await fs.writeFile(this.filepath, yaml.stringify(updatedYaml), 'utf8');
      } else {
        await fs.writeFile(this.filepath, yaml.stringify(pathOrValue), 'utf8');
      }
    } catch (error) {
      console.error(`Failed to set value in YAML file: ${error}`);
      throw error;
    }
  }

  async remove(accessPath: string) {
    try {
      const yamlData = await this.get();
      const updatedYaml = omit(yamlData, accessPath);

      await fs.writeFile(this.filepath, yaml.stringify(updatedYaml), 'utf8');
    } catch {
      return;
    }
  }
}

export const createYaml = ({
  workspace,
  rootDirectory,
}: {
  workspace: Workspace;
  rootDirectory: string;
}): YamlFileCreator => {
  return (filename: string) => new YamlFile(workspace, rootDirectory, filename);
};
