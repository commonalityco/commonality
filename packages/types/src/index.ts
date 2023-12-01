import {
  DependencyType,
  AllPackagesWildcard,
  PackageType,
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
  dependency: Dependency;
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

export type Document = {
  filename: string;
  isRoot: boolean;
  content: string;
  path: string;
};

export type DocumentsData = {
  packageName: string;
  documents: Document[];
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

export type ConformerOptions = {
  workspace: Workspace;
  allWorkspaces: Workspace[];
  rootWorkspace: Workspace;
  codeowners: Codeowner[];
  tags: Tag[];
};

export type ConformerFn<T> = (opts: ConformerOptions) => T | Promise<T>;

export type Message = {
  title: string;
  context?: string;
  // A path to a file relative to the package's folder.
  filepath?: string;
};

export interface Conformer {
  name: string;
  level?: 'error' | 'warning';
  validate: ConformerFn<ValidationResult>;
  fix?: ConformerFn<void>;
  type?: 'warning' | 'error';
  message: string | ConformerFn<Message>;
}

export type ConformerCreator<C extends Conformer, O = undefined> = (
  options?: O,
) => C;

export type ConformanceResult = {
  name: string;
  pattern: string;
  fix?: ConformerFn<void>;
  level: 'error' | 'warning';
  isValid: boolean;
  package: Package;
  message: Message;
};

export interface ProjectConfig {
  // The unique identifier of the project
  projectId?: string;
  project?: {
    onConform?: string;
  };
  // An array of constraints that the project should adhere to
  constraints?: Record<string, Constraint>;
  conformers?: Record<string, Conformer[]>;
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

export type SnapshotResult = {
  url: string;
};

export type SnapshotData = {
  packages: Package[];
  tagsData: TagsData[];
  documentsData: DocumentsData[];
  codeownersData: CodeownersData[];
  violations: Violation[];
  projectConfig: ProjectConfig;
  dependencies: Dependency[];
};
