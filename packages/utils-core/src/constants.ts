import { describe } from 'vitest';
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

/**
 * Contains paths to a package within a workspace.
 */
type PackagePaths = {
  /**
   * The absolute path to the package directory.
   */
  path: string;
  /**
   * The path to the package directory relative to the root of the workspace.
   */
  relativePath: string;
};

const packagePaths: z.ZodType<PackagePaths> = z.object({
  path: z.string(),
  relativePath: z.string(),
});

/**
 * Context provided to checks, containing metadata about the package and its environment.
 */
export type CheckContext = {
  /**
   * Information about the current package being checked.
   */
  package: PackagePaths;
  /**
   * An array of all packages in the workspace.
   */
  allPackages: PackagePaths[];
  /**
   * Information about the root package of the workspace.
   */
  rootPackage: PackagePaths;
  /**
   * An array of usernames or team names designated as code owners.
   */
  codeowners: string[];
  /**
   * An array of tags associated with the current package.
   */
  tags: string[];
};

const checkContextSchema: z.ZodType<CheckContext> = z.object({
  package: packagePaths,
  allPackages: z.array(packagePaths),
  rootPackage: packagePaths,
  codeowners: z.array(z.string()),
  tags: z.array(z.string()),
});

const checkFn = z.function().args(checkContextSchema);

export type Message = {
  /**
   * This message will replace the default `message` for your check.
   */
  message?: string;
  /**
   * The path to the file or directory that the message is referring to.
   */
  path?: string;
  /**
   * A suggestion for how to fix the issue identified by the check.
   * It can be used to show how a fix function will modify a file or to suggest manual edits.
   */
  suggestion?: string;
};

export const messageSchema: z.ZodType<Message> = z.object({
  message: z.string().optional(),
  path: z.string().optional(),
  suggestion: z.string().optional(),
});

/**
 * Checks are used to automate the validation of package configurations and standards.
 *
 * @example
 * ```typescript
 * const hasCodeowner: Check = {
 *   message: 'Package must have at least one codeowner',
 *   validate: async (ctx) => {
 *     const hasCodeOwner = ctx.codeowners.length > 0;
 *
 *     if (!hasCodeOwner) {
 *       return {
 *         message: 'Package must have at least one codeowner',
 *       };
 *     }
 *
 *     return true;
 *   }
 * };
 * ```
 */
export type Check = {
  id?: string;
  /**
   * If set to `"error"`, the CLI will exit with a non-zero exit code if the `validate` function returns a value other than `true`.
   *
   * Documentation: https://docs.commonality.co/reference/check-object#level
   *
   * @defaultValue "warning"
   */
  level?: 'error' | 'warning';
  /**
   * The `validate` function is used to set the check's status to `pass`, `warn`, or `fail`.
   *
   * - If the function returns `true`, the check will be set to `pass`.
   * - If the function returns any other value, the check will be set to `warn` or `fail` based on the configured `level`.
   *
   * You can also override the check's default message by returning a message object, providing additional context about the failure of the check.
   *
   * Documentation: https://docs.commonality.co/reference/check-object#validate
   *
   * Example:
   * ```typescript
   * validate: async (ctx) => {
   *   const hasCodeOwner = ctx.codeowners.length > 0;
   *
   *   if (!hasCodeOwner) {
   *     return {
   *       message: 'Package must have at least one codeowner',
   *     };
   *   }
   *
   *   return true;
   * }
   * ```
   */
  validate: (
    ctx: CheckContext,
  ) => Promise<boolean | Message> | boolean | Message;
  /**
   * An optional function that automatically fixes issues identified by the `validate` function.
   *
   * This function will only run on packages where the check's `validate` function has not returned `true`.
   *
   * It should update packages so that they pass the check's `validate` function upon re-evaluation.
   *
   * Documentation: https://docs.commonality.co/reference/check-object#fix
   *
   * Example:
   * ```typescript
   * fix: async (ctx) => {
   *   await json(ctx.package.path, 'package.json').merge({
   *     scripts: {
   *       build: 'tsc --build'
   *     }
   *   })
   * }
   * ```
   */
  fix?: (ctx: CheckContext) => Promise<void> | void;
  /**
   * An string that will be shown as the default title for the check when running the CLI and Commonality Studio.
   *
   * Documentation: https://docs.commonality.co/reference/check-object#message
   */
  message: string;
};

export const checkSchema: z.ZodType<Check> = z.object({
  id: z.optional(z.string()),
  level: z.union([z.literal('error'), z.literal('warning')]).default('warning'),
  validate: checkFn.returns(
    z.union([
      z.union([z.boolean(), messageSchema]),
      z.promise(z.union([z.boolean(), messageSchema])),
    ]),
  ),
  fix: checkFn.returns(z.union([z.void(), z.promise(z.void())])).optional(),
  message: z.string(),
});

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

export const projectConfigSchema = z.object({
  $schema: z.string().optional(),
  workspaces: z
    .array(z.string())
    .default([])
    .describe(
      'An array of glob patterns used to identify which directories contain packages.' +
        `\n\nDocumentation: https://docs.commonality.co/reference/project-configuration#workspaces`,
    ),
  checks: z
    .record(z.array(z.string()).default([]))
    .default({})
    .describe(
      `An object whose keys are selectors and whose values are paths to checks.` +
        `\n\nDocumentation: https://docs.commonality.co/checks/introduction`,
    ),
  constraints: z
    .record(constraintSchema)
    .default({})
    .describe(
      `An object whose keys are selectors and whose values are constraints.` +
        `\n\nDocumentation: https://docs.commonality.co/constraints/introduction`,
    ),
});

export type ProjectConfig = z.input<typeof projectConfigSchema>;

export type CheckOutput = z.output<typeof checkSchema>;

export type Constraint = z.infer<typeof constraintSchema>;
