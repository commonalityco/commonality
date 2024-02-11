# commonality-checks-recommended

These checks that benefit most multi-package projects. This package also provides some [composable checks](https://docs.commonality.co/checks/creating-checks#composing-checks) that can be used to enforce existing conventions within your project.



## Installation

```bash
npm install commonality-checks-recommended
```

## Usage
```json
{
  "$schema": "https://commonality.co/config.json",
  "checks": {
    "*": [
      "recommended/has-codeowner",
      "recommended/has-readme",
      "recommended/sorted-dependencies"
      // ...
    ]
  }
}

```

## Static checks

These checks don't require any configuration and can be used directly within your project configuration (`.commonality/config.json`).

[**Learn more**](https://docs.commonality.co/checks/sharing-checks#static-checks)

### has-codeowner

**Warning** ⚠️

This check ensures that a package has at least one [codeowner](https://www.commonality.co/docs/codeowners) as determined by the `CODEOWNERS` file. It is important to have a codeowner for each package to ensure that there is a responsible person for the maintenance and updates of the package.

```json
{
  "checks": [
    "*": [
      "recommended/has-codeowner"
    ]
  ]
}
```

### `has-readme`

**Warning** ⚠️

This check ensures that a package has a README.md file.

**Auto-fix:**

A `README.md` file will be created in the package directory with the title and description of the package as well as an installation script.

```json
{
  "checks": [
    "*": [
      "recommended/has-readme"
    ]
  ]
}
```

### valid-package-name

**Error** ❌

This check ensures that the package name in a package's `package.json` file is valid. This will prevent unforeseen issues when publishing packages.

```json
{
  "checks": [
    "*": [
      "recommended/valid-package-name"
    ]
  ]
}
```


### sorted-dependencies

**Warning** ⚠️

This check ensures that the dependencies in a package's `package.json` file are sorted alphabetically. Some package managers will sort dependencies automatically on dependency installation, sorting ahead of time will decrease the size of diffs.

**Auto-fix:**

`dependencies`, `devDependencies`, and `peerDependencies` will be sorted in alphabetical order.

```json
{
  "checks": [
    "*": [
      "recommended/sorted-dependencies"
    ]
  ]
}
```

### extends-repository-field

**Error** ❌

This check ensures that the repository field in the package.json of a package extends the repository field at the root of your project. If there is no repository field in your project's root `package.json` then this check will always pass.

**Auto-fix:**

A `repository` field will be added to the package's `package.json` with the correct path to the package.

```json
{
  "checks": [
    "*": [
      "recommended/extends-repository-field"
    ]
  ]
}
```

### consistent-external-version

**Error** ❌

This check ensures that the external dependencies of a package match the most common or highest version across all packages.

**Auto-fix:**

Dependency versions will be updated to match the most common or highest version of a dependency across all packages in the workspace.

```json
{
  "checks": [
    "*": [
      "recommended/consistent-external-version"
    ]
  ]
}
```


### unique-dependency-types

**Warning** ⚠️

This check ensures that a dependency should only be in one of dependencies, devDependencies, or optionalDependencies in the package.json of a package.

**Auto-fix:**

If a dependency is a `dependency` it will be removed from `devDependencies` and `optionalDependencies`. If a depdnency is a `devDependency` and an `optionalDependency` it will be removed from `dependencies`.

```json
{
  "checks": [
    "*": [
      "recommended/unique-dependency-types"
    ]
  ]
}
```

### `matching-dev-peer-versions`

**Warning** ⚠️

This check ensures that every `peerDependency` is also listed as `devDependency`` with a version range that is a subset of the peerDependency. This will align local development to the experience external consumers will have when installing the package.

**Auto-fix:**

The version range for a `devDependency` will be updated to match it's matching `peerDependency`.

```json
{
  "checks": [
    "*": [
      "recommended/matching-dev-peer-versions"
    ]
  ]
}
```

## Composable checks

Use these checks to create new checks customized to your current conventions and workflows.

[**Learn more**](https://docs.commonality.co/checks/sharing-checks#composed-checks)

### `has-json-file`

**Error** ❌

This check ensures that a JSON file exists with the specified content.

**Auto-fix:**

If the JSON file does not exist or does not contain the expected content, it will be created or merged with the specified content.

```ts .commonality/has-build-scripts.ts
import { hasJson } from 'commonality-checks-recommended';

export default hasJson('package.json', {
  scripts: {
    build: 'tsc --build',
    dev: 'tsc --watch'
  }
})
```

```json .commonality/config.json
{
  "checks": [
    "buildable": [
      "has-build-scripts"
    ]
  ]
}
```

### `has-text-file`

**Error** ❌

This check ensures that a text file exists with the specified content.

**Auto-fix:**

If the text file does not exist or does not contain the expected content, it will be created or appended to with the specified content.

```ts .commonality/has-npm-ignore.ts
import { hasText } from 'commonality-checks-recommended';

export default hasText('.npmignore', ["dist"])
```

```json .commonality/config.json
{
  "checks": [
    "publishable": [
      "has-npm-ignore"
    ]
  ]
}
```
****
