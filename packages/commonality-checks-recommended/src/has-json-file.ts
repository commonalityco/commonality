import { json, diff, Check } from 'commonality';
import isMatch from 'lodash-es/isMatch';

/**
 * Defines a check to ensure a JSON file exists with specified content.
 * This check will fail if the file does not exist or if the content does not match the provided content.
 *
 * **Auto-fix**:
 * If the file does not exist or does not contain the expected content, it will be created or merged with the specified content.
 *
 * @param fileName - The name of the file to check.
 * @param content - An optional object representing the expected content of the JSON file.
 *
 * @example
 * ```ts
 * import { hasJsonFile } from 'commonality-checks-recommended';
 *
 * export default hasJsonFile('package.json', {
 *   scripts: {
 *     build: 'tsc --build',
 *     dev: 'tsc --watch'
 *   }
 * });
 * ```
 */
export const hasJsonFile = (
  fileName: string,
  content?: Record<string, unknown>,
): Check => {
  return {
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
  };
};
