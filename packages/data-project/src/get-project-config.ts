import type { ProjectConfig } from '@commonalityco/types';
import jiti from 'jiti';
import { findUp } from 'find-up';

export const getProjectConfig = async ({
  rootDirectory,
}: {
  rootDirectory?: string;
}): Promise<
  | {
      config: ProjectConfig;
      filepath: string;
      isEmpty?: boolean;
    }
  | undefined
> => {
  const configPath = await findUp(
    ['.commonality/config.js', '.commonality/config.ts'],
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

    return {
      config: defaultExport,
      filepath: configPath,
      isEmpty: !defaultExport,
    };
  } catch (error) {
    console.error(error);
    return {
      config: {},
      filepath: configPath,
      isEmpty: true,
    };
  }
};
