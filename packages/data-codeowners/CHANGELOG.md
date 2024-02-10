# @commonalityco/traverse

## 0.2.39

### Patch Changes

- a4a63fe: Fixes a bug where codeowner paths would not match a path to a package directory

## 0.2.38

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

## 0.2.37

### Patch Changes

- 0faea77: Fixes an issue where the repository field check was creating an incorrectly formatted repository field

## 0.2.36

### Patch Changes

- 3f1e821: Improve tag editing and constraints UX in Commonality Studio

## 0.0.18

### Patch Changes

- 4bd3547: Create granular packages

## 0.0.17

### Patch Changes

- ad4a813: Finalize Commonality Studio, checks, and constraints

## 0.0.16

### Patch Changes

- 99531bd: Cache result of graph calculations

## 0.0.15

### Patch Changes

- e9a5bc2: Add table view to Studio

## 0.0.14

### Patch Changes

- 91bfd71: Unify into commonality package

## 0.0.13

### Patch Changes

- a7691a8: Add skeleton and dep updates

## 0.0.12

### Patch Changes

- 0457822: add link command

## 0.0.11

### Patch Changes

- a4e018c: Bundle CLI

## 0.0.10

### Patch Changes

- ee3504f: Distribute studio /dist

## 0.0.9

### Patch Changes

- dadeafb: Convert to ESM

## 0.0.8

### Patch Changes

- fb47c73: update build output

## 0.0.7

### Patch Changes

- da2c556: Initial release

## 0.0.5

### Patch Changes

- 76ea8f2: Initial release

## 0.0.4

### Patch Changes

- 66e2af0: Initial publish

## 0.0.4

### Patch Changes

- 7b374d1: Change to projectId
- 3849716: Change config file format from json to js
