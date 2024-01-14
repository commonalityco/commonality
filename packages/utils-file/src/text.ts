import fs from 'fs-extra';
import { File, file } from './file';
import path from 'pathe';

type Data = string[];

export interface TextFile extends Omit<File, 'get'> {
  get(): Promise<Data | undefined>;
  contains(lines: Data): Promise<boolean>;
  set(lines: Data): Promise<void>;
  add(lines: Data): Promise<void>;
  remove(lines: Data): Promise<void>;
}

export type TextFileCreator = (rootPath: string, filePath: string) => TextFile;

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

    await fs.writeFile(fullPath, text);
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
