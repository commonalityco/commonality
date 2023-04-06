import fastGlob from 'fast-glob';
import path from 'node:path';
import fs from 'fs-extra';

/**
 * Finds the first file that exists on disk based on the given array of matchers.
 * @param {string[]} matchers - An array of matchers similar to the matcher used in the NPM package find-up.
 * @param {string} root - The root directory to start the search from.
 * @returns {Promise<string | undefined>} - The path of the first found file or undefined if no file is found.
 */
export async function findFirstExistingFile(
  matchers: string[],
  options: { cwd?: string } = {}
): Promise<string | undefined> {
  const searchResults = await fastGlob(matchers, {
    onlyFiles: true,
    cwd: options.cwd,
  });

  for (const filePath of searchResults) {
    const fullPath = path.join(options.cwd ?? './', filePath);

    if (await fs.pathExists(fullPath)) {
      return fullPath;
    }
  }

  return undefined;
}
