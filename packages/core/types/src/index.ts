import { DependencyType, AllPackagesWildcard } from '@commonalityco/utils-core';

export type Constraint =
  | {
      applyTo: string;
      allow: string[] | typeof AllPackagesWildcard;
    }
  | {
      applyTo: string;
      disallow: string[] | typeof AllPackagesWildcard;
    }
  | {
      applyTo: string;
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
