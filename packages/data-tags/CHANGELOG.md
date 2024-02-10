# @commonalityco/snapshot

## 0.2.44

### Patch Changes

- Updated dependencies [ca229a7]
- Updated dependencies [ca229a7]
  - @commonalityco/utils-core@0.2.40
  - @commonalityco/data-project@0.2.43

## 0.2.43

### Patch Changes

- Updated dependencies [56baf27]
  - @commonalityco/data-project@0.2.42

## 0.2.42

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
  - @commonalityco/data-project@0.2.41
  - @commonalityco/utils-core@0.2.39

## 0.2.41

### Patch Changes

- Updated dependencies [0508b8f]
  - @commonalityco/data-project@0.2.40
  - @commonalityco/utils-core@0.2.38

## 0.2.40

### Patch Changes

- Updated dependencies [9458463]
  - @commonalityco/data-project@0.2.39

## 0.2.39

### Patch Changes

- 0faea77: Fixes an issue where the repository field check was creating an incorrectly formatted repository field
- Updated dependencies [0faea77]
  - @commonalityco/data-project@0.2.38
  - @commonalityco/utils-core@0.2.37

## 0.2.38

### Patch Changes

- Updated dependencies [52d572a]
  - @commonalityco/data-project@0.2.37

## 0.2.37

### Patch Changes

- a8cda3c: Drastically reduce bundle size by deduping and selectively importing

## 0.2.36

### Patch Changes

- 3f1e821: Improve tag editing and constraints UX in Commonality Studio
- Updated dependencies [3f1e821]
  - @commonalityco/data-project@0.2.36
  - @commonalityco/utils-core@0.2.36

## 0.0.14

### Patch Changes

- 4bd3547: Create granular packages
- Updated dependencies [4bd3547]
  - @commonalityco/data-project@0.0.13
  - @commonalityco/utils-core@0.0.12

## 0.0.13

### Patch Changes

- ad4a813: Finalize Commonality Studio, checks, and constraints
- Updated dependencies [ad4a813]
  - @commonalityco/data-project@0.0.12
  - @commonalityco/utils-core@0.0.11

## 0.0.12

### Patch Changes

- e9a5bc2: Add table view to Studio
- Updated dependencies [e9a5bc2]
  - @commonalityco/data-project@0.0.11
  - @commonalityco/utils-core@0.0.10

## 0.0.11

### Patch Changes

- Updated dependencies [ffbc45c]
  - @commonalityco/utils-core@0.0.9
  - @commonalityco/data-project@0.0.10

## 0.0.10

### Patch Changes

- Updated dependencies [5b61b0e]
  - @commonalityco/utils-core@0.0.8
  - @commonalityco/data-project@0.0.9

## 0.0.9

### Patch Changes

- 91bfd71: Unify into commonality package
- Updated dependencies [91bfd71]
  - @commonalityco/data-project@0.0.8

## 0.0.8

### Patch Changes

- Updated dependencies [26e1636]
  - @commonalityco/utils-core@0.0.7
  - @commonalityco/data-project@0.0.7

## 0.0.7

### Patch Changes

- a7691a8: Add skeleton and dep updates
- Updated dependencies [a7691a8]
  - @commonalityco/data-project@0.0.6
  - @commonalityco/utils-core@0.0.6

## 0.0.6

### Patch Changes

- ee3504f: Distribute studio /dist
- Updated dependencies [ee3504f]
  - @commonalityco/data-project@0.0.5
  - @commonalityco/utils-core@0.0.5

## 0.0.5

### Patch Changes

- dadeafb: Convert to ESM
- Updated dependencies [dadeafb]
  - @commonalityco/data-project@0.0.4
  - @commonalityco/utils-core@0.0.4

## 0.0.4

### Patch Changes

- fb47c73: update build output
- Updated dependencies [fb47c73]
  - @commonalityco/data-project@0.0.3
  - @commonalityco/utils-core@0.0.3

## 0.0.3

### Patch Changes

- 3ff8242: Fix build target for CLI

## 0.0.2

### Patch Changes

- da2c556: Initial release
- Updated dependencies [da2c556]
  - @commonalityco/data-project@0.0.2

## 0.0.6

### Patch Changes

- 76ea8f2: Initial release

## 0.0.5

### Patch Changes

- 66e2af0: Initial publish
