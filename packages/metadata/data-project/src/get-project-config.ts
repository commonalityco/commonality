/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import path from 'node:path';
import fs from 'fs-extra';
import { z } from 'zod';

const projectConfigSchema = z.object({
  projectId: z.string().optional(),
  stripScopeFromPackageNames: z.boolean().default(false).optional(),
  constraints: z
    .array(z.object({ tags: z.array(z.string()), allow: z.array(z.string()) }))
    .optional(),
});

export const getProjectConfig = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<z.infer<typeof projectConfigSchema>> => {
  const projectConfigPath = path.join(
    rootDirectory,
    '.commonality/config.json'
  );

  if (!fs.pathExistsSync(projectConfigPath)) {
    return {};
  }

  try {
    const config = await fs.readJson(projectConfigPath);

    return projectConfigSchema.parse(config);
  } catch (error) {
    console.log(error);
    return {};
  }
};
