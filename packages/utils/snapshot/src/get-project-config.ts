/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import path from 'node:path';
import fs from 'fs-extra';
import type { ProjectConfig } from '@commonalityco/types';
import { z } from 'zod';

const projectConfigSchema = z.object({
  projectId: z.string({
    required_error: 'projectId is required',
    invalid_type_error: 'projectId must be a string',
  }),
  stripScopeFromPackageNames: z.boolean().default(true),
  constraints: z
    .array(z.object({ tags: z.array(z.string()), allow: z.array(z.string()) }))
    .optional(),
});

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
    const config = fs.readJson(projectConfigPath);

    return projectConfigSchema.parse(config);
  } catch {
    return;
  }
};
