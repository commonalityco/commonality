import type { TextFile, TextFileCreator } from '@commonalityco/types';
import fs from 'fs-extra';
import { diffLinesUnified } from 'jest-diff';
import chalk from 'chalk';
import { baseFile } from './base-file';

const createTextFileReader = (
  filepath: string,
  options: { defaultSource?: string } = {},
): Pick<TextFile, 'get' | 'contains'> => {
  const getSource = async () =>
    options.defaultSource || (await fs.readFile(filepath, 'utf8'));

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
    defaultSource?: string;
  } = {},
): Pick<TextFile, 'set' | 'add' | 'remove'> => {
  const getSource = async () =>
    options.defaultSource || (await fs.readFile(filepath, 'utf8'));
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

const createTextFileFormatter = (
  filepath: string,
  options: { defaultSource?: string } = {},
): Pick<TextFile, 'diff'> => {
  const getSource = async () =>
    options.defaultSource || (await fs.readFile(filepath, 'utf8'));

  return {
    async diff(value: string[]) {
      const text = await getSource();
      const textLines = text.split('\n').filter(Boolean);

      const textSubset = textLines.filter((textLine) =>
        value.includes(textLine),
      );

      if (textSubset == value) {
        return 'hello';
      }

      const result = diffLinesUnified(textSubset, value, {
        omitAnnotationLines: true,
        aColor: chalk.dim,
        bColor: chalk.red,
        changeColor: chalk.red,
        commonColor: chalk.green.dim,
        aIndicator: '-',
        bIndicator: '+',
      });

      return result || undefined;
    },
  };
};

export const text: TextFileCreator = (
  filepath,
  { defaultSource, onWrite, onDelete, onExists } = {},
) => {
  const textWriter = createTextFileWriter(filepath, { onWrite, defaultSource });
  const textReader = createTextFileReader(filepath, { defaultSource });
  const textFormatter = createTextFileFormatter(filepath);
  const file = baseFile(filepath, { defaultSource, onDelete, onExists });

  return {
    ...file,
    ...textWriter,
    ...textReader,
    ...textFormatter,
  };
};
