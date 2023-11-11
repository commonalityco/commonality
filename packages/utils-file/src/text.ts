import type {
  TextFile as TextFileType,
  TextFileCreator,
  Workspace,
} from '@commonalityco/types';
import { File } from './file.js';
import fs from 'fs-extra';

export class TextFile extends File implements TextFileType {
  constructor(workspace: Workspace, rootDirectory: string, filename: string) {
    super(workspace, rootDirectory, filename);
  }

  async get() {
    try {
      const text = await fs.readFile(this.filepath, 'utf8');
      return text.split('\n').filter(Boolean);
    } catch {
      return;
    }
  }

  async matches(expected: string | string[]) {
    try {
      const text = await fs.readFile(this.filepath, 'utf8');
      const textLines = text.split('\n').filter(Boolean);

      const result = Array.isArray(expected)
        ? expected.every((line, index) => line === textLines[index])
        : expected === textLines.join('\n');

      return result;
    } catch {
      return false;
    }
  }

  async set(lines: string[]) {
    const text = lines.join('\n');
    await fs.outputFile(this.filepath, text);
  }

  async add(line: string | string[]) {
    const text = Array.isArray(line) ? line.join('\n') : line;
    const currentText = await this.get();
    const updatedText = currentText
      ? currentText.join('\n') + '\n' + text
      : text;
    await fs.outputFile(this.filepath, updatedText);
  }

  async remove(line: string | string[]) {
    const linesToRemove = Array.isArray(line) ? line : [line];
    let text = await this.get();

    if (text) {
      for (const lineToRemove of linesToRemove) {
        text = text.filter((txtLine) => txtLine !== lineToRemove);
      }

      await this.set(text);
    }
  }
}

export const createText = ({
  workspace,
  rootDirectory,
}: {
  workspace: Workspace;
  rootDirectory: string;
}): TextFileCreator => {
  return (filename: string) => new TextFile(workspace, rootDirectory, filename);
};
