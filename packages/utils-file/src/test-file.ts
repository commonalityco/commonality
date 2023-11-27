import type { Message, Conformer, ConformerFn } from '@commonalityco/types';
import { json } from './json';
import { text } from './text';

export function createTestConformer(
  conformer: Conformer,
  testOptions: {
    workspace?: Parameters<ConformerFn<unknown>>[0]['workspace'];
    rootWorkspace?: Parameters<ConformerFn<unknown>>[0]['rootWorkspace'];
    allWorkspaces?: Parameters<ConformerFn<unknown>>[0]['allWorkspaces'];
    resources?: Record<string, Record<string, unknown> | string>;
    onDelete?: (filePath: string) => Promise<void> | void;
    onWrite?: (filePath: string, data: unknown) => Promise<void> | void;
  },
): Conformer {
  const defaultWorkspace = {
    path: 'root/packages/pkg',
    relativePath: './packages/pkg',
    packageJson: { name: 'pkg' },
  };
  const defaultRootWorkspace = {
    path: '/root',
    relativePath: '.',
    packageJson: { name: 'root' },
  };

  const testFixtures = {
    workspace: testOptions.workspace ?? defaultWorkspace,
    rootWorkspace: testOptions.rootWorkspace ?? defaultRootWorkspace,
    allWorkspaces: testOptions.allWorkspaces ?? [defaultWorkspace],
    json: () =>
      json('', {
        onRead: (filepath) =>
          testOptions?.resources?.[filepath] as Record<string, unknown>,
        onWrite: testOptions.onWrite ?? (() => {}),
        onDelete: testOptions.onDelete ?? (() => {}),
        onExists: (filepath) => Boolean(testOptions?.resources?.[filepath]),
      }),
    text: () =>
      text('', {
        onRead: (filepath) => testOptions?.resources?.[filepath] as string,
        onWrite: testOptions.onWrite ?? (() => {}),
        onDelete: testOptions.onDelete ?? (() => {}),
        onExists: (filepath) => Boolean(testOptions?.resources?.[filepath]),
      }),
  };
  return {
    ...conformer,
    validate: (options) =>
      conformer.validate({
        ...options,
        ...testFixtures,
      }),
    fix: conformer.fix
      ? (options) =>
          conformer?.fix?.({
            ...options,
            ...testFixtures,
          })
      : undefined,
    message:
      typeof conformer.message === 'function'
        ? (options) => {
            return (conformer.message as ConformerFn<Message>)(options);
          }
        : conformer.message,
  };
}
