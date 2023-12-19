import jiti from 'jiti';
import { findUp } from 'find-up';
import { ProjectConfig, projectConfigSchema } from '@commonalityco/utils-core';
import { ZodError } from 'zod';
import z from 'zod';

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

export const getValidatedProjectConfig = (config: unknown): ProjectConfig => {
  return projectConfigSchema.parse(config);
};

export interface ProjectConfigData {
  config: ProjectConfig | Record<string, never>;
  filepath: string;
  isEmpty?: boolean;
}

export const getProjectConfig = async ({
  rootDirectory,
}: {
  rootDirectory?: string;
}): Promise<ProjectConfigData | undefined> => {
  const configPath = await findUp(
    ['commonality.config.js', 'commonality.config.ts'],
    {
      cwd: rootDirectory,
      stopAt: rootDirectory,
    },
  );

  if (!configPath) {
    return;
  }

  try {
    const loader = jiti(configPath, { interopDefault: true });

    const result = loader(configPath);
    const defaultExport = result.default || result;

    const config = getValidatedProjectConfig(defaultExport);

    return {
      config,
      filepath: configPath,
      isEmpty: !defaultExport,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `[commonality] Invalid project configuration.\n\n${normalizeZodMessage(
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
