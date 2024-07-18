import { z } from 'zod';

export const privacyEnum = z.enum(['PUBLIC', 'PRIVATE']);

export const dependencyTypeEnum = z.enum(['PRODUCTION', 'DEVELOPMENT', 'PEER']);

export const blockType = z.enum(['REACT', 'NODE', 'NEXT']);

export const createSnapshotSchema = z.object({
  gitBranch: z.string(),
  publishKey: z.string(),
  projectId: z.string(),
  codeowners: z.array(
    z.object({
      packageName: z.string(),
      codeowners: z.array(z.string()),
    }),
  ),
  blocks: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      path: z.string(),
      version: z.string(),
      type: blockType,
      churn: z.number(),
      complexity: z.number(),
      license: z.string().optional(),
      privacy: privacyEnum,
    }),
  ),
  dependencies: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      type: dependencyTypeEnum,
    }),
  ),
});

export type CreateSnapshotSchema = z.infer<typeof createSnapshotSchema>;
