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

export type ValidateFn = (opts: {
  workspace: Workspace;
  projectWorkspaces: Workspace[];
  json: JsonFileCreator;
  yaml: YamlFileCreator;
  text: TextFileCreator;
}) => boolean | Promise<boolean>;

export interface File {
  exists: () => Promise<boolean>;
  delete: () => Promise<void>;
}

export interface YamlFile extends File {
  get(): Promise<string>;
  get(path: string, defaultValue?: string): Promise<unknown>;
  set(value: Record<string, unknown>): Promise<void>;
  set(path: string, value: string): Promise<void>;
  remove(path: string): Promise<void>;
}

export type YamlFileCreator = (filename: string) => YamlFile;

export interface JsonFile extends File {
  get(path: string): Promise<string | number | boolean>;
  get<T extends Record<string, unknown>>(): Promise<T>;
  set: (path: string, value: string | Record<string, unknown>) => Promise<void>;
  remove: (path: string) => Promise<void>;
}

export type JsonFileCreator = (filename: string) => JsonFile;

export interface TextFile extends File {
  get: () => Promise<string[] | undefined>;
  set: (lines: string[]) => Promise<void>;
  add: (line: string | string[]) => Promise<void>;
  remove: (line: string | string[]) => Promise<void>;
  matches: (expected: string | string[]) => Promise<boolean>;
}

export type TextFileCreator = (filename: string) => TextFile;

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
  yaml: YamlFileCreator;
  text: TextFileCreator;
}) => void | Promise<void>;

export interface Conformer {
  name: string;
  level?: 'error' | 'warning';
  validate: ValidateFn;
  fix?: FixFn;
  type?: 'warning' | 'error';
  message?: string | ((options: { workspace: Workspace }) => string);
}

export type ConformerCreator<T = undefined> = (options?: T) => Conformer;

export type ConformanceResult = {
  name: string;
  pattern: string;
  fix?: FixFn;
  level: 'error' | 'warning';
  isValid: boolean;
  workspace: Workspace;
  message: string;
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
