import { findUp } from 'find-up';
import {
  ProjectConfig,
  projectConfigSchema,
} from '@commonalityco/utils-core/constants';
import { ZodError } from 'zod';
import fs from 'fs-extra';
import path from 'node:path';

const normalizeZodMessage = (error: unknown): string => {
  return (error as ZodError).issues
    .flatMap((issue) => {
      const themePath =
        issue.path.length > 0 && `Path: "${issue.path.join('.')}"`;
      const unionErrors =
        'unionErrors' in issue
          ? issue.unionErrors.map((element) => normalizeZodMessage(element))
          : [];
      return [
        [issue.message, themePath].filter(Boolean).join('. '),
        ...unionErrors,
      ];
    })
    .join('\n');
};

export const getValidatedProjectConfig = (
  config: ProjectConfig,
): ProjectConfig => {
  return projectConfigSchema.parse(config);
};

export interface ProjectConfigData {
  config: ProjectConfig | Record<string, never>;
  filepath: string;
  isEmpty?: boolean;
}

const readJsonConfig = async (configPath: string) => {
  try {
    const jsonConfig = await fs.readJSON(configPath);
    return jsonConfig;
  } catch {
    return;
  }
};

export const getProjectConfig = async ({
  rootDirectory,
}: {
  rootDirectory?: string;
}): Promise<ProjectConfigData | undefined> => {
  const directoryPath = await findUp(['.commonality'], {
    cwd: rootDirectory,
    stopAt: rootDirectory,
    type: 'directory',
  });

  if (!directoryPath) {
    return;
  }

  const configPath = path.join(directoryPath, 'config.json');

  const configExists = await fs.exists(configPath);

  if (!configExists) {
    return;
  }

  try {
    const jsonConfig: ProjectConfig = await readJsonConfig(configPath);

    const config = getValidatedProjectConfig(jsonConfig);

    return {
      config,
      filepath: configPath,
      isEmpty: !jsonConfig,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `\n[commonality] Invalid project configuration.\n\n${normalizeZodMessage(
          error,
        )}`,
      );
    }

    return {
      config: {},
      filepath: configPath,
      isEmpty: true,
    };
  }
};
