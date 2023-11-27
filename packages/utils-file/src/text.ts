import type { TextFile, TextFileCreator } from '@commonalityco/types';
import fs from 'fs-extra';
import { baseFile } from './base-file';

const createTextFileReader = (
  filepath: string,
  options: { onRead?: (filepath: string) => string | Promise<string> } = {},
): Pick<TextFile, 'get' | 'contains'> => {
  const getSource = async () => {
    if (options.onRead) {
      return options.onRead(filepath);
    }

    return fs.readFile(filepath, 'utf8');
  };

  return {
    async get() {
      const text = await getSource();
      return text.split('\n').filter(Boolean);
    },
    async contains(lines: string[]) {
      try {
        const text = await fs.readFile(filepath, 'utf8');
        const textLines = new Set(text.split('\n').filter(Boolean));

        return lines.every((line) => textLines.has(line));
      } catch {
        return false;
      }
    },
  };
};

const createTextFileWriter = (
  filepath: string,
  options: {
    onWrite?: (filePath: string, data: string) => Promise<void> | void;
    onRead?: (filepath: string) => string | Promise<string>;
  } = {},
): Pick<TextFile, 'set' | 'add' | 'remove'> => {
  const getSource = async () => {
    if (options.onRead) {
      return options.onRead(filepath);
    }

    return fs.readFile(filepath, 'utf8');
  };

  const writeFile = async (text: string) =>
    options.onWrite
      ? options.onWrite(filepath, text)
      : await fs.outputFile(filepath, text);

  return {
    async set(lines: string[]) {
      const text = lines.join('\n');

      await writeFile(text);
    },

    async add(lines: string[]) {
      const text = await getSource();
      const newText = lines.join('\n');
      const updatedText = text ? text + '\n' + newText : newText;

      await writeFile(updatedText);
    },

    async remove(lines: string[]) {
      const text = await getSource();
      const textLines = text.split('\n');
      const newLines = textLines.filter(
        (textLine) => !lines.includes(textLine),
      );

      await writeFile(newLines.join('\n'));
    },
  };
};

export const text: TextFileCreator = (
  filepath,
  { onRead, onWrite, onDelete, onExists } = {},
) => {
  const textWriter = createTextFileWriter(filepath, { onWrite, onRead });
  const textReader = createTextFileReader(filepath, { onRead });
  const file = baseFile(filepath, { onDelete, onExists });

  return {
    ...file,
    ...textWriter,
    ...textReader,
  };
};
