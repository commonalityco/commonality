import { defineCheck, text, diff } from 'commonality';
import isMatch from 'lodash-es/isMatch';

export const hasTextFile = defineCheck(
  (fileName: string, content?: string[]) => {
    return {
      name: 'commonality/has-text-file',
      level: 'error',
      message: async (ctx) => {
        const textFile = await text(ctx.package.path, fileName).get();

        if (!textFile) return { title: `File "${fileName}" does not exist` };

        if (content && !isMatch(textFile, content)) {
          return {
            title: `"${fileName}" does not contain expected content`,
            suggestion: diff(textFile, content),
          };
        }

        return { title: `${fileName} exists` };
      },
      validate: async (ctx) => {
        const textFile = await text(ctx.package.path, fileName).get();

        if (!textFile) return false;

        if (!content) return true;

        return isMatch(textFile, content);
      },
      fix: async (ctx) => {
        if (!content) return;

        await text(ctx.package.path, fileName).add(content);
      },
    };
  },
);
