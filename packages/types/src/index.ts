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
  packageJson: PackageJson;
};

export type ValidationResult =
  | number
  | string
  | Record<string, unknown>
  | Array<unknown>
  | boolean
  | undefined
  | null;

export interface File {
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
}

export interface JsonFile extends File {
  get<T extends Record<string, unknown>>(): Promise<T | undefined>;
  contains(value: Record<string, unknown>): Promise<boolean>;
  set(value: Record<string, unknown>): Promise<void>;
  merge(value: Record<string, unknown>): Promise<void>;
  remove(path: string): Promise<void>;
}

export type JsonFileCreator = (
  filename: string,
  options?: {
    onRead?: (
      filepath: string,
    ) => Record<string, unknown> | Promise<Record<string, unknown>>;
    onWrite?: (filePath: string, data: unknown) => Promise<void> | void;
    onDelete?: (filePath: string) => Promise<void> | void;
    onExists?: (filePath: string) => Promise<boolean> | boolean;
  },
) => JsonFile;

export interface TextFile extends File {
  get(): Promise<string[]>;
  contains(lines: string[]): Promise<boolean>;
  set(lines: string[]): Promise<void>;
  add(lines: string[]): Promise<void>;
  remove(lines: string[]): Promise<void>;
}

export type TextFileCreator = (
  filename: string,
  options?: {
    onRead?: (filepath: string) => string | Promise<string>;
    onWrite?: (filePath: string, data: string) => Promise<void> | void;
    onDelete?: (filePath: string) => Promise<void> | void;
    onExists?: (filePath: string) => Promise<boolean> | boolean;
  },
) => TextFile;

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
  json: JsonFileCreator;
  text: TextFileCreator;
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
  workspace: Workspace;
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

export type PackageJson = Readonly<{
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  bugs?: string | Readonly<{ url?: string; email?: string }>;
  license?: string;
  author?: string | Readonly<{ name: string; email?: string; url?: string }>;
  contributors?: ReadonlyArray<
    string | Readonly<{ name: string; email?: string; url?: string }>
  >;
  funding?:
    | string
    | Readonly<{ type: string; url: string }>
    | ReadonlyArray<string | Readonly<{ type: string; url: string }>>;
  files?: string[];
  main?: string;
  browser?: string;
  bin?: Readonly<Record<string, string>>;
  man?: string | string[];
  directories?: Readonly<{
    bin?: string;
    man?: string;
    doc?: string;
    example?: string;
    lib?: string;
    test?: string;
  }>;
  repository?:
    | string
    | Readonly<{ type: string; url: string; directory?: string }>;
  scripts?: Readonly<Record<string, string>>;
  config?: Readonly<Record<string, unknown>>;
  dependencies?: Readonly<Record<string, string>>;
  devDependencies?: Readonly<Record<string, string>>;
  peerDependencies?: Readonly<Record<string, string>>;
  peerDependenciesMeta?: Readonly<
    Record<string, Readonly<{ optional: boolean }>>
  >;
  bundledDependencies?: ReadonlyArray<string> | boolean;
  bundleDependencies?: ReadonlyArray<string> | boolean;
  optionalDependencies?: Readonly<Record<string, string>>;
  overrides?: Readonly<Record<string, unknown>>;
  engines?: Readonly<{ node?: string; npm?: string }>;
  os?: ReadonlyArray<string>;
  cpu?: ReadonlyArray<string>;
  private?: boolean;
  publishConfig?: Readonly<Record<string, unknown>>;
  workspaces?: string[];
  [key: string]: unknown;
}>;
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
