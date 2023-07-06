import { DependencyType } from '@commonalityco/utils-core';

export type Constraint =
  | {
      tag: string;
      allow: string[];
    }
  | {
      tag: string;
      disallow: string[];
    }
  | {
      tag: string;
      allow: string[];
      disallow: string[];
    };

export type Violation = {
  sourcePackageName: string;
  targetPackageName: string;

  /** The tags to which the constraint is applied to */
  constraintTag: string;
  /** The tags allowed by the constraint */
  allowedTags: string[];
  /** The tags disallowed by the constraint */
  disallowedTags: string[];
  /** The tags found in the dependency's configuration file. If undefined, the target package has no configuration file. */
  foundTags?: string[];
};

export type Dependency = {
  name: string;
  version: string;
  type: DependencyType;
};

export type Codeowner = string;

export type CodeownersData = {
  packageName: string;
  codeowners: Codeowner[];
};

export type Document = {
  filename: string;
  isReadme: boolean;
  isRoot: boolean;
  content: string;
};

export type DocumentsData = {
  packageName: string;
  documents: Document[];
};

export type Tag = string;

export type TagsData = { packageName: string; tags: Tag[] };

export type Package = {
  path: string;
  name: string;
  description?: string;
  version: string;
  dependencies: Dependency[];
  devDependencies: Dependency[];
  peerDependencies: Dependency[];
};

export type ProjectConfig = {
  projectId?: string;
  stripScopeFromPackageNames?: boolean;
  constraints?: Constraint[];
};

export type PackageConfig = {
  tags?: string[];
};

export type SnapshotResult = {
  url: string;
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

export type SnapshotData = {
  projectId: string;
  branch: string;
  packages: Package[];
};
