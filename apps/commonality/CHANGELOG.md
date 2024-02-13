# @commonalityco/cli

## 0.2.56

### Patch Changes

- 29c0f5b: Fixes an issue where telemetry was not initialized before profiling

## 0.2.55

### Patch Changes

- 39ac4d8: Adds telemetry to each CLI command

## 0.2.54

### Patch Changes

- b27e7a1: Adds anonymous telemetry to commonality and studio. View current telemetry status with `commonality telemetry list`.
- Updated dependencies [b27e7a1]
  - @commonalityco/studio@0.2.49

## 0.2.53

### Patch Changes

- 4ceed0c: Includes a $schema property for inline documentation for project configuration

## 0.2.52

### Patch Changes

- Updated dependencies [8afb72a]
  - @commonalityco/studio@0.2.48

## 0.2.51

### Patch Changes

- a4a63fe: Fixes a bug where codeowner paths would not match a path to a package directory
- ca229a7: Adds inline documentation for all exported utilities

## 0.2.50

### Patch Changes

- 56baf27: Fixes an issue where package.json files with missing "name" properties would cause any command to throw an error. We now ignore these invalid packages and continue with the command while displaying an error.
- Updated dependencies [56baf27]
  - @commonalityco/studio@0.2.47

## 0.2.49

### Patch Changes

- 98e83dc: Update names of exported static checks in the commonality-checks-recommended package

## 0.2.48

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
  - @commonalityco/studio@0.2.46

## 0.2.47

### Patch Changes

- 0508b8f: Adds a `workspaces` property to the project configuration file. This will allow you to override your package manager's workspaces. This will also allow integrated monorepos to filter packages without adding a workspaces property to their package manager.

## 0.2.46

### Patch Changes

- 4e64f3e: Fixes issue where missing files prevented Studio from starting up
- Updated dependencies [4e64f3e]
  - @commonalityco/studio@0.2.45

## 0.2.45

### Patch Changes

- d719a75: Updates logging information for Studio failures
- Updated dependencies [d719a75]
  - @commonalityco/studio@0.2.44

## 0.2.44

### Patch Changes

- bbca388: Fix issue where configuration wasn't properly created when users chose not to install checks

## 0.2.43

### Patch Changes

- 00fa1ae: Adds better error message when commonality init is run outside a project

## 0.2.42

### Patch Changes

- Updated dependencies [9458463]
  - @commonalityco/studio@0.2.43

## 0.2.41

### Patch Changes

- 0faea77: Fixes an issue where the repository field check was creating an incorrectly formatted repository field
- Updated dependencies [0faea77]
  - @commonalityco/studio@0.2.42

## 0.2.40

### Patch Changes

- 52d572a: Add new project flow with commonality init

## 0.2.39

### Patch Changes

- a88e9ba: Removes the tag filter from checks and constraints UI for clarity
- Updated dependencies [a88e9ba]
  - @commonalityco/studio@0.2.41

## 0.2.38

### Patch Changes

- b453952: Adds hasTextFile and hasJsonFile utility checks. Adds @commonalityco/studio as a dependency to commonality.
- Updated dependencies [b453952]
  - @commonalityco/studio@0.2.40

## 0.2.37

### Patch Changes

- a8cda3c: Drastically reduce bundle size by deduping and selectively importing

## 0.2.36

### Patch Changes

- 3f1e821: Improve tag editing and constraints UX in Commonality Studio

## 0.2.32

### Patch Changes

- c55750f: Fix checks not applying to "\*" when no tags exist in the project
- de5ffc5: Update message for CLI help screen

## 0.2.31

### Patch Changes

- 70ac615: Fixes an issue where you could not exit out of the studio process if the Commonality Studio port never becomes available

## 0.2.30

### Patch Changes

- 74e1a9c: update engines

## 0.2.29

### Patch Changes

- d693d39: Update Commonality Studio styles

## 0.2.28

### Patch Changes

- 4bd3547: Create granular packages

## 0.2.27

### Patch Changes

- 129d264: stability

## 0.2.26

### Patch Changes

- 25fcefa: Fix studio startup

## 0.2.25

### Patch Changes

- 1a98bec: Update Studio install

## 0.2.24

### Patch Changes

- 1c2d7a5: Release commonality

## 0.2.23

### Patch Changes

- ad4a813: Finalize Commonality Studio, checks, and constraints

## 0.2.22

### Patch Changes

- 99531bd: Cache result of graph calculations

## 0.2.21

### Patch Changes

- 5e9bdf2: Fix package table

## 0.2.19

### Patch Changes

- e9a5bc2: Add table view to Studio

## 0.2.18

### Patch Changes

- ec7d204: Fix missing package and add test

## 0.2.17

### Patch Changes

- a7a22e3: bundle CLI

## 0.2.16

### Patch Changes

- ffbc45c: Fixed graph color and reduced bundle size dramatically

## 0.2.15

### Patch Changes

- 5b61b0e: Reduce bundle size

## 0.2.14

### Patch Changes

- 91bfd71: Unify into commonality package

## 0.2.13

### Patch Changes

- e4075d7: Update publish messaging
  - @commonalityco/studio@0.2.13

## 0.1.9

### Patch Changes

- a7691a8: Add skeleton and dep updates
  - @commonalityco/studio@0.2.10

## 0.1.8

### Patch Changes

- 0457822: add link command
- Updated dependencies [0457822]
  - @commonalityco/studio@0.2.9

## 0.1.7

### Patch Changes

- a4e018c: Bundle CLI
- Updated dependencies [a4e018c]
  - @commonalityco/studio@0.2.8

## 0.1.6

### Patch Changes

- ee3504f: Distribute studio /dist
- Updated dependencies [ee3504f]
  - @commonalityco/data-codeowners@0.0.10
  - @commonalityco/data-violations@0.0.10
  - @commonalityco/data-documents@0.0.6
  - @commonalityco/data-packages@0.0.11
  - @commonalityco/data-project@0.0.5
  - @commonalityco/utils-core@0.0.5
  - @commonalityco/data-tags@0.0.6
  - @commonalityco/studio@0.2.6

## 0.1.5

### Patch Changes

- dadeafb: Convert to ESM
- Updated dependencies [dadeafb]
  - @commonalityco/data-codeowners@0.0.9
  - @commonalityco/data-documents@0.0.5
  - @commonalityco/data-packages@0.0.10
  - @commonalityco/data-project@0.0.4
  - @commonalityco/data-tags@0.0.5
  - @commonalityco/data-violations@0.0.9
  - @commonalityco/studio@0.2.5
  - @commonalityco/utils-core@0.0.4

## 0.1.4

### Patch Changes

- @commonalityco/studio@0.2.4

## 0.1.3

### Patch Changes

- Updated dependencies [b03ab98]
  - @commonalityco/data-packages@0.0.9
  - @commonalityco/studio@0.2.3

## 0.1.2

### Patch Changes

- Updated dependencies [597a229]
  - @commonalityco/studio@0.2.2

## 0.1.1

### Patch Changes

- 30cdff1: Fix overlay for graph

## 0.1.0

### Minor Changes

- ed774a4: Lock step compatibility

### Patch Changes

- Updated dependencies [ed774a4]
  - @commonalityco/studio@0.2.0

## 0.0.27

### Patch Changes

- fb47c73: update build output
- Updated dependencies [fb47c73]
  - @commonalityco/data-codeowners@0.0.8
  - @commonalityco/data-documents@0.0.4
  - @commonalityco/data-packages@0.0.8
  - @commonalityco/data-project@0.0.3
  - @commonalityco/data-tags@0.0.4
  - @commonalityco/data-violations@0.0.8
  - @commonalityco/studio@0.1.15
  - @commonalityco/utils-core@0.0.3

## 0.0.26

### Patch Changes

- Updated dependencies [d562884]
  - @commonalityco/studio@0.1.14

## 0.0.25

### Patch Changes

- 2cc0373: Open on 127.0.0.1 instead of localhost

## 0.0.24

### Patch Changes

- 7d2d1da: ignore weird files and point to latest studio
- Updated dependencies [7d2d1da]
  - @commonalityco/studio@0.1.13

## 0.0.23

### Patch Changes

- f82e714: "facepalm"
- Updated dependencies [f82e714]
  - @commonalityco/studio@0.1.12

## 0.0.22

### Patch Changes

- 77244cc: Ugh
- Updated dependencies [77244cc]
  - @commonalityco/studio@0.1.11

## 0.0.21

### Patch Changes

- c8fe893: Remove bundle analyzer from prod deps
- Updated dependencies [c8fe893]
  - @commonalityco/studio@0.1.10

## 0.0.20

### Patch Changes

- 24d85da: Remove internal deps from server.js
- Updated dependencies [24d85da]
  - @commonalityco/studio@0.1.9

## 0.0.19

### Patch Changes

- d4515ef: prod to dev deps
- Updated dependencies [d4515ef]
  - @commonalityco/studio@0.1.8

## 0.0.18

### Patch Changes

- fb9e932: update
- Updated dependencies [fb9e932]
  - @commonalityco/studio@0.1.6

## 0.0.17

### Patch Changes

- 94f9a78: Fix build output
- Updated dependencies [94f9a78]
  - @commonalityco/studio@0.1.5

## 0.0.16

### Patch Changes

- 3ff8242: Fix build target for CLI
- Updated dependencies [3ff8242]
  - @commonalityco/data-documents@0.0.3
  - @commonalityco/data-tags@0.0.3
  - @commonalityco/studio@0.1.4

## 0.0.15

### Patch Changes

- da2c556: Initial release
- Updated dependencies [da2c556]
  - @commonalityco/studio@0.1.3
  - @commonalityco/utils-core@0.0.2
  - @commonalityco/data-codeowners@0.0.7
  - @commonalityco/data-documents@0.0.2
  - @commonalityco/data-packages@0.0.7
  - @commonalityco/data-project@0.0.2
  - @commonalityco/data-tags@0.0.2
  - @commonalityco/data-violations@0.0.7

## 0.0.13

### Patch Changes

- 76ea8f2: Initial release
- Updated dependencies [76ea8f2]
  - @commonalityco/constraints@0.0.5
  - @commonalityco/codeowners@0.0.5
  - @commonalityco/snapshot@0.0.6
  - @commonalityco/traverse@0.0.6
  - @commonalityco/dashboard@0.1.2

## 0.0.12

### Patch Changes

- 66e2af0: Initial publish
- Updated dependencies [66e2af0]
  - @commonalityco/constraints@0.0.4
  - @commonalityco/codeowners@0.0.4
  - @commonalityco/snapshot@0.0.5
  - @commonalityco/traverse@0.0.5
  - @commonalityco/dashboard@0.1.1

## 0.0.11

### Patch Changes

- f076461: fix: add traverse as prod dep

## 0.0.10

### Patch Changes

- 28fc8ec: Move constraints to be a prod dep

## 0.0.9

### Patch Changes

- 7b374d1: Change to projectId
- 3849716: Change config file format from json to js
- ff2adad: Decorate snapshot with CODEOWNERS

## 0.0.8

### Patch Changes

- b81d284: commonality validate has been added to the CLI

## 0.0.7

### Patch Changes

- ffc4586: Convert to ESM
- Updated dependencies [ffc4586]
  - @commonalityco/codeowners@0.0.3

## 0.0.6

### Patch Changes

- 1c0b0d9: Publish owners for packages and improve CLI ux
- Updated dependencies [1c0b0d9]
  - @commonalityco/codeowners@0.0.2

## 0.0.5

### Patch Changes

- 82e0fc8: Improved error handling for publish command
- Updated dependencies [82e0fc8]
  - @commonalityco/errors@0.0.2

## 0.0.4

### Patch Changes

- 29af66d: Point to production publishing URL

## 0.0.3

### Patch Changes

- 9a9bd08: Make configstore a production dependency

## 0.0.2

### Patch Changes

- Allow use of publish keys with the publish api
