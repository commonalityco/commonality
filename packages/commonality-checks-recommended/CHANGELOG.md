# commonality-checks-recommended

## 0.0.25

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
  - commonality@0.2.48

## 0.0.24

### Patch Changes

- Updated dependencies [0508b8f]
  - commonality@0.2.47

## 0.0.23

### Patch Changes

- Updated dependencies [4e64f3e]
  - commonality@0.2.46

## 0.0.22

### Patch Changes

- Updated dependencies [d719a75]
  - commonality@0.2.45

## 0.0.21

### Patch Changes

- Updated dependencies [bbca388]
  - commonality@0.2.44

## 0.0.20

### Patch Changes

- Updated dependencies [00fa1ae]
  - commonality@0.2.43

## 0.0.19

### Patch Changes

- commonality@0.2.42

## 0.0.18

### Patch Changes

- 0faea77: Fixes an issue where the repository field check was creating an incorrectly formatted repository field
- Updated dependencies [0faea77]
  - commonality@0.2.41

## 0.0.17

### Patch Changes

- Updated dependencies [52d572a]
  - commonality@0.2.40

## 0.0.16

### Patch Changes

- a88e9ba: Removes the tag filter from checks and constraints UI for clarity
- Updated dependencies [a88e9ba]
  - commonality@0.2.39

## 0.0.15

### Patch Changes

- b453952: Adds hasTextFile and hasJsonFile utility checks. Adds @commonalityco/studio as a dependency to commonality.
- Updated dependencies [b453952]
  - commonality@0.2.38

## 0.0.14

### Patch Changes

- Updated dependencies [a8cda3c]
  - commonality@0.2.37

## 0.0.13

### Patch Changes

- 3f1e821: Improve tag editing and constraints UX in Commonality Studio
- Updated dependencies [3f1e821]
  - commonality@0.2.36

## 0.0.12

### Patch Changes

- Updated dependencies [c55750f]
- Updated dependencies [de5ffc5]
  - commonality@0.2.32

## 0.0.11

### Patch Changes

- Updated dependencies [70ac615]
  - commonality@0.2.31

## 0.0.10

### Patch Changes

- a2a8cac: Update checks

## 0.0.9

### Patch Changes

- 74e1a9c: update engines
- 74e1a9c: update checks package namne
- Updated dependencies [74e1a9c]
  - commonality@0.2.30

## 0.0.8

### Patch Changes

- Updated dependencies [d693d39]
  - commonality@0.2.29

## 0.0.7

### Patch Changes

- 4bd3547: Create granular packages
- Updated dependencies [4bd3547]
  - commonality@0.2.28

## 0.0.6

### Patch Changes

- 129d264: stability
- Updated dependencies [129d264]
  - commonality@0.2.27

## 0.0.5

### Patch Changes

- Updated dependencies [25fcefa]
  - commonality@0.2.26

## 0.0.4

### Patch Changes

- 33f249e: Always list filepath and publish recommended
  - commonality@0.2.25

## 0.0.3

### Patch Changes

- Updated dependencies [1a98bec]
  - commonality@0.2.25

## 0.0.2

### Patch Changes

- Updated dependencies [1c2d7a5]
  - commonality@0.2.24

## 0.0.1

### Patch Changes

- ad4a813: Finalize Commonality Studio, checks, and constraints
- Updated dependencies [ad4a813]
  - commonality@0.2.23
