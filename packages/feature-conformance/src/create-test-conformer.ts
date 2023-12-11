import type {
  Message,
  Check,
  CheckFn,
  Tag,
  Codeowner,
  CheckOptions,
  Workspace,
} from '@commonalityco/types';
import stripAnsi from 'strip-ansi';

type Awaitable<T> = T | PromiseLike<T>;

type FunctionType<T = unknown> = (options: CheckOptions) => Awaitable<T>;

type TestConformer<T> = {
  [P in keyof T]: P extends 'fix' | 'message' | 'validate'
    ? T[P] extends FunctionType
      ? () => ReturnType<T[P]>
      : T[P]
    : T[P];
};

export function createTestCheck<T extends Check>(
  conformer: T,
  testOptions?: {
    workspace?: Workspace;
    rootWorkspace?: Workspace;
    allWorkspaces?: Workspace[];
    codeowners?: Codeowner[];
    tags?: Tag[];
  },
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
    tags: testOptions?.tags ?? [],
    codeowners: testOptions?.codeowners ?? [],
    workspace: testOptions?.workspace ?? defaultWorkspace,
    rootWorkspace: testOptions?.rootWorkspace ?? defaultRootWorkspace,
    allWorkspaces: testOptions?.allWorkspaces ?? [defaultWorkspace],
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
      typeof conformer.message === 'function'
        ? async () => {
            const result = await (conformer.message as CheckFn<Message>)({
              ...testFixtures,
            });

            return {
              ...result,
              context: result.context ? stripAnsi(result.context) : undefined,
            };
          }
        : conformer.message,
  } as TestConformer<T>;
}
