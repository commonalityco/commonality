import { DependencyType } from '@commonalityco/utils-core';

/**
 * @typedef {Object} Document
 * @property {string} filename - The name of the Markdown file.
 * @property {string} content - The contents of the Markdown file in utf-8 format.
 */
export type Document = {
  filename: string;
  content: string;
};

export type Violation = {
  sourceName: string;
  targetName: string;

  /** The tags to which the constraint is applied to */
  matchTags: string[];
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

export type Owner = string;

export type Tag = string;

export type Package = {
  path: string;
  name: string;
  description?: string;
  version: string;
  tags?: Tag[];
  dependencies: Dependency[];
  devDependencies: Dependency[];
  peerDependencies: Dependency[];
  /** The CODEOWNERS that match the path of this package */
  owners?: Owner[];
  docs: {
    readme?: Document;
    pages: Document[];
  };
};

export type ProjectConfig = {
  projectId?: string;
  stripScopeFromPackageNames?: boolean;
  constraints?: Array<
    | {
        tags: string[];
        allow: string[];
      }
    | {
        tags: string[];
        disallow: string[];
      }
    | {
        tags: string[];
        allow: string[];
        disallow: string[];
      }
  >;
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
