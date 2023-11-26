import { json, text } from '@commonalityco/utils-file';
import {
  Conformer,
  TagsData,
  Workspace,
  ConformanceResult,
} from '@commonalityco/types';
import path from 'node:path';

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
            const getValidationResult = async (): Promise<{
              isValid: boolean;
              error?: unknown;
            }> => {
              try {
                const result = await conformer.validate({
                  workspace: Object.freeze(workspace),
                  allWorkspaces: workspaces,
                  text: (filename) =>
                    text(path.join(rootDirectory, workspace.path, filename)),
                  json: (filename) =>
                    json(path.join(rootDirectory, workspace.path, filename)),
                });

                return { isValid: Boolean(result) };
              } catch (error) {
                return { isValid: false, error };
              }
            };

            const getMessage = async () => {
              if (typeof conformer.message === 'string') {
                return { title: conformer.message };
              }

              try {
                return await conformer.message({
                  workspace,
                  allWorkspaces: workspaces,
                  text: (filename) =>
                    text(path.join(rootDirectory, workspace.path, filename)),
                  json: (filename: string) =>
                    json(path.join(rootDirectory, workspace.path, filename)),
                });
              } catch (error) {
                if (error instanceof Error) {
                  return {
                    title: error.message,
                    context: error.stack,
                  };
                }

                return {
                  title:
                    'An unknown error occured while running this conformer',
                };
              }
            };

            const validationResult = await getValidationResult();

            const message = await getMessage();

            return {
              name: conformer.name,
              pattern: matchingPattern,
              workspace,
              message,
              level: conformer.level ?? 'warning',
              fix: conformer.fix,
              isValid: validationResult.isValid,
            };
          }),
      ),
    ),
  );
};
