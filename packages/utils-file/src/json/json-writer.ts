import fs from 'fs-extra';
import omit from 'lodash-es/omit';
import merge from 'lodash-es/merge';
import { JsonFile } from '@commonalityco/types';
import detectIndent from 'detect-indent';

export const jsonWriter = (
  filepath: string,
  options: {
    onExists?: (filepath: string) => Promise<boolean> | boolean;
    onWrite?: (filepath: string, data: unknown) => Promise<void> | void;
    onRead?: (
      filepath: string,
    ) => Record<string, unknown> | Promise<Record<string, unknown>>;
  } = {},
): Pick<JsonFile, 'merge' | 'set' | 'remove'> => {
  const getExists = async (): Promise<boolean> => {
    if (options.onExists) {
      return options.onExists(filepath);
    }

    return fs.pathExists(filepath);
  };
  const _exists = getExists();

  const getText = async (): Promise<string | undefined> => {
    return (await _exists) ? await fs.readFile(filepath, 'utf8') : undefined;
  };

  const _text = getText();

  const getSource = async (): Promise<Record<string, unknown>> => {
    if (options.onRead) {
      return options.onRead(filepath);
    }

    const text = await _text;

    if (!text) {
      return {};
    }

    return JSON.parse(text);
  };

  const writeFile = async (json: unknown) => {
    const text = await _text;
    const defaultIndent = '    ';
    const indent = text
      ? detectIndent(text).indent || defaultIndent
      : defaultIndent;

    return options.onWrite
      ? options.onWrite(filepath, json)
      : fs.writeFileSync(filepath, JSON.stringify(json, undefined, indent));
  };

  return {
    async merge(value): Promise<void> {
      try {
        const json = await getSource();
        const updatedJson = merge(json, value);

        await writeFile(updatedJson);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }

        throw error;
      }
    },

    async set(value): Promise<void> {
      try {
        await writeFile(value);
      } catch {
        return;
      }
    },

    async remove(accessPath: string) {
      try {
        const json = await getSource();
        const updatedJson = omit(json, accessPath);

        await writeFile(updatedJson);
      } catch {
        return;
      }
    },
  };
};
