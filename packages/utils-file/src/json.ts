import { jsonReader } from './json/json-reader';
import { jsonWriter } from './json/json-writer';
import { JsonFileCreator } from '@commonalityco/types';
import { baseFile } from './base-file';

export const json: JsonFileCreator = (
  filepath,
  { defaultSource, onWrite, onDelete, onExists } = {},
) => {
  const reader = jsonReader(filepath, { defaultSource });
  const writer = jsonWriter(filepath, { defaultSource, onWrite });
  const file = baseFile(filepath, { defaultSource, onDelete, onExists });

  return {
    ...file,
    ...reader,
    ...writer,
  };
};
