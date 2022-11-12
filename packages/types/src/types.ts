export type LocalPackage = {
  path: string;
  name: string;
  version: string;
  tags: string[];
  dependencies: Array<{ name: string; version: string }>;
  devDependencies: Array<{ name: string; version: string }>;
  peerDependencies: Array<{ name: string; version: string }>;
};

export type Config = {
  project: string;
  constraints: Array<{
    tag: string;
    allow: string[];
  }>;
};

export type PackageConfig = {
  tags: string[];
};

export type LocalViolation = {
  constraint: { tag: string; allow: string[] };
  path: string;
  source: string;
  target: string;
  targetTags: string[];
};
