import { defineConformer } from 'commonality';

export const ensureCodeowner = defineConformer(() => ({
  name: 'COMMONALITY/ENSURE_CODEOWNER',
  validate: async ({ codeowners }) => {
    return codeowners.length > 0;
  },
  message: 'Packages must have a codeowner',
}));
