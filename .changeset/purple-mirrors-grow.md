---
"commonality-checks-recommended": patch
"@commonalityco/utils-conformance": patch
"@commonalityco/data-constraints": patch
"@commonalityco/utils-onboarding": patch
"@commonalityco/data-codeowners": patch
"@commonalityco/ui-conformance": patch
"@commonalityco/ui-constraints": patch
"@commonalityco/data-packages": patch
"@commonalityco/utils-package": patch
"@commonalityco/data-project": patch
"@commonalityco/utils-core": patch
"@commonalityco/utils-file": patch
"@commonalityco/data-tags": patch
"commonality": patch
"@commonalityco/types": patch
"workshop": patch
"@commonalityco/studio": patch
---

This release addresses some common feedback around checks and initial setup.

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
