import { Tag, Codeowner, Workspace } from '@commonalityco/types';
import stripAnsi from 'strip-ansi';
import { Message, Check, CheckOptions } from '@commonalityco/utils-core';

type Awaitable<T> = T | PromiseLike<T>;

type FunctionType<T = unknown> = (options: CheckOptions) => Awaitable<T>;

type TestConformer<T> = {
  [P in keyof T]: P extends 'fix' | 'message' | 'validate'
    ? T[P] extends FunctionType
      ? () => Promise<ReturnType<T[P]>>
      : T[P]
    : T[P];
};

interface TestCheckOptions {
  workspace?: Workspace;
  rootWorkspace?: Workspace;
  allWorkspaces?: Workspace[];
  codeowners?: Codeowner[];
  tags?: Tag[];
}

export function createTestCheck<T extends Check>(
  conformer: T,
  options?: TestCheckOptions,
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
    workspace: options?.workspace ?? defaultWorkspace,
    rootWorkspace: options?.rootWorkspace ?? defaultRootWorkspace,
    allWorkspaces: options?.allWorkspaces ?? [defaultWorkspace],
  };

  return {
    ...conformer,
    validate: () =>
      conformer.validate({
        ...testFixtures,
      }),
    fix: conformer.fix
      ? async () =>
          await conformer?.fix?.({
            ...testFixtures,
          })
      : undefined,
    message:
      typeof conformer.message === 'string'
        ? conformer.message
        : async () => {
            if (typeof conformer.message === 'string') return;

            const result = await conformer.message({
              ...testFixtures,
            });

            return {
              ...result,
              suggestion: result.suggestion
                ? stripAnsi(result.suggestion)
                : undefined,
            } satisfies Message;
          },
  } as TestConformer<T>;
}
