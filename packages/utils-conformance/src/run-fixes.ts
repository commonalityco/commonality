import {
  Workspace,
  FileCreatorFactory,
  JsonFileCreator,
  TextFileCreator,
  YamlFileCreator,
  ConformanceResult,
} from '@commonalityco/types';

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
  createJson,
  createText,
  createYaml,
}: {
  conformanceResults: ConformanceResult[];
  rootDirectory: string;
  workspaces: Workspace[];
  createJson: FileCreatorFactory<JsonFileCreator>;
  createText: FileCreatorFactory<TextFileCreator>;
  createYaml: FileCreatorFactory<YamlFileCreator>;
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
    if (!groupedResults[result.name]) {
      groupedResults[result.name] = [];
    }

    groupedResults[result.name].push(result);
  }

  await Promise.all(
    Object.values(groupedResults).map((groupResults) =>
      groupResults.map(async ({ fix, isValid, workspace, message }) => {
        if (fix && !isValid) {
          try {
            await fix({
              workspace,
              projectWorkspaces: workspaces,
              json: createJson({ rootDirectory, workspace }),
              text: createText({ rootDirectory, workspace }),
              yaml: createYaml({ rootDirectory, workspace }),
            });
            fixResults.push({ isFixed: true, workspace });
          } catch (error) {
            fixResults.push({
              error: new ConformanceError({
                name: 'FIX_FAILED',
                message:
                  error instanceof Error
                    ? error.message
                    : `Failed to run conformer: ${message}`,
              }),
              isFixed: false,
              workspace,
            });
          }
        }
      }),
    ),
  );

  return fixResults;
};
