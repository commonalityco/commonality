import { Check } from 'commonality';

export default {
  name: 'commonality/has-codeowner',
  level: 'warning',
  validate: async ({ codeowners }) => {
    return codeowners.length > 0;
  },
  message: 'Packages must have a codeowner',
} satisfies Check;
