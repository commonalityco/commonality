import { defineCheck } from 'commonality';

export const ensureCodeowner = defineCheck(() => ({
  name: 'commonality/ensure-codeowner',
  validate: async ({ codeowners }) => {
    return codeowners.length > 0;
  },
  message: 'Packages must have a codeowner',
}));
