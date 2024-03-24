import { describe, expect, test } from 'vitest';
import { formatTagName } from '../src/format-tag-name.js';

describe('when passed a tag name', () => {
  test('returns the correct string', () => {
    const tagName = formatTagName('Hello this is awesome!');

    expect(tagName).toEqual('hello-this-is-awesome');
  });
});
