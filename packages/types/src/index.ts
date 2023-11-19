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
  json: JsonFileCreator<JsonFileReader>;
  text: TextFileCreator<TextFileReader>;
}) => ValidationResult | Promise<ValidationResult>;

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

export interface JSONObject {
  [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

export type JSONValue = string | number | boolean | JSONObject | JSONArray;

export interface JsonFileValidator {
  get(path: string): Promise<JSONValue>;
  get<T extends JSONValue>(): Promise<T>;
  contains(value: Record<string, unknown>): Promise<boolean>;
  exists: File['exists'];
}

export interface JsonFileReader extends Pick<File, 'exists'> {
  get(path: string): Promise<JSONValue>;
  get<T extends JSONValue>(): Promise<T>;
  contains(value: Record<string, unknown>): Promise<boolean>;
}

export interface JsonFileWriter extends Pick<File, 'delete'> {
  set(path: string, value: JSONValue): Promise<void>;
  set(value: JSONValue): Promise<void>;
  merge(value: Record<string, unknown>): Promise<void>;
  remove(path: string): Promise<void>;
}

export interface JsonFileFormatter {
  diff(value: Record<string, unknown>): Promise<string | undefined>;
}

export type JsonFileCreator<
  T extends JsonFileReader | JsonFileWriter | JsonFileFormatter,
> = (filename: string) => T;

export interface TextFile extends File {
  get: () => Promise<string[] | undefined>;
  set: (lines: string[]) => Promise<void>;
  add: (line: string | string[]) => Promise<void>;
  remove: (line: string | string[]) => Promise<void>;
  matches: (expected: string | string[]) => Promise<boolean>;
}

export interface TextFileReader extends Pick<File, 'exists'> {
  get(): Promise<string[]>;
  contains(lines: string[]): Promise<boolean>;
}

export interface TextFileWriter extends Pick<File, 'delete'> {
  set(lines: string[]): Promise<void>;
  add(lines: string[]): Promise<void>;
  remove(lines: string[]): Promise<void>;
}

export interface TextFileFormatter {
  diff(value: string[]): Promise<string | undefined>;
}

export type TextFileCreator<
  T extends TextFileReader | TextFileWriter | TextFileFormatter,
> = (filename: string) => T;

export type FileCreatorFactory<File> = ({
  rootDirectory,
}: {
  rootDirectory: string;
  workspace: Workspace;
}) => File;

export type FixFn = (opts: {
  workspace: Workspace;
  projectWorkspaces: Workspace[];
  json: JsonFileCreator<JsonFileWriter>;
  text: TextFileCreator<TextFileWriter>;
}) => void | Promise<void>;

type Message = {
  title: string;
  context?: string;
  // A path to a file relative to the package's folder.
  filepath?: string;
};
export type MessageFn = (options: {
  workspace: Workspace;
  json: JsonFileCreator<JsonFileFormatter>;
  text: TextFileCreator<TextFileFormatter>;
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

export type ConformerCreator<T = undefined> = (options?: T) => Conformer;

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
