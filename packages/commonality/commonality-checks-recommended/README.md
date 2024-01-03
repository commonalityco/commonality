# commonality-checks-recommended

> Commonality's recommended conformers.

## Installation

```sh
npm install commonality-checks-recommended
```

## Checks

### `commonality/has-codeowner`

This check ensures that a package has at least one [codeowner](https://www.commonality.co/docs/codeowners) as determined by the `CODEOWNERS` file. It is important to have a codeowner for each package to ensure that there is a responsible person for the maintenance and updates of the package.

**Usage:**

```ts
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [recommended.hasCodeowner()],
  },
});
```

### `commonality/has-valid-package-name`

This check ensures that the package name in a package's `package.json` file is valid. This will prevent unforeseen issues when publishing packages.

**Usage:**

```ts
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [recommended.hasValidPackageName()],
  },
});
```

### `commonality/has-readme`

This check ensures that a package has a README.md file.

**Fix:**

A `README.md` file will be created in the package directory with the title and description of the package as well as an installation script.

**Usage:**

```ts
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [recommended.hasReadme()],
  },
});
```

### `commonality/has-sorted-dependencies`

This check ensures that the dependencies in a package's `package.json` file are sorted alphabetically. Some package managers will sort dependencies automatically on dependency installation, sorting ahead of time will decrease the size of diffs.

**Fix:**

`dependencies`, `devDependencies`, and `peerDependencies` will be sorted in alphabetical order.

**Usage:**

```ts
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [recommended.hasSortedDependencies()],
  },
});
```

### `commonality/extends-repository-field`

This check ensures that the repository field in the package.json of a package extends the repository field at the root of your project. If there is no repository field in your project's root `package.json` then this check will always pass.

**Fix:**

A `repository` field will be added to the package's `package.json` with the correct path to the package.

**Usage:**

```ts
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [recommended.extendsRepositoryField()],
  },
});
```

### `commonality/has-consistent-external-version`

This check ensures that the external dependencies of a package match the most common or highest version across all packages.

**Fix:**

Dependency versions will be updated to match the most common or highest version of a dependency across all packages in the workspace.

**Usage:**

```ts
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [recommended.hasConsistentExternalVersion()],
  },
});
```

### `commonality/has-unique-dependency-types`

This check ensures that a dependency should only be in one of dependencies, devDependencies, or optionalDependencies in the package.json of a package.

**Fix:**

If a dependency is a `dependency` it will be removed from `devDependencies` and `optionalDependencies`. If a depdnency is a `devDependency` and an `optionalDependency` it will be removed from `dependencies`.

**Usage:**

```ts
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [recommended.hasUniqueDependencyTypes()],
  },
});
```

### `commonality/has-matching-dev-peer-versions`

This check ensures that every `peerDependency` is also listed as `devDependency`` with a version range that is a subset of the peerDependency. This will align local development to the experience external consumers will have when installing the package.

**Fix:**

The version range for a `devDependency` will be updated to match it's matching `peerDependency`.

**Usage:**

```ts
import * as recommended from 'commonality-checks-recommended';

export default defineConfig({
  checks: {
    '*': [recommended.hasMatchingDevPeerVersions()],
  },
});
```
