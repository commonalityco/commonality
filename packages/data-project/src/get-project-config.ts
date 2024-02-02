import { findUp } from 'find-up';
import {
  Check,
  JsonProjectConfig,
  ProjectConfig,
  projectConfigSchema,
} from '@commonalityco/utils-core/constants';
import { ZodError } from 'zod';
import fs from 'fs-extra';
import path from 'node:path';
import jiti from 'jiti';

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

export function toRelativePath(filePath: string) {
  const extension = path.extname(filePath);

  // Check if the filePath is already correctly formatted or is an absolute path
  if (
    !filePath.startsWith('./') &&
    !filePath.startsWith('../') &&
    !filePath.startsWith('/')
  ) {
    return './' + filePath + extension;
  }

  return filePath + extension;
}

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

export const resolveFile = (filepath: string) => {
  try {
    const loader = jiti(filepath, { debug: true, interopDefault: true });

    const result = loader(filepath);

    return result.default || result;
  } catch {
    return;
  }
};

export const getResolvedChecks = (
  config: JsonProjectConfig,
): ProjectConfig['checks'] | undefined => {
  if (!config.checks) {
    return;
  }

  return Object.fromEntries(
    Object.entries(config.checks).map(([checkName, paths]) => {
      console.log({ paths });
      if (!paths || paths.length === 0) {
        return [checkName, []];
      }

      const resolvedCheckList = paths
        .map((checkPath) => {
          try {
            const normalizedFilePath = toRelativePath(checkPath);

            const relativeNormalizedFilePath = path.resolve(
              './.commonality',
              normalizedFilePath,
            );

            const resolvedFile = resolveFile(relativeNormalizedFilePath);

            if (resolvedFile) {
              return resolvedFile;
            }

            const prefixedResolution = resolveFile(
              `commonality-checks-${checkPath}`,
            );

            if (prefixedResolution) {
              return prefixedResolution;
            }

            return resolveFile(checkPath);
          } catch {
            // console.log(error);
            return;
          }
        })
        .filter(Boolean);

      return [checkName, resolvedCheckList] satisfies [string, Check[]];
    }),
  );
};

export const getResolvedConfig = async (
  config: JsonProjectConfig,
): Promise<ProjectConfig> => {
  const resolvedChecks = getResolvedChecks(config);

  return projectConfigSchema.parse({
    ...config,
    checks: resolvedChecks,
  });
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
    const jsonConfig: JsonProjectConfig = await readJsonConfig(configPath);

    const resolvedConfig = await getResolvedConfig(jsonConfig);
    const config = getValidatedProjectConfig(resolvedConfig);

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
