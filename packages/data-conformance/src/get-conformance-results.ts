import { json, text } from '@commonalityco/utils-file';
import {
  Conformer,
  TagsData,
  Workspace,
  ConformanceResult,
  CodeownersData,
} from '@commonalityco/types';
import path from 'node:path';

export const getConformanceResults = async ({
  conformersByPattern,
  workspaces,
  tagsData,
  codeownersData,
  rootWorkspace,
}: {
  conformersByPattern: Record<string, Conformer[]>;
  rootDirectory: string;
  workspaces: Workspace[];
  rootWorkspace: Workspace;
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
}): Promise<ConformanceResult[]> => {
  const matchingPatterns = Object.keys(conformersByPattern);
  const workspaceMap = new Map(
    workspaces.map((workspace) => [workspace.packageJson.name, workspace]),
  );
  const tagsMap = new Map(
    tagsData.map((data) => [data.packageName, data.tags]),
  );
  const codeownersMap = new Map(
    codeownersData.map((data) => [data.packageName, data.codeowners]),
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
          .filter(
            (workspace): workspace is Workspace =>
              !!workspace && Boolean(workspace.packageJson.name),
          )
          .map(async (workspace): Promise<ConformanceResult> => {
            const getValidationResult = async (): Promise<{
              isValid: boolean;
              error?: unknown;
            }> => {
              try {
                const result = await conformer.validate({
                  workspace: Object.freeze(workspace),
                  allWorkspaces: workspaces,
                  rootWorkspace,
                  tags: tagsMap.get(workspace.packageJson.name as string) ?? [],
                  codeowners:
                    codeownersMap.get(workspace.packageJson.name as string) ??
                    [],
                  text: (filename) => text(path.join(workspace.path, filename)),
                  json: (filename) => json(path.join(workspace.path, filename)),
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
                  rootWorkspace,
                  tags: tagsMap.get(workspace.packageJson.name as string) ?? [],
                  codeowners:
                    codeownersMap.get(workspace.packageJson.name as string) ??
                    [],
                  text: (filename) => text(path.join(workspace.path, filename)),
                  json: (filename: string) =>
                    json(path.join(workspace.path, filename)),
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
