# @commonalityco/ui-constraints

## 0.2.45

### Patch Changes

- 4f0f69c: Update dependency graph to use @xyflow/react
- Updated dependencies [4f0f69c]
  - @commonalityco/ui-design-system@0.2.40
  - @commonalityco/utils-package@0.2.39
  - @commonalityco/ui-graph@0.2.44
  - @commonalityco/ui-core@0.2.40

## 0.2.44

### Patch Changes

- @commonalityco/ui-core@0.2.39
- @commonalityco/ui-graph@0.2.43

## 0.2.43

### Patch Changes

- 65ee18a: This release addresses some common feedback around checks and initial setup.

  We are moving from a TS/JS configuration file to a JSON file (`.commonality/config.json`). It's common for developers to create custom checks during initial setup and the `.commonality` directory, will now act as a folder to organize these checks before moving them into a package.

  ```json
  {
    "checks": {
      "*": [
        "has-client-eslint-config",
        "recommended/sorted-dependencies",
        "@scope/team/custom-check"
      ]
    }
  }
  ```

  How checks are resolved in the JSON format:

  1. Checks can be configured with a path to a local file, relative to the `.commonality` folder. Given a path `has-foo`, Commonality will first look for a file named "has-foo" within the `.commonality` folder. You can also pass a relative path like `./testing/has-foo` or `testing/has-foo` to organize checks within the `.commonality` folder.
  2. Checks can be configured via import path. Given a path `@scope/team/custom-check`, Commonality will look for a default export from an entry point named `custom-check` in the package named `@scope/team`. This logic follows the same convention as `import.meta.resolve`.
  3. Checks can be configured via a shortened import path. Given a path `test/has-foo`, if there is no file located at `.commonality/test/has-foo.ts` then it will look for a package named `commonality-checks-test` with an entry point named `has-foo`. This allows for a standard convention and a more readable configuration file similar to eslint.

  Previously the `message` property for a check object allowed a function that could be used to dynamically create an error message. There ended up being a lot of duplicated logic between the `message` and `validate` function and in some cases the two could become out of sync for certain cases. This change change the `message` property to only expect a string, ensuring that the happy path message will always be shown when running `check --verbose`. To create a dynamic message, simply return a message object from the `validate` function. Now, Commonality will return a `fail` or `warn` status for any check who's `validate` function returns a value other than `true.`

  We now automatically create an id for each check on file resolution so the name property is no longer required to parallelize check functions.

- Updated dependencies [65ee18a]
  - @commonalityco/utils-package@0.2.38
  - @commonalityco/ui-graph@0.2.42
  - @commonalityco/ui-core@0.2.39

## 0.2.42

### Patch Changes

- @commonalityco/ui-core@0.2.39
- @commonalityco/ui-graph@0.2.41

## 0.2.41

### Patch Changes

- 9458463: Fix issue where graph would reload multiple times on initial page load
- Updated dependencies [9458463]
  - @commonalityco/ui-graph@0.2.40

## 0.2.40

### Patch Changes

- 0faea77: Fixes an issue where the repository field check was creating an incorrectly formatted repository field
- Updated dependencies [0faea77]
  - @commonalityco/ui-design-system@0.2.39
  - @commonalityco/utils-package@0.2.37
  - @commonalityco/ui-graph@0.2.39
  - @commonalityco/ui-core@0.2.39

## 0.2.39

### Patch Changes

- a88e9ba: Removes the tag filter from checks and constraints UI for clarity
- Updated dependencies [a88e9ba]
  - @commonalityco/ui-graph@0.2.38

## 0.2.38

### Patch Changes

- a8cda3c: Drastically reduce bundle size by deduping and selectively importing
- 7e440ac: Moves constraints from popover to dedicated modal and improves legibility of nodes
- Updated dependencies [7e440ac]
  - @commonalityco/ui-core@0.2.38
  - @commonalityco/ui-design-system@0.2.37

## 0.2.37

### Patch Changes

- 4661b6b: Display dependency constraints in searchable modal
- Updated dependencies [4661b6b]
  - @commonalityco/ui-design-system@0.2.37
  - @commonalityco/ui-core@0.2.37

## 0.2.36

### Patch Changes

- 3f1e821: Improve tag editing and constraints UX in Commonality Studio
- Updated dependencies [3f1e821]
  - @commonalityco/ui-design-system@0.2.36
  - @commonalityco/utils-package@0.2.36
  - @commonalityco/ui-core@0.2.36

## 0.0.5

### Patch Changes

- 202b591: Fixes initialization issues with Commonality Studio and broken links

## 0.0.4

### Patch Changes

- 74e1a9c: update engines
- 74e1a9c: update checks package namne
- Updated dependencies [74e1a9c]
- Updated dependencies [74e1a9c]
  - @commonalityco/ui-design-system@0.0.15
  - @commonalityco/ui-core@0.0.16

## 0.0.3

### Patch Changes

- d693d39: Update Commonality Studio styles
  - @commonalityco/ui-core@0.0.16
  - @commonalityco/ui-design-system@0.0.14

## 0.0.2

### Patch Changes

- 4bd3547: Create granular packages
- Updated dependencies [4bd3547]
  - @commonalityco/ui-design-system@0.0.14
  - @commonalityco/utils-package@0.0.12
  - @commonalityco/ui-core@0.0.16
