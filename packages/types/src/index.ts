export type Dependency = { name: string; version: string };

export type Package = {
  path: string;
  name: string;
  version: string;
  tags?: string[];
  dependencies: Dependency[];
  devDependencies: Dependency[];
  peerDependencies: Dependency[];
  /** The CODEOWNERS that match the path of this package */
  owners?: string[];
};

export type ProjectConfig = {
  projectId: string;
  constraints?: Array<{
    tags: string[];
    allow: string[];
  }>;
};

export type PackageConfig = {
  tags?: string[];
};

export type Violation = {
  /** The path to the package with violation relative to the root of the monorepo */
  path: string;
  /** The name of dependent */
  sourceName: string;
  /** The name of dependency */
  targetName: string;
  /** The tags to which the constraint is applied to */
  constraintTags: string[];
  /** The tags allowed by the constraint */
  allowedTags: string[];
  /** The tags found in the dependency's configuration file. If undefined, the target package has no configuration file. */
  targetTags?: string[];
};

export type SnapshotResult = {
  url: string;
};

export type PackageJson = {
  workspaces?: string[];
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

export type SnapshotData = {
  projectId: string;
  branch: string;
  packages: Package[];
  tags: string[];
};
