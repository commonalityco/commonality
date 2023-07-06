/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */
import path from 'node:path';
import fs from 'fs-extra';
import { z } from 'zod';

const projectConfigSchema = z.object({
  projectId: z.string().optional(),
  stripScopeFromPackageNames: z.boolean().default(true).optional(),
  constraints: z
    .array(
      z.union([
        z.object({
          tag: z.string(),
          allow: z.array(z.string()),
          disallow: z.array(z.string()),
        }),
        z.object({
          tag: z.string(),
          allow: z.array(z.string()),
        }),
        z.object({
          tag: z.string(),
          disallow: z.array(z.string()),
        }),
      ])
    )
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
    console.log({ innerConfig: JSON.stringify(config) });
    const parsed = projectConfigSchema.parse(config);
    console.log({ parsed: JSON.stringify(parsed) });
    return parsed;
  } catch (error) {
    console.log(error);
    return {};
  }
};
