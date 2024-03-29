import { Tag, Codeowner, Workspace } from '@commonalityco/types';
import stripAnsi from 'strip-ansi';
import { Check, CheckContext, Message } from '@commonalityco/utils-core';

export type TestCheck<T extends Check> = T & {
  validate: () => Promise<boolean | Message> | boolean | Message;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fix?: T['fix'] extends (...args: any[]) => any
    ? () => void | Promise<void>
    : never;
  level?: T['level'] extends 'error' | 'warning' ? T['level'] : 'warning';
};

interface TestCheckContext {
  workspace?: Workspace;
  rootWorkspace?: Workspace;
  allWorkspaces?: Workspace[];
  codeowners?: Codeowner[];
  tags?: Tag[];
}

/**
 * Wraps a check and decorates its `validate`, `fix`, and `message` functions with paths that point to the current directory.
 * This reduces repetitive boilerplate when writing tests for checks by providing a default `CheckContext`.
 *
 * Documentation: https://docs.commonality.co/reference/define-test-check
 *
 * @param check - The check object to be tested.
 * @param options - Optional. Overrides for the default `CheckContext`.
 * @returns The original check function with decorated `validate`, `fix`, and `message` functions.
 *
 * @example
 * test('validate - returns true when valid', () => {
 *   mockFs({
 *     'package.json': JSON.stringify({
 *       name: 'foo',
 *       description: 'bar',
 *     }),
 *   });
 *
 *   const check = defineTestCheck(myCheck());
 *   const result = myCheck.validate();
 *
 *   expect(result).toEqual(true);
 * });
 */
export function defineTestCheck<T extends Check>(
  check: T,
  options?: TestCheckContext,
): TestCheck<T> {
  const defaultWorkspace = {
    path: './',
    relativePath: './',
  } satisfies Workspace;
  const defaultRootWorkspace = {
    path: './',
    relativePath: './',
  } satisfies Workspace;

  const testFixtures = {
    tags: options?.tags ?? [],
    codeowners: options?.codeowners ?? [],
    package: options?.workspace ?? defaultWorkspace,
    rootPackage: options?.rootWorkspace ?? defaultRootWorkspace,
    allPackages: options?.allWorkspaces ?? [defaultWorkspace],
  } satisfies CheckContext;

  return {
    ...check,
    validate: async () => {
      const validationResult = await check.validate({
        ...testFixtures,
      });

      if (typeof validationResult === 'object' && validationResult.suggestion) {
        validationResult.suggestion = stripAnsi(validationResult.suggestion);
      }

      return validationResult;
    },
    fix: check.fix
      ? async () =>
          await check?.fix?.({
            ...testFixtures,
          })
      : undefined,
    message: check.message,
  } as TestCheck<T>;
}
