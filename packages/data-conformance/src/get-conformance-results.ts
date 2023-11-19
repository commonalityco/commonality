import {
  createJsonFileFormatter,
  createJsonFileReader,
} from './../../utils-file/src/json';
import {
  Conformer,
  TagsData,
  Workspace,
  ConformanceResult,
  MessageFn,
} from '@commonalityco/types';
import path from 'node:path';
import { diff as jestDiff } from 'jest-diff';
import chalk from 'chalk';

const addedDiff: Parameters<MessageFn>[0]['addedDiff'] = (
  a: unknown,
  b: unknown,
) => {
  const result = jestDiff(a, b, {
    contextLines: 2,
    omitAnnotationLines: true,
    aColor: chalk.dim,
    bColor: chalk.red,
    commonColor: chalk.green,
    aIndicator: ' ',
    commonIndicator: ' ',
  });

  return result || undefined;
};

export const getConformanceResults = async ({
  conformersByPattern,
  rootDirectory,
  workspaces,
  tagsData,
}: {
  conformersByPattern: Record<string, Conformer[]>;
  rootDirectory: string;
  workspaces: Workspace[];
  tagsData: TagsData[];
}): Promise<ConformanceResult[]> => {
  const matchingPatterns = Object.keys(conformersByPattern);
  const workspaceMap = new Map(
    workspaces.map((workspace) => [workspace.packageJson.name, workspace]),
  );

  return await Promise.all(
    matchingPatterns.flatMap((matchingPattern) =>
      conformersByPattern[matchingPattern].flatMap((conformer) =>
        tagsData
          .filter((data) => {
            if (matchingPattern === '*') return true;
            return data.tags.includes(matchingPattern);
          })
          .map((data) => workspaceMap.get(data.packageName))
          .filter((workspace): workspace is Workspace => !!workspace)
          .map(async (workspace): Promise<ConformanceResult> => {
            const getIsValid = async (): Promise<boolean> => {
              try {
                const result = await conformer.validate({
                  workspace,
                  projectWorkspaces: workspaces,
                  json: (filename) =>
                    createJsonFileReader(
                      path.join(rootDirectory, workspace.path, filename),
                    ),
                });

                return Boolean(result);
              } catch {
                return false;
              }
            };

            const getMessage = async () => {
              if (typeof conformer.message === 'string') {
                return { title: conformer.message };
              }

              return await conformer.message({
                workspace,
                addedDiff,
                json: (filename: string) =>
                  createJsonFileFormatter(
                    path.join(rootDirectory, workspace.path, filename),
                  ),
              });
            };

            const isValid = await getIsValid();

            return {
              name: conformer.name,
              pattern: matchingPattern,
              workspace,
              message: await getMessage(),
              level: conformer.level ?? 'warning',
              fix: conformer.fix,
              isValid,
            };
          }),
      ),
    ),
  );
};
