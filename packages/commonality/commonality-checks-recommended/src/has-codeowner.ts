import { defineCheck } from 'commonality';

export const hasCodeowner = defineCheck(() => ({
  name: 'commonality/has-codeowner',
  validate: async ({ codeowners }) => {
    return codeowners.length > 0;
  },
  message: 'Packages must have a codeowner',
}));
