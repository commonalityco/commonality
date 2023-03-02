/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import path from 'node:path';
import fs from 'fs-extra';
import type { ProjectConfig } from '@commonalityco/types';

export const getProjectConfig = async (
  rootDirectory: string
): Promise<ProjectConfig | undefined> => {
  const projectConfigPath = path.join(
    rootDirectory,
    '.commonality/config.json'
  );

  if (!fs.pathExistsSync(projectConfigPath)) {
    return;
  }

  try {
    return fs.readJson(projectConfigPath);
  } catch {
    return;
  }
};
