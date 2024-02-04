import { Check, ProjectConfig } from '@commonalityco/utils-core/constants';
import path from 'node:path';
import jiti from 'jiti';
import fs from 'fs-extra';
import { resolve } from 'import-meta-resolve';

export const resolveFile = ({ filepath }: { filepath: string }) => {
  try {
    const loader = jiti(filepath, { interopDefault: true });

    const result = loader(filepath);

    return result.default || result;
  } catch {
    return;
  }
};

export function toRelativePath(filePath: string): string {
  const isAbsolutePath = filePath.startsWith('/');
  const isRelativePath =
    filePath.startsWith('./') || filePath.startsWith('../');

  if (isAbsolutePath) {
    return `.${filePath}`;
  } else if (!isRelativePath) {
    return `./${filePath}`;
  }
  return filePath;
}

const getResolvedPath = ({
  filepath,
  rootDirectory,
}: {
  filepath: string;
  rootDirectory: string;
}): string | undefined => {
  try {
    return resolve(
      filepath,
      new URL(
        path.join(rootDirectory, 'package.json'),
        import.meta.url,
      ).toString(),
    );
  } catch {
    return;
  }
};

const getLocalResolvedPath = ({
  filepath,
  rootDirectory,
}: {
  filepath: string;
  rootDirectory: string;
}) => {
  const directoryPath = '.commonality';
  const extensions = ['.js', '.ts', '.mjs', '.cjs'];

  for (const ext of extensions) {
    const localResolvedPath = path.resolve(
      rootDirectory,
      directoryPath,
      `${filepath}${ext}`,
    );

    const exists = fs.existsSync(localResolvedPath);

    if (exists) {
      return localResolvedPath;
    }
  }

  return;
};

export const getResolvedCheck = ({
  checkPath,
  rootDirectory,
}: {
  checkPath: string;
  rootDirectory: string;
}): Check | undefined => {
  try {
    const normalizedFilePath = toRelativePath(checkPath);
    const relativeNormalizedFilePath = getLocalResolvedPath({
      filepath: normalizedFilePath,
      rootDirectory,
    });

    const resolvedFile = relativeNormalizedFilePath
      ? resolveFile({ filepath: relativeNormalizedFilePath })
      : undefined;

    if (resolvedFile) return resolvedFile;

    const resolvedPaths = [`commonality-checks-${checkPath}`, checkPath]
      .map((filepath) => getResolvedPath({ filepath, rootDirectory }))
      // eslint-disable-next-line unicorn/prefer-native-coercion-functions
      .filter((path): path is string => Boolean(path));

    return resolvedPaths.length > 0
      ? resolveFile({ filepath: resolvedPaths[0] })
      : undefined;
  } catch {
    return;
  }
};

export const getResolvedChecks = ({
  projectConfig,
  rootDirectory,
}: {
  rootDirectory: string;
  projectConfig?: ProjectConfig;
}): {
  resolved: Record<string, Check[]> | Record<string, never>;
  unresolved: string[];
} => {
  if (!projectConfig?.checks) {
    return {
      resolved: {},
      unresolved: [],
    };
  }

  const unresolvedPaths: string[] = [];
  const resolvedChecks: [string, Check[]][] = [];

  for (const [selector, paths] of Object.entries(projectConfig.checks)) {
    if (!paths || paths.length === 0) {
      resolvedChecks.push([selector, []]);
      continue;
    }

    const resolvedCheckList: Check[] = [];

    for (const checkPath of paths) {
      const resolvedCheck = getResolvedCheck({ checkPath, rootDirectory });

      if (resolvedCheck) {
        resolvedCheckList.push(resolvedCheck);
      } else {
        unresolvedPaths.push(checkPath);
      }
    }

    if (resolvedCheckList.length > 0) {
      resolvedChecks.push([selector, resolvedCheckList]);
    }
  }

  const resolved = Object.fromEntries(resolvedChecks);

  return {
    resolved,
    unresolved: unresolvedPaths,
  };
};
