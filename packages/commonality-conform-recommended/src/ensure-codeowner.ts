import { defineConformer } from 'commonality';

export const ensureCodeowner = defineConformer(() => ({
  name: 'COMMONALITY/ENSURE_CODEOWNER',
  validate: async ({ workspace }) => {
    return workspace.codeowners.length > 0;
  },
  message: 'Packages must have a codeowner',
}));
