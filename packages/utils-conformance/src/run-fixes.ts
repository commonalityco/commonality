import { text, json } from '@commonalityco/utils-file';
import { Workspace, ConformanceResult } from '@commonalityco/types';
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
}: {
  conformanceResults: ConformanceResult[];
  rootDirectory: string;
  workspaces: Workspace[];
}): Promise<
  { error?: ConformanceError; isFixed: boolean; workspace: Workspace }[]
> => {
  const fixResults: {
    error?: ConformanceError;
    isFixed: boolean;
    workspace: Workspace;
  }[] = [];

  const groupedResults: Record<string, ConformanceResult[]> = {};

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
        if (result.fix) {
          try {
            await result.fix({
              workspace: result.workspace,
              projectWorkspaces: workspaces,
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
