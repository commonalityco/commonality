import { text, diff, Check } from 'commonality';
import isMatch from 'lodash-es/isMatch';

/**
 * Defines a check to ensure a file exists with specified lines of text.
 * This check will fail if the file does not exist or if the content does not match the provided content.
 *
 * **Auto-fix**:
 * If the file does not exist or does not contain the expected content, it will be created or appended to with the specified content.
 *
 * @param fileName - The name of the file to check.
 * @param content - An optional object representing the expected content of the file.
 *
 * @example
 * ```ts
 * import { hasTextFile } from 'commonality-checks-recommended';
 *
 * export default hasTextFile('.npmignore', [
 *   'dist',
 *  'node_modules'
 * ]);
 * ```
 */
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
