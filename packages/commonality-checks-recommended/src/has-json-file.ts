import { defineCheck, json, diff } from 'commonality';
import isMatch from 'lodash-es/isMatch';

export const hasJsonFile = defineCheck(
  (fileName: string, content?: Record<string, unknown>) => {
    return {
      name: 'commonality/has-json-file',
      level: 'error',
      message: async (ctx) => {
        const jsonFile = await json(ctx.package.path, fileName).get();

        if (!jsonFile) return { title: `File "${fileName}" does not exist` };

        if (content && !isMatch(jsonFile, content)) {
          return {
            title: `"${fileName}" does not contain expected content`,
            suggestion: diff(jsonFile, content),
          };
        }

        return { title: `${fileName} exists` };
      },
      validate: async (ctx) => {
        const jsonFile = await json(ctx.package.path, fileName).get();

        if (!jsonFile) return false;

        if (!content) return true;

        return isMatch(jsonFile, content);
      },
      fix: async (ctx) => {
        if (!content) return;

        await json(ctx.package.path, fileName).merge(content);
      },
    };
  },
);
