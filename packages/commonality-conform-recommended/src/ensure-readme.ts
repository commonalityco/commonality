import { PackageJson } from '@commonalityco/types';
import { defineConformer } from 'commonality';

export const ensureReadme = defineConformer(() => ({
  name: 'COMMONALITY/ENSURE_README',
  validate: async ({ text }) => text('README.md').exists(),
  fix: async ({ text, json }) => {
    const packageJson = await json('package.json').get<PackageJson>();

    if (!packageJson) {
      return;
    }

    return text('README.md').set([
      `# ${packageJson.name}`,
      `> ${packageJson.description}`,
      '## Installation',
      '',
      '```sh',
      `npm install ${packageJson.name}`,
      '```',
    ]);
  },
  message: `Package must have a README.md file`,
}));
