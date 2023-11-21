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
  tags: Tag[];
  codeowners: Codeowner[];
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
  projectWorkspaces: Workspace[];
  json: JsonFileCreator;
  text: TextFileCreator;
}) => ValidationResult | Promise<ValidationResult>;

export interface File {
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
}

export type FileCreator<T> = (
  filename: string,
  options?: {
    defaultSource?: T;
    onDelete?: (filePath: string) => Promise<void>;
  },
) => File;

export interface JsonFile extends File {
  get<T extends Record<string, unknown>>(): Promise<T>;
  contains(value: Record<string, unknown>): Promise<boolean>;
  set(value: Record<string, unknown>): Promise<void>;
  update(value: Record<string, unknown>): Promise<void>;
  merge(value: Record<string, unknown>): Promise<void>;
  remove(path: string): Promise<void>;
  diffRemoved(value: Record<string, unknown>): Promise<string | undefined>;
  diffAdded(value: Record<string, unknown>): Promise<string | undefined>;
  diff(value: Record<string, unknown>): Promise<string | undefined>;
}

export type JsonFileCreator = (
  filename: string,
  options?: {
    defaultSource?: Record<string, unknown>;
    onWrite?: (filePath: string, data: unknown) => Promise<void>;
    onDelete?: (filePath: string) => Promise<void>;
  },
) => JsonFile;

export interface TextFile extends File {
  get(): Promise<string[]>;
  contains(lines: string[]): Promise<boolean>;
  set(lines: string[]): Promise<void>;
  add(lines: string[]): Promise<void>;
  remove(lines: string[]): Promise<void>;
  diff(value: string[]): Promise<string | undefined>;
}

export type TextFileCreator = (
  filename: string,
  options?: {
    defaultSource?: string;
    onWrite?: (filePath: string, data: string) => Promise<void>;
    onDelete?: (filePath: string) => Promise<void>;
  },
) => TextFile;

export type FileCreatorFactory<File> = ({
  rootDirectory,
}: {
  rootDirectory: string;
  workspace: Workspace;
}) => File;

export type FixFn = (opts: {
  workspace: Workspace;
  projectWorkspaces: Workspace[];
  json: JsonFileCreator;
  text: TextFileCreator;
}) => void | Promise<void>;

type Message = {
  title: string;
  context?: string;
  // A path to a file relative to the package's folder.
  filepath?: string;
};
export type MessageFn = (options: {
  workspace: Workspace;
  json: JsonFileCreator;
  text: TextFileCreator;
}) => Message | Promise<Message>;

export type ConformerMessage = string | MessageFn;

export interface Conformer {
  name: string;
  level?: 'error' | 'warning';
  validate: ValidateFn;
  fix?: FixFn;
  type?: 'warning' | 'error';
  message: ConformerMessage;
}

export type ConformerCreator<C extends Conformer, O = undefined> = (
  options?: O,
) => C;

export type ConformanceResult = {
  name: string;
  pattern: string;
  fix?: FixFn;
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

export type PackageJson = {
  workspaces?: string[];
  name?: string;
  description?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
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
