import path from 'node:path';
import fs from 'fs-extra';
import { z } from 'zod';
import chalk from 'chalk';

const allPackagesWildcard = z.enum(['*']);

const projectConfigSchema = z
  .object({
    projectId: z.string().optional(),
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
  })
  .strict();

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

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(chalk.red('Invalid project configuration'));

      for (const issue of error.issues) {
        console.log(`Error location: ${JSON.stringify(issue.path)}`);

        console.log('\nView documentation:');
        console.log('https://commonality.co/docs/project-config');
      }

      throw new Error('Invalid project configuration');
    } else {
      throw error;
    }
  }
};
