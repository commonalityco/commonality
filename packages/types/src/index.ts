import {
  DependencyType,
  AllPackagesWildcard,
  PackageType,
  Status,
} from '@commonalityco/utils-core';

export type Constraint =
  | {
      allow: string[] | typeof AllPackagesWildcard;
    }
  | {
      disallow: string[] | typeof AllPackagesWildcard;
    }
  | {
      allow: string[] | typeof AllPackagesWildcard;
      disallow: string[] | typeof AllPackagesWildcard;
    };

export type Violation = {
  sourcePackageName: string;
  targetPackageName: string;

  /** The tags to which the constraint is applied to */
  appliedTo: string;
  /** The tags allowed by the constraint */
  allowed: string[] | typeof AllPackagesWildcard;
  /** The tags disallowed by the constraint */
  disallowed: string[] | typeof AllPackagesWildcard;
  /** The tags found in the dependency's configuration file. If undefined, the target package has no configuration file. */
  found?: string[];
};

export type ConstraintResult = {
  isValid: boolean;
  foundTags?: string[];
  constraint: Constraint;
  dependencyPath: Dependency[];
  filter: string;
};

export type Dependency = {
  version: string;
  type: DependencyType;
  source: string;
  target: string;
};

export type Codeowner = string;

export type CodeownersData = {
  packageName: string;
  codeowners: Codeowner[];
};

export type Tag = string;

export type TagsData = { packageName: string; tags: Tag[] };

export type Package = {
  path: string;
  type: PackageType;
  name: string;
  description?: string;
  version: string;
};

export type Workspace = {
  path: string;
  relativePath: string;
};

export type ValidationResult =
  | number
  | string
  | Record<string, unknown>
  | Array<unknown>
  | boolean
  | undefined
  | null;

export type FileCreatorFactory<File> = ({
  rootDirectory,
}: {
  rootDirectory: string;
  workspace: Workspace;
}) => File;

export type CheckOptions = {
  workspace: Workspace;
  allWorkspaces: Workspace[];
  rootWorkspace: Workspace;
  codeowners: Codeowner[];
  tags: Tag[];
};

export type CheckFn<T> = (opts: CheckOptions) => T | Promise<T>;

export type Message = {
  title: string;
  context?: string;
  // A path to a file relative to the package's folder.
  filepath?: string;
};

export interface Conformer {
  name: string;
  level?: 'error' | 'warning';
  validate: CheckFn<ValidationResult>;
  fix?: CheckFn<void>;
  type?: 'warning' | 'error';
  message: string | CheckFn<Message>;
}

export type CheckCreator<C extends Conformer, O = undefined> = (
  options?: O,
) => C;

export type ConformanceResult = {
  name: string;
  filter: string;
  fix?: CheckFn<void>;
  status: Status;
  package: Package;
  message: Message;
};

export interface ProjectConfig {
  constraints?: Record<string, Constraint>;
  checks?: Record<string, Conformer[]>;
}

export interface ProjectConfigData {
  config: ProjectConfig;
  filepath: string;
  isEmpty?: boolean;
}

export type PackageConfig = {
  tags?: string[];
};

export type PackageJson = {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: string | { url?: string; email?: string };
  license?: string;
  author?: string | { name: string; email?: string; url?: string };
  contributors?: Array<string | { name: string; email?: string; url?: string }>;
  funding?:
    | string
    | { type: string; url: string }
    | Array<string | { type: string; url: string }>;
  files?: string[];
  main?: string;
  browser?: string;
  bin?: Record<string, string>;
  man?: string | string[];
  directories?: {
    bin?: string;
    man?: string;
    doc?: string;
    example?: string;
    lib?: string;
    test?: string;
  };
  repository?: string | { type: string; url: string; directory?: string };
  scripts?: Record<string, string>;
  config?: Record<string, unknown>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional: boolean }>;
  bundledDependencies?: Array<string> | boolean;
  bundleDependencies?: Array<string> | boolean;
  optionalDependencies?: Record<string, string>;
  overrides?: Record<string, unknown>;
  engines?: { node?: string; npm?: string };
  os?: Array<string>;
  cpu?: Array<string>;
  private?: boolean;
  publishConfig?: Record<string, unknown>;
  workspaces?: string[];
  [key: string]: unknown;
};
