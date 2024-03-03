# workshop

## 1.0.36

### Patch Changes

- Updated dependencies [7ba2c80]
  - @commonalityco/ui-design-system@0.2.41
  - @commonalityco/ui-constraints@0.2.46
  - @commonalityco/ui-graph@0.2.45
  - @commonalityco/ui-core@0.2.41
  - @commonalityco/ui-conformance@0.2.41
  - @commonalityco/ui-package@0.2.38

## 1.0.35

### Patch Changes

- 4f0f69c: Update dependency graph to use @xyflow/react
- Updated dependencies [4f0f69c]
  - @commonalityco/ui-design-system@0.2.40
  - @commonalityco/ui-conformance@0.2.41
  - @commonalityco/ui-constraints@0.2.45
  - @commonalityco/ui-package@0.2.38
  - @commonalityco/utils-core@0.2.41
  - @commonalityco/ui-graph@0.2.44
  - @commonalityco/ui-core@0.2.40

## 1.0.34

### Patch Changes

- Updated dependencies [ca229a7]
- Updated dependencies [ca229a7]
  - @commonalityco/utils-core@0.2.40
  - @commonalityco/ui-conformance@0.2.40
  - @commonalityco/types@0.2.38
  - @commonalityco/ui-constraints@0.2.44
  - @commonalityco/ui-core@0.2.39
  - @commonalityco/ui-graph@0.2.43
  - @commonalityco/ui-package@0.2.37

## 1.0.33

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
  - @commonalityco/ui-conformance@0.2.40
  - @commonalityco/ui-constraints@0.2.43
  - @commonalityco/utils-core@0.2.39
  - @commonalityco/types@0.2.38
  - @commonalityco/ui-graph@0.2.42
  - @commonalityco/ui-core@0.2.39
  - @commonalityco/ui-package@0.2.37

## 1.0.32

### Patch Changes

- Updated dependencies [0508b8f]
  - @commonalityco/utils-core@0.2.38
  - @commonalityco/types@0.2.37
  - @commonalityco/ui-conformance@0.2.39
  - @commonalityco/ui-constraints@0.2.42
  - @commonalityco/ui-core@0.2.39
  - @commonalityco/ui-graph@0.2.41
  - @commonalityco/ui-package@0.2.37

## 1.0.31

### Patch Changes

- Updated dependencies [9458463]
  - @commonalityco/ui-constraints@0.2.41
  - @commonalityco/ui-graph@0.2.40

## 1.0.30

### Patch Changes

- 0faea77: Fixes an issue where the repository field check was creating an incorrectly formatted repository field
- Updated dependencies [0faea77]
  - @commonalityco/ui-design-system@0.2.39
  - @commonalityco/ui-conformance@0.2.39
  - @commonalityco/ui-constraints@0.2.40
  - @commonalityco/ui-package@0.2.37
  - @commonalityco/utils-core@0.2.37
  - @commonalityco/ui-graph@0.2.39
  - @commonalityco/ui-core@0.2.39
  - @commonalityco/types@0.2.37

## 1.0.29

### Patch Changes

- Updated dependencies [52d572a]
  - @commonalityco/ui-design-system@0.2.38
  - @commonalityco/ui-conformance@0.2.38
  - @commonalityco/ui-constraints@0.2.39
  - @commonalityco/ui-core@0.2.38
  - @commonalityco/ui-package@0.2.36

## 1.0.28

### Patch Changes

- a88e9ba: Removes the tag filter from checks and constraints UI for clarity
- Updated dependencies [a88e9ba]
  - @commonalityco/ui-conformance@0.2.38
  - @commonalityco/ui-constraints@0.2.39
  - @commonalityco/ui-graph@0.2.38

## 1.0.27

### Patch Changes

- Updated dependencies [a8cda3c]
- Updated dependencies [7e440ac]
- Updated dependencies [7e440ac]
- Updated dependencies [7e440ac]
  - @commonalityco/ui-graph@0.2.37
  - @commonalityco/ui-constraints@0.2.38
  - @commonalityco/ui-core@0.2.38
  - @commonalityco/ui-conformance@0.2.37
  - @commonalityco/ui-design-system@0.2.37
  - @commonalityco/ui-package@0.2.36

## 1.0.26

### Patch Changes

- Updated dependencies [4661b6b]
  - @commonalityco/ui-constraints@0.2.37
  - @commonalityco/ui-design-system@0.2.37
  - @commonalityco/ui-core@0.2.37
  - @commonalityco/ui-conformance@0.2.36
  - @commonalityco/ui-package@0.2.36

## 1.0.25

### Patch Changes

- 3f1e821: Improve tag editing and constraints UX in Commonality Studio
- Updated dependencies [3f1e821]
  - @commonalityco/ui-graph@0.2.36
  - @commonalityco/ui-conformance@0.2.36
  - @commonalityco/ui-constraints@0.2.36
  - @commonalityco/ui-design-system@0.2.36
  - @commonalityco/ui-package@0.2.36
  - @commonalityco/utils-core@0.2.36
  - @commonalityco/ui-core@0.2.36
  - @commonalityco/types@0.2.36

## 1.0.24

### Patch Changes

- Updated dependencies [447c12d]
  - @commonalityco/ui-conformance@0.2.34

## 1.0.23

### Patch Changes

- Updated dependencies [202b591]
  - @commonalityco/ui-graph@0.0.4
  - @commonalityco/ui-constraints@0.0.5

## 1.0.22

### Patch Changes

- Updated dependencies [74e1a9c]
- Updated dependencies [74e1a9c]
  - @commonalityco/ui-constraints@0.0.4
  - @commonalityco/ui-design-system@0.0.15
  - @commonalityco/ui-package@0.0.18
  - @commonalityco/ui-conformance@0.0.2
  - @commonalityco/ui-graph@0.0.3
  - @commonalityco/ui-core@0.0.16

## 1.0.21

### Patch Changes

- Updated dependencies [d693d39]
  - @commonalityco/ui-graph@0.0.3
  - @commonalityco/ui-constraints@0.0.3
  - @commonalityco/ui-core@0.0.16
  - @commonalityco/ui-design-system@0.0.14
  - @commonalityco/ui-package@0.0.17

## 1.0.20

### Patch Changes

- 4bd3547: Create granular packages
- Updated dependencies [4bd3547]
  - @commonalityco/ui-graph@0.0.2
  - @commonalityco/ui-conformance@0.0.2
  - @commonalityco/ui-constraints@0.0.2
  - @commonalityco/ui-design-system@0.0.14
  - @commonalityco/ui-package@0.0.17
  - @commonalityco/utils-core@0.0.12
  - @commonalityco/ui-core@0.0.16
  - @commonalityco/types@0.0.16

## 1.0.19

### Patch Changes

- Updated dependencies [33f249e]
  - @commonalityco/feature-conformance@0.0.20

## 1.0.18

### Patch Changes

- Updated dependencies [1a98bec]
  - @commonalityco/feature-conformance@0.0.19

## 1.0.17

### Patch Changes

- ad4a813: Finalize Commonality Studio, checks, and constraints
- Updated dependencies [ad4a813]
  - @commonalityco/feature-conformance@0.0.18
  - @commonalityco/feature-constraints@0.0.18
  - @commonalityco/ui-design-system@0.0.13
  - @commonalityco/ui-package@0.0.16
  - @commonalityco/utils-core@0.0.11
  - @commonalityco/ui-core@0.0.15
  - @commonalityco/types@0.0.15

## 1.0.16

### Patch Changes

- Updated dependencies [99531bd]
  - @commonalityco/data-graph-worker@0.0.9
  - @commonalityco/ui-package@0.0.15
  - @commonalityco/ui-graph@0.0.15
  - @commonalityco/feature-graph@0.0.13

## 1.0.15

### Patch Changes

- 97987b9: fix bugs in package table
- Updated dependencies [97987b9]
  - @commonalityco/ui-package@0.0.14
  - @commonalityco/ui-core@0.0.14
  - @commonalityco/ui-graph@0.0.14

## 1.0.14

### Patch Changes

- e9a5bc2: Add table view to Studio
- Updated dependencies [e9a5bc2]
  - @commonalityco/data-graph-worker@0.0.8
  - @commonalityco/ui-design-system@0.0.12
  - @commonalityco/feature-graph@0.0.13
  - @commonalityco/utils-graph@0.0.11
  - @commonalityco/utils-core@0.0.10
  - @commonalityco/ui-graph@0.0.14
  - @commonalityco/ui-core@0.0.13
  - @commonalityco/types@0.0.14

## 1.0.13

### Patch Changes

- Updated dependencies [a7a22e3]
  - @commonalityco/feature-graph@0.0.12

## 1.0.12

### Patch Changes

- Updated dependencies [ffbc45c]
  - @commonalityco/ui-design-system@0.0.11
  - @commonalityco/feature-graph@0.0.11
  - @commonalityco/utils-graph@0.0.10
  - @commonalityco/utils-core@0.0.9
  - @commonalityco/ui-graph@0.0.13
  - @commonalityco/ui-core@0.0.12

## 1.0.11

### Patch Changes

- 5b61b0e: Reduce bundle size
- Updated dependencies [5b61b0e]
  - @commonalityco/ui-design-system@0.0.10
  - @commonalityco/feature-graph@0.0.10
  - @commonalityco/utils-graph@0.0.9
  - @commonalityco/utils-core@0.0.8
  - @commonalityco/ui-graph@0.0.12
  - @commonalityco/ui-core@0.0.11

## 1.0.10

### Patch Changes

- Updated dependencies [91bfd71]
  - @commonalityco/ui-design-system@0.0.9
  - @commonalityco/feature-graph@0.0.9
  - @commonalityco/ui-graph@0.0.11
  - @commonalityco/ui-core@0.0.10
  - @commonalityco/types@0.0.13

## 1.0.9

### Patch Changes

- Updated dependencies [e4075d7]
  - @commonalityco/utils-graph@0.0.8

## 1.0.8

### Patch Changes

- Updated dependencies [26e1636]
  - @commonalityco/ui-design-system@0.0.8
  - @commonalityco/feature-graph@0.0.8
  - @commonalityco/utils-graph@0.0.7
  - @commonalityco/utils-core@0.0.7
  - @commonalityco/ui-graph@0.0.10
  - @commonalityco/ui-core@0.0.9

## 1.0.7

### Patch Changes

- Updated dependencies [986fdbf]
  - @commonalityco/ui-design-system@0.0.7
  - @commonalityco/ui-graph@0.0.9

## 1.0.6

### Patch Changes

- Updated dependencies [a7691a8]
  - @commonalityco/ui-design-system@0.0.6
  - @commonalityco/utils-graph@0.0.6
  - @commonalityco/utils-core@0.0.6

## 1.0.5

### Patch Changes

- ee3504f: Distribute studio /dist
- Updated dependencies [ee3504f]
  - @commonalityco/ui-design-system@0.0.5
  - @commonalityco/feature-graph@0.0.7
  - @commonalityco/utils-graph@0.0.5
  - @commonalityco/utils-core@0.0.5
  - @commonalityco/ui-graph@0.0.8
  - @commonalityco/ui-core@0.0.8
  - @commonalityco/types@0.0.12

## 1.0.4

### Patch Changes

- dadeafb: Convert to ESM
- Updated dependencies [dadeafb]
  - @commonalityco/feature-graph@0.0.6
  - @commonalityco/types@0.0.11
  - @commonalityco/ui-core@0.0.6
  - @commonalityco/ui-design-system@0.0.4
  - @commonalityco/ui-graph@0.0.7
  - @commonalityco/utils-core@0.0.4
  - @commonalityco/utils-graph@0.0.4

## 1.0.3

### Patch Changes

- fb47c73: update build output
- Updated dependencies [fb47c73]
  - @commonalityco/feature-graph@0.0.4
  - @commonalityco/types@0.0.10
  - @commonalityco/ui-core@0.0.4
  - @commonalityco/ui-design-system@0.0.3
  - @commonalityco/ui-graph@0.0.4
  - @commonalityco/utils-core@0.0.3
  - @commonalityco/utils-graph@0.0.3

## 1.0.2

### Patch Changes

- d562884: Add zero state and feedback button
- Updated dependencies [d562884]
  - @commonalityco/feature-graph@0.0.3
  - @commonalityco/ui-graph@0.0.3
  - @commonalityco/ui-core@0.0.3

## 1.0.1

### Patch Changes

- da2c556: Initial release
- Updated dependencies [da2c556]
  - @commonalityco/types@0.0.9
  - @commonalityco/ui-core@0.0.2
  - @commonalityco/utils-core@0.0.2
  - @commonalityco/ui-design-system@0.0.2
  - @commonalityco/feature-graph@0.0.2
  - @commonalityco/ui-graph@0.0.2
  - @commonalityco/utils-graph@0.0.2
