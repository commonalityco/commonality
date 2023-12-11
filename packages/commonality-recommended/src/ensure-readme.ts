import { defineCheck, json, text, PackageJson } from 'commonality';
import path from 'node:path';

export const ensureReadme = defineCheck(() => ({
  name: 'commonality/ensure-readme',

  validate: async ({ workspace }) => {
    return text(path.join(workspace.path, 'README.md')).exists();
  },

  fix: async ({ workspace }) => {
    const packageJson = await json<PackageJson>(
      path.join(workspace.path, 'package.json'),
    ).get();

    if (!packageJson) {
      return;
    }

    await text(path.join(workspace.path, 'README.md')).set([
      `# ${packageJson.name}`,
      `> ${packageJson.description}`,
    ]);
  },

  message: `Package must have a README.md file`,
}));
