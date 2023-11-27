import type {
  Message,
  Conformer,
  ConformerFn,
  Tag,
  Codeowner,
  ConformerOptions,
  Workspace,
} from '@commonalityco/types';
import { json } from './json';
import { text } from './text';
import stripAnsi from 'strip-ansi';

type Awaitable<T> = T | PromiseLike<T>;

type FunctionType<T = unknown> = (options: ConformerOptions) => Awaitable<T>;

type TestConformer<T> = {
  [P in keyof T]: P extends 'fix' | 'message' | 'validate'
    ? T[P] extends FunctionType
      ? () => ReturnType<T[P]>
      : T[P]
    : T[P];
};

export function createTestConformer<T extends Conformer>(
  conformer: T,
  testOptions?: {
    workspace?: Workspace;
    rootWorkspace?: Workspace;
    allWorkspaces?: Workspace[];
    files?: Record<string, Record<string, unknown> | string>;
    codeowners?: Codeowner[];
    tags?: Tag[];
    onDelete?: (filePath: string) => Promise<void> | void;
    onWrite?: (filePath: string, data: unknown) => Promise<void> | void;
  },
): TestConformer<T> {
  const defaultWorkspace = {
    path: 'root/packages/pkg',
    relativePath: './packages/pkg',
    packageJson: {},
  } satisfies Workspace;
  const defaultRootWorkspace = {
    path: '/root',
    relativePath: '.',
    packageJson: {},
  } satisfies Workspace;

  const testFixtures = {
    tags: testOptions?.tags ?? [],
    codeowners: testOptions?.codeowners ?? [],
    workspace: testOptions?.workspace ?? defaultWorkspace,
    rootWorkspace: testOptions?.rootWorkspace ?? defaultRootWorkspace,
    allWorkspaces: testOptions?.allWorkspaces ?? [defaultWorkspace],
    json: (filepath: string) =>
      json(filepath, {
        onRead: (filepath) => {
          const resource = testOptions?.files?.[filepath] as Record<
            string,
            unknown
          >;

          if (!resource) {
            throw new Error('No file found for filepath: ' + filepath);
          }

          return resource;
        },
        onWrite: testOptions?.onWrite ?? (() => {}),
        onDelete: testOptions?.onDelete ?? (() => {}),
        onExists: (filepath) => Boolean(testOptions?.files?.[filepath]),
      }),
    text: (filepath: string) =>
      text(filepath, {
        onRead: (filepath) => {
          const resource = testOptions?.files?.[filepath] as string;

          if (!resource) {
            throw new Error('No file found for filepath: ' + filepath);
          }

          return resource;
        },
        onWrite: testOptions?.onWrite ?? (() => {}),
        onDelete: testOptions?.onDelete ?? (() => {}),
        onExists: (filepath) => {
          return Boolean(testOptions?.files?.[filepath]);
        },
      }),
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
            const result = await (conformer.message as ConformerFn<Message>)({
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
