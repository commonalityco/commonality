import stripAnsi from 'strip-ansi';
import { describe, test, expect } from 'vitest';
import { diff } from './diff';

describe('diff', () => {
  test('returns undefined if source and target are equal', () => {
    expect(diff('foo', 'foo')).toBe(undefined);
    expect(diff({}, {})).toBe(undefined);
    expect(diff(1, 1)).toBe(undefined);
    expect(diff([], [])).toBe(undefined);
  });

  test('returns a diff if source and target are not equal and are strings', () => {
    const result = stripAnsi(diff('foo', 'bar') ?? '');

    expect(result).toMatchInlineSnapshot(`
      "  foo
      + bar"
    `);
  });

  test('returns a diff if source and target are not equal and are numbers', () => {
    const result = stripAnsi(diff(1, 2) ?? '');

    expect(result).toMatchInlineSnapshot(`
      "  1
      + 2"
    `);
  });

  test('returns a diff if source and target are not equal and are objects', () => {
    const result = stripAnsi(diff({ name: 'pkg-a' }, { name: 'pkg-b' }) ?? '');

    expect(result).toMatchInlineSnapshot(`
      "  Object {
          "name": "pkg-a",
      +   "name": "pkg-b",
        }"
    `);
  });
});
