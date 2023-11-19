import type {
  TextFileReader as TextFileReaderType,
  TextFileWriter as TextFileWriterType,
  TextFileFormatter as TextFileFormatterType,
} from '@commonalityco/types';
import fs from 'fs-extra';
import {
  diff as jestDiff,
  diffLinesUnified,
  diffLinesUnified2,
} from 'jest-diff';
import chalk from 'chalk';

export const createTextFileReader = (filepath: string): TextFileReaderType => {
  return {
    async get() {
      const text = await fs.readFile(filepath, 'utf8');
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
    async exists() {
      try {
        return await fs.pathExists(filepath);
      } catch (error) {
        console.error(`Error checking if file exists: ${error}`);
        return false;
      }
    },
  };
};

export const createTextFileWriter = (filepath: string): TextFileWriterType => {
  return {
    async set(lines: string[]) {
      const text = lines.join('\n');
      await fs.outputFile(filepath, text);
    },
    async add(lines: string[]) {
      const text = lines.join('\n');
      const currentText = await fs.readFile(filepath, 'utf8');
      const updatedText = currentText ? currentText + '\n' + text : text;
      await fs.outputFile(filepath, updatedText);
    },
    async remove(lines: string[]) {
      const text = await fs.readFile(filepath, 'utf8');
      const textLines = text.split('\n');

      const newLines = textLines.filter(
        (textLine) => !lines.includes(textLine),
      );

      await fs.outputFile(filepath, newLines.join('\n'));
    },
    async delete() {
      try {
        await fs.remove(filepath);
      } catch (error) {
        console.error(`Error deleting file: ${error}`);
      }
    },
  };
};

export const createTextFileFormatter = (
  filepath: string,
): TextFileFormatterType => {
  return {
    async diff(value: string[]) {
      const text = await fs.readFile(filepath, 'utf8');
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
