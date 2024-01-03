import { defineCheck, json, text, PackageJson } from 'commonality';

export const hasReadme = defineCheck(() => ({
  name: 'commonality/has-readme',

  validate: async (context) => {
    return text(context.package.path, 'README.md').exists();
  },

  fix: async (context) => {
    const packageJson = await json<PackageJson>(
      context.package.path,
      'package.json',
    ).get();

    if (!packageJson) {
      return;
    }

    await text(context.package.path, 'README.md').set([
      `# ${packageJson.name}`,
      `> ${packageJson.description}`,
    ]);
  },

  message: `Package must have a README.md file`,
}));
