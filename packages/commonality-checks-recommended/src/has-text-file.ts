import { text, diff, Check } from 'commonality';
import isMatch from 'lodash-es/isMatch';

export const hasTextFile = (fileName: string, content?: string[]) => {
  return {
    level: 'error',
    message: `File "${fileName}" must exist`,
    validate: async (ctx) => {
      const textFile = await text(ctx.package.path, fileName).get();

      if (!textFile)
        return { message: `File "${fileName}" does not exist`, path: fileName };

      if (!content) return true;

      if (!isMatch(textFile, content)) {
        return {
          message: `File does not contain expected content`,
          path: fileName,
          suggestion: diff(textFile, content),
        };
      }

      return true;
    },
    fix: async (ctx) => {
      if (!content) return;

      await text(ctx.package.path, fileName).add(content);
    },
  } satisfies Check;
};
