import z from 'zod';
import { nanoid } from 'nanoid';

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

const allowDescription = `
An array of tags to match groups of packages or a wildcard to match all packages.

Only direct dependencies matching this selector will be allowed.

Documentation: https://docs.commonality.co/constraints/allowing-dependencies
`;

const disallowDescription = `
An array of tags to match groups of packages or a wildcard to match all packages.

All direct and transitive dependencies matching this selector will be disallowed.

Documentation: https://docs.commonality.co/constraints/disallowing-dependencies
`;

const constraintSchema = z.union([
  z.object({
    allow: z.union([z.array(z.string()), wildcard]).describe(allowDescription),
    disallow: z
      .union([z.array(z.string()), wildcard])
      .describe(disallowDescription),
  }),
  z.object({
    allow: z.union([z.array(z.string()), wildcard]).describe(allowDescription),
  }),
  z.object({
    disallow: z
      .union([z.array(z.string()), wildcard])
      .describe(disallowDescription),
  }),
]);

export const messageSchema = z
  .object({
    message: z
      .string()
      .optional()
      .describe(
        'A string that will be shown as the default title for the check when running the CLI and Commonality Studio.',
      ),
    path: z
      .string()
      .optional()
      .describe(
        `A string representing a path that will be shown directly underneath the check's message.`,
      ),
    suggestion: z
      .string()
      .optional()
      .describe(
        'A string representing a suggestion for how to fix a failed check',
      ),
  })
  .strict()
  .describe('Schema for messages');

const checkSchema = z.object({
  id: z
    .optional(z.string())
    .default(nanoid)
    .describe('A unique identifier for the check'),
  level: z.union([z.literal('error'), z.literal('warning')]).default('warning')
    .describe(`
        A string that can be set to "warning" or "error".

        If set to "error", the CLI will exit with a non-zero exit code if this check is ever invalid. Default is "warning".
      `),
  validate: checkFn.returns(
    z.union([
      z.union([z.boolean(), messageSchema]),
      z.promise(z.union([z.boolean(), messageSchema])),
    ]),
  ).describe(`
      The returned value will determine the status of the check.

      If the function returns "true", the check will be set to "pass".
      If the function returns any other value, the check will be set to "warn" or "fail".

      This function will be run against all packages matching a selector.

      This function can be asynchronous.
      `),
  fix: checkFn
    .returns(z.union([z.void(), z.promise(z.void())]))
    .optional()
    .describe('Optional fix function for the check'),
  message: z
    .string()
    .describe(
      'A string that will be shown as the default title for the check when running the CLI and Commonality Studio.',
    ),
});

export const projectConfigSchema = z.object({
  $schema: z.string().optional(),
  workspaces: z
    .array(z.string())
    .default([])
    .describe(
      'An array of glob patterns used to identify which directories contain packages.',
    ),
  checks: z
    .record(z.array(z.string()).default([]))
    .default({})
    .describe(
      `An object whose keys are selectors and whose values are paths to checks.

Documentation: https://docs.commonality.co/checks/introduction`,
    ),
  constraints: z
    .record(constraintSchema)
    .default({})
    .describe(
      `An object whose keys are selectors and whose values are constraints.

Documentation: https://docs.commonality.co/constraints/introduction`,
    ),
});

export type ProjectConfig = z.input<typeof projectConfigSchema>;

export type Check = z.input<typeof checkSchema>;
export type CheckOutput = z.output<typeof checkSchema>;

export type CheckContext = z.infer<typeof checkContextSchema>;
export type Message = z.infer<typeof messageSchema>;

export type Constraint = z.infer<typeof constraintSchema>;
