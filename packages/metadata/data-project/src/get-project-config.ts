import path from 'node:path';
import fs from 'fs-extra';
import { z } from 'zod';

const allPackagesWildcard = z.enum(['*']);

const projectConfigSchema = z.object({
  projectId: z.string().optional(),
  stripScopeFromPackageNames: z.boolean().default(true).optional(),
  constraints: z
    .array(
      z.union([
        z.object({
          applyTo: z.string(),
          allow: z.union([z.array(z.string()), allPackagesWildcard]),
          disallow: z.union([z.array(z.string()), allPackagesWildcard]),
        }),
        z.object({
          applyTo: z.string(),
          allow: z.union([z.array(z.string()), allPackagesWildcard]),
        }),
        z.object({
          applyTo: z.string(),
          disallow: z.union([z.array(z.string()), allPackagesWildcard]),
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
    const parsed = projectConfigSchema.parse(config);
    console.log({ parsed });
    return parsed;
  } catch (error) {
    console.error('Invalid project configuration');
    // console.log(error);
    return {};
  }
};
