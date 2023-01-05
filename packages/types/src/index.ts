export enum PackageType {
  NODE = 'NODE',
  REACT = 'REACT',
  NEXT = 'NEXT',
}

export type LocalDependency = { name: string; version: string };

export type LocalPackage = {
  path: string;
  name: string;
  version: string;
  tags: string[];
  type: string;
  dependencies: LocalDependency[];
  devDependencies: LocalDependency[];
  peerDependencies: LocalDependency[];
  /** The CODEOWNERS that match the path of this package */
  owners: string[];
};

export type Config = {
  project: string;
  constraints?: Array<{
    tags: string[];
    allow: string[];
  }>;
};

export type PackageConfig = {
  tags?: string[];
};

export type LocalViolation = {
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
  /** The tags found in the dependency's configuration file */
  targetTags: string[];
};

export type SnapshotResult = {
  url: string;
};
