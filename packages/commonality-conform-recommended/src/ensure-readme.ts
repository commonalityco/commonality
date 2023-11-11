import { defineConformer } from 'commonality';

export const ensureReadme = defineConformer(() => ({
  name: 'COMMONALITY/ENSURE_README',
  validate: async ({ text }) => text('README.md').exists(),
  fix: async ({ workspace, text }) => {
    return text('README.md').set([
      `# ${workspace.packageJson.name}`,
      `> ${workspace.packageJson.description}`,
      '## Installation',
      '',
      '```sh',
      `npm install ${workspace.packageJson.name}`,
      '```',
    ]);
  },
  message: `Package must have a README.md file`,
}));
