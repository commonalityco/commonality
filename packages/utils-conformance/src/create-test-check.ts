import { Tag, Codeowner, Workspace } from '@commonalityco/types';
import stripAnsi from 'strip-ansi';
import { Check, CheckContext } from '@commonalityco/utils-core';

type Awaitable<T> = T | PromiseLike<T>;

type FunctionType<T = unknown> = (options: CheckContext) => Awaitable<T>;

type TestConformer<T> = {
  [P in keyof T]: P extends 'fix' | 'message' | 'validate'
    ? T[P] extends FunctionType
      ? () => Promise<ReturnType<T[P]>>
      : T[P]
    : T[P];
};

interface TestCheckContext {
  workspace?: Workspace;
  rootWorkspace?: Workspace;
  allWorkspaces?: Workspace[];
  codeowners?: Codeowner[];
  tags?: Tag[];
}

export function defineTestCheck<T extends Check>(
  conformer: T,
  options?: TestCheckContext,
): TestConformer<T> {
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
    ...conformer,
    validate: async () => {
      const validationResult = await conformer.validate({
        ...testFixtures,
      });

      if (typeof validationResult === 'object' && validationResult.suggestion) {
        validationResult.suggestion = stripAnsi(validationResult.suggestion);
      }

      return validationResult;
    },
    fix: conformer.fix
      ? async () =>
          await conformer?.fix?.({
            ...testFixtures,
          })
      : undefined,
    message: conformer.message,
  } as TestConformer<T>;
}
