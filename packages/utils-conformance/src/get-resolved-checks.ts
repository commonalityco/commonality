import { createRequire } from 'node:module';

import {
  Check,
  JsonProjectConfig,
  ProjectConfig,
} from '@commonalityco/utils-core/constants';
import path from 'node:path';
import jiti from 'jiti';

export const resolveFile = (filepath: string) => {
  try {
    const loader = jiti(filepath, { debug: true, interopDefault: true });

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
    const require = createRequire(rootDirectory);

    return require.resolve(filepath);
  } catch {
    return;
  }
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

    const relativeNormalizedFilePath = path.resolve(
      rootDirectory,
      './.commonality',
      normalizedFilePath,
    );

    const resolvedFile = resolveFile(relativeNormalizedFilePath);

    if (resolvedFile) {
      return resolvedFile;
    }

    const resolvedPrefixedFilepath = getResolvedPath({
      filepath: `commonality-checks-${checkPath}`,
      rootDirectory,
    });

    const resolvedUnprefixedFilepath = getResolvedPath({
      filepath: checkPath,
      rootDirectory,
    });

    if (!resolvedPrefixedFilepath && !resolvedUnprefixedFilepath) {
      return;
    }

    if (resolvedPrefixedFilepath) {
      return resolveFile(resolvedPrefixedFilepath);
    }

    if (resolvedUnprefixedFilepath) {
      return resolveFile(resolvedUnprefixedFilepath);
    }
  } catch {
    return;
  }
};

export const getResolvedChecks = ({
  projectConfig,
  rootDirectory,
}: {
  rootDirectory: string;
  projectConfig: JsonProjectConfig;
}): {
  resolved: ProjectConfig['checks'] | Record<string, never>;
  unresolved: string[];
} => {
  if (!projectConfig.checks) {
    return {
      resolved: {},
      unresolved: [],
    };
  }

  const unresolvedPaths: string[] = [];

  const checkEntries = Object.entries(projectConfig.checks);

  const resolvedChecks = checkEntries.map(([selector, paths]) => {
    if (!paths || paths.length === 0) {
      return [selector, []] as const;
    }

    const resolvedCheckList = paths.map((checkPath) => {
      const resolvedCheck = getResolvedCheck({ checkPath, rootDirectory });

      if (resolvedCheck) {
        return resolvedCheck;
      } else {
        unresolvedPaths.push(checkPath);
      }
    });

    return [selector, resolvedCheckList.filter(Boolean)] as const;
  });

  const resolved = Object.fromEntries(
    resolvedChecks.filter(([, checks]) => checks.length > 0),
  );
  const unresolved = resolvedChecks
    .filter(([, checks]) => checks.length === 0)
    .map(([selector]) => selector);

  return {
    resolved,
    unresolved,
  };
};
