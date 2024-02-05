import { json, diff, Check } from 'commonality';
import isMatch from 'lodash-es/isMatch';

export const hasJsonFile = (
  fileName: string,
  content?: Record<string, unknown>,
) => {
  return {
    name: 'commonality/has-json-file',
    level: 'error',
    message: `File "${fileName}" must exist`,
    validate: async (ctx) => {
      const jsonFile = await json(ctx.package.path, fileName).get();

      if (!jsonFile) {
        return { message: `File "${fileName}" does not exist`, path: fileName };
      }

      if (content && !isMatch(jsonFile, content)) {
        return {
          message: `File does not contain expected content`,
          path: fileName,
          suggestion: diff(jsonFile, content),
        };
      }

      return true;
    },
    fix: async (ctx) => {
      if (!content) return;

      await json(ctx.package.path, fileName).merge(content);
    },
  } satisfies Check;
};
