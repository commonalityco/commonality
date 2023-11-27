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

type ValidationResult =
  | number
  | string
  | Record<string, unknown>
  | Array<unknown>
  | boolean
  | undefined
  | null;

export type ValidateFn = (opts: {
  workspace: Workspace;
  rootWorkspace: Workspace;
  allWorkspaces: Workspace[];
  codeowners: Codeowner[];
  tags: Tag[];
  json: JsonFileCreator;
  text: TextFileCreator;
}) => ValidationResult | Promise<ValidationResult>;

export interface File {
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
}

export interface JsonFile extends File {
  get<T extends Record<string, unknown>>(): Promise<T>;
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

export type ConformerFn<T> = (opts: {
  workspace: Workspace;
  allWorkspaces: Workspace[];
  rootWorkspace: Workspace;
  codeowners: Codeowner[];
  tags: Tag[];
  json: JsonFileCreator;
  text: TextFileCreator;
}) => T | Promise<T>;

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
  workspaces?: string[];
  name?: string;
  description?: string;
  version?: string;
  dependencies?: Readonly<Record<string, string>>;
  devDependencies?: Readonly<Record<string, string>>;
  peerDependencies?: Readonly<Record<string, string>>;
  optionalDependencies?: Readonly<Record<string, string>>;
  scripts?: Readonly<Record<string, string>>;
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
