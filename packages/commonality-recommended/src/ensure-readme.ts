import { defineCheck, json, text, PackageJson } from 'commonality';

export const ensureReadme = defineCheck(() => ({
  name: 'commonality/ensure-readme',

  validate: async ({ workspace }) => {
    return text(workspace.path, 'README.md').exists();
  },

  fix: async ({ workspace }) => {
    const packageJson = await json<PackageJson>(
      workspace.path,
      'package.json',
    ).get();

    if (!packageJson) {
      return;
    }

    await text(workspace.path, 'README.md').set([
      `# ${packageJson.name}`,
      `> ${packageJson.description}`,
    ]);
  },

  message: `Package must have a README.md file`,
}));
