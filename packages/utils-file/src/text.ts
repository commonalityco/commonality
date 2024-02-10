import fs from 'fs-extra';
import { File, file } from './file';
import path from 'pathe';

type Data = string[];

export interface TextFile extends Omit<File, 'get'> {
  /**
   * Reads the contents of any file in text format, returns lines as an array of strings.
   * @returns A promise that resolves with an array of strings representing the file's lines, or `undefined` if the file does not exist.
   *
   * @example
   * const lines = await text(ctx.package.path, '.npmignore').get();
   *
   * console.log(lines);
   * // ['dist', 'node_modules', '.cache']
   */
  get(): Promise<Data | undefined>;

  /**
   * Checks if the file contains the specified lines.
   * @param lines An array of strings representing lines of text to check for in the file.
   * @returns A promise that resolves with a boolean indicating whether all specified lines exist in the file.
   *
   * @example
   * const hasLines = await text(
   *   ctx.package.path,
   *   '.npmignore'
   * ).contains([
   *   'dist',
   *   'node_modules'
   * ]);
   *
   * console.log(hasLines);
   * // true
   */
  contains(lines: Data): Promise<boolean>;

  /**
   * Overwrites the entire contents of the file with the provided lines of text.
   * @param lines An array of strings representing lines of text to write to the file.
   * @returns A promise that resolves when the operation is complete.
   *
   * @example
   * await text(ctx.package.path, '.npmignore').set([
   *   'dist',
   *   'node_modules'
   * ]);
   */
  set(lines: Data): Promise<void>;

  /**
   * Adds the specified lines to the file. If the file does not exist, it will be created.
   * @param lines An array of strings representing lines of text to add to the file.
   * @returns A promise that resolves when the operation is complete.
   *
   * @example
   * await text(ctx.package.path, '.npmignore').add([
   *   'dist',
   *   'node_modules'
   * ]);
   */
  add(lines: Data): Promise<void>;

  /**
   * Removes the specified lines from the file, if they exist.
   * @param lines An array of strings representing lines of text to remove from the file.
   * @returns A promise that resolves when the operation is complete.
   *
   * @example
   * await text(ctx.package.path, '.npmignore').remove(['dist']);
   */
  remove(lines: Data): Promise<void>;
}

export type TextFileCreator = (rootPath: string, filePath: string) => TextFile;

/**
 *
 * The `text` utility provides methods for reading, writing, and manipulating any file in text format with optional type safety.
 *
 * Documentation: https://docs.commonality.co/reference/text
 *
 * @example
 * const lines = await text(ctx.package.path, '.npmignore').get();
 *
 * console.log(lines);
 * // ['dist', 'node_modules', '.cache']
 */
export const text: TextFileCreator = (rootPath, filePath): TextFile => {
  const fullPath = path.join(rootPath, filePath);
  const rawFile = file(fullPath);

  const getLines = async (): Promise<Data | undefined> => {
    const text = await rawFile.get();

    if (!text) {
      return;
    }

    return text.split('\n');
  };

  const writeLines = async (lines: string[]) => {
    const text = lines.join('\n');

    await fs.outputFile(fullPath, text);
  };

  return {
    ...rawFile,
    async get() {
      const text = await getLines();

      if (!text) {
        return;
      }

      return text;
    },
    async contains(matchingLines) {
      try {
        const lines = await getLines();

        if (!lines) {
          return false;
        }

        return matchingLines.every((line) => lines.includes(line));
      } catch {
        return false;
      }
    },
    async set(lines) {
      await writeLines(lines);
    },

    async add(newLines) {
      const lines = await getLines();

      if (!lines) {
        await writeLines(newLines);
        return;
      }

      const linesToWrite = [...lines, ...newLines];

      await writeLines(linesToWrite);
    },

    async remove(linesToRemove) {
      const lines = await getLines();

      if (!lines) {
        return;
      }

      const linesToWrite = lines.filter(
        (textLine) => !linesToRemove.includes(textLine),
      );

      await writeLines(linesToWrite);
    },
  } satisfies TextFile;
};
