import { defineCheck, json, text, PackageJson } from 'commonality';
import path from 'node:path';

export const ensureReadme = defineCheck(() => ({
  name: 'commonality/ensure-readme',

  validate: async ({ workspace }) => {
    const result = await text(path.join(workspace.path, 'README.md')).exists();

    return result;
  },

  fix: async ({ workspace }) => {
    const packageJson = await json<PackageJson>(
      path.join(workspace.path, 'package.json'),
    ).get();

    if (!packageJson) {
      return;
    }

    const readmePath = path.join(workspace.path, 'README.md');

    try {
      await text(readmePath).set([
        `# ${packageJson.name}`,
        `> ${packageJson.description}`,
        '## Installation',
        '',
        '```sh',
        `npm install ${packageJson.name}`,
        '```',
      ]);
    } catch (error) {
      console.log({ error });
    }
  },

  message: `Package must have a README.md file`,
}));
