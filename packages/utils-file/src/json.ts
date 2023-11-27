import { jsonReader } from './json/json-reader';
import { jsonWriter } from './json/json-writer';
import { JsonFileCreator } from '@commonalityco/types';
import { baseFile } from './base-file';

export const json: JsonFileCreator = (
  filepath,
  { onWrite, onDelete, onExists, onRead } = {},
) => {
  const reader = jsonReader(filepath, { onRead });
  const writer = jsonWriter(filepath, { onRead, onWrite });
  const file = baseFile(filepath, { onDelete, onExists });

  return {
    ...file,
    ...reader,
    ...writer,
  };
};
