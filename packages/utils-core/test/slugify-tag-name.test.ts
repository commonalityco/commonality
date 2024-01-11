import { describe, test, expect } from 'vitest';
import { slugifyTagName } from '../src/slugify-tag-name.js';

describe('when passed a tag name with special characters', () => {
  test('returns the correct tag', () => {
    const tagName = slugifyTagName('/This is a @tag!  ');

    expect(tagName).toEqual('this-is-a-tag');
  });
});
