

## Configuration files
Packages and applications should not define their own configuration files. In order to achieve a unified toolchain across a growing pacakge ecosystem, we have created several packages that provide configuration files for different tools like TailwindCSS, TypeScript, Jest, ESLint, etc. These configuration files should always be used to make this project easier to reason about at scale.

## Building vs. not building
All packages that need to be published should be built using `tsup`. To set up the build process for a package, add a `build` script to the package.json that runs `tsup` with the appropriate arguments.

The `tsup` command should be run from the root of the package directory. For example, the `@commonalityco/ui-foo` package has the following build script:

```json
{
  "scripts": {
    "build": "tsup"
  }
}
```


## Exporting and importing
### React components
All react components should have a default export. This makes it easier to use utilities like `React.lazy` that expect a default export to work. In order to achieve this, UI packages cannot use the "index.js" pattern. Instead, each component should be exported from its own file and the package.json should expose all files within the "src" directory.

### Everything else
All other utilities, constants, business logic, etc should be exported as named exports. This makes it easier to import only what you need from a file.
