import z from 'zod';

export enum Theme {
  Dark = 'dark',
  Light = 'light',
  System = 'system',
}

export enum Lockfile {
  NPM_LOCKFILE = 'package-lock.json',
  YARN_LOCKFILE = 'yarn.lock',
  PNPM_LOCKFILE = 'pnpm-lock.yaml',
  BUN_LOCKFILE = 'bun.lockb',
}

export enum DependencyType {
  PEER = 'peer',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum PackageType {
  NODE = 'node',
  REACT = 'react',
  NEXT = 'next',
}

export enum PackageManager {
  PNPM = 'pnpm',
  YARN = 'yarn',
  NPM = 'npm',
  BUN = 'bun',
}

export enum FilePath {
  PACKAGE_CONFIG = './commonality.json',
}

export const AllPackagesWildcard = '*' as const;

export enum Status {
  Pass = 'pass',
  Fail = 'fail',
  Warn = 'warn',
}

const packagePaths = z.object({
  path: z.string(),
  relativePath: z.string(),
});

const checkContextSchema = z.object({
  package: packagePaths,
  allPackages: z.array(packagePaths),
  rootPackage: packagePaths,
  codeowners: z.array(z.string()),
  tags: z.array(z.string()),
});

const checkFn = z.function().args(checkContextSchema);

const wildcard = z.literal('*');

const constraintSchema = z.union([
  z.object({
    allow: z.union([z.array(z.string()), wildcard]),
    disallow: z.union([z.array(z.string()), wildcard]),
  }),
  z.object({
    allow: z.union([z.array(z.string()), wildcard]),
  }),
  z.object({
    disallow: z.union([z.array(z.string()), wildcard]),
  }),
]);

const messageSchema = z
  .object({
    title: z.string(),
    filePath: z.string().optional(),
    suggestion: z.string().optional(),
  })
  .strict();

const checkSchema = z.object({
  name: z.string(),
  level: z.union([z.literal('error'), z.literal('warning')]).default('warning'),
  validate: checkFn,
  fix: checkFn.returns(z.union([z.void(), z.promise(z.void())])).optional(),
  message: z.union([
    z.string(),
    checkFn.returns(z.union([messageSchema, z.promise(messageSchema)])),
  ]),
});

export const jsonProjectConfigSchema = z.object({
  workspaces: z.array(z.string()).default([]),
  checks: z.record(z.array(z.string()).default([])).default({}),
  constraints: z.record(constraintSchema).default({}),
});

export const projectConfigSchema = z.object({
  workspaces: z.array(z.string()).default([]),
  checks: z.record(z.array(checkSchema).default([])).default({}),
  constraints: z.record(constraintSchema).default({}),
});

export type JsonProjectConfig = z.input<typeof jsonProjectConfigSchema>;
export type ProjectConfig = z.output<typeof projectConfigSchema>;

export type Check = z.infer<typeof checkSchema>;
export type CheckInput = z.input<typeof checkSchema>;
export type CheckOutput = z.output<typeof checkSchema>;

export type CheckContext = z.infer<typeof checkContextSchema>;
export type Message = z.infer<typeof messageSchema>;

export type Constraint = z.infer<typeof constraintSchema>;
