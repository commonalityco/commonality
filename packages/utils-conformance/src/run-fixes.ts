import { text, json } from '@commonalityco/utils-file';
import {
  Workspace,
  ConformanceResult,
  TagsData,
  CodeownersData,
} from '@commonalityco/types';
import path from 'node:path';

type ErrorName = 'FIX_FAILED' | 'VALIDATION_FAILED';
class ConformanceError extends Error {
  name: ErrorName;
  message: string;

  constructor({ name, message }: { name: ErrorName; message: string }) {
    super(message);
    this.name = name;
    this.message = message;
  }
}

export const runFixes = async ({
  conformanceResults,
  rootDirectory,
  workspaces,
  tagsData,
  codeownersData,
}: {
  conformanceResults: ConformanceResult[];
  rootDirectory: string;
  workspaces: Workspace[];
  tagsData: TagsData[];
  codeownersData: CodeownersData[];
}): Promise<
  { error?: ConformanceError; isFixed: boolean; workspace: Workspace }[]
> => {
  const fixResults: {
    error?: ConformanceError;
    isFixed: boolean;
    workspace: Workspace;
  }[] = [];

  const groupedResults: Record<string, ConformanceResult[]> = {};
  const tagsMap = new Map(
    tagsData.map((data) => [data.packageName, data.tags]),
  );
  const codeownersMap = new Map(
    codeownersData.map((data) => [data.packageName, data.codeowners]),
  );

  for (const result of conformanceResults) {
    if (result.fix && !result.isValid) {
      if (!groupedResults[result.name]) {
        groupedResults[result.name] = [];
      }
      groupedResults[result.name].push(result);
    }
  }

  for (const [name, groupResults] of Object.entries(groupedResults)) {
    await Promise.all(
      groupResults.map(async (result) => {
        if (!result.workspace.packageJson.name) {
          return;
        }

        if (result.fix) {
          try {
            await result.fix({
              workspace: result.workspace,
              allWorkspaces: workspaces,
              tags: tagsMap.get(result.workspace.packageJson.name) ?? [],
              codeowners:
                codeownersMap.get(result.workspace.packageJson.name) ?? [],
              json: (filename) =>
                json(path.join(rootDirectory, result.workspace.path, filename)),
              text: (filename) =>
                text(path.join(rootDirectory, result.workspace.path, filename)),
            });
            fixResults.push({ isFixed: true, workspace: result.workspace });
          } catch (error) {
            fixResults.push({
              error: new ConformanceError({
                name: 'FIX_FAILED',
                message:
                  error instanceof Error
                    ? error.message
                    : `Failed to run conformer: ${result.message.title}`,
              }),
              isFixed: false,
              workspace: result.workspace,
            });
          }
        }
      }),
    );
  }

  return fixResults;
};
