import { createJsonFileReader } from './../../utils-file/src/json';
import {
  Conformer,
  FileCreatorFactory,
  JsonFileReader,
  TagsData,
  TextFileCreator,
  Workspace,
  YamlFileCreator,
  ConformanceResult,
} from '@commonalityco/types';
import path from 'node:path';

export const getConformanceResults = async ({
  conformersByPattern,
  rootDirectory,
  workspaces,
  tagsData,
  createText,
  createYaml,
}: {
  conformersByPattern: Record<string, Conformer[]>;
  rootDirectory: string;
  workspaces: Workspace[];
  tagsData: TagsData[];
  createJson: FileCreatorFactory<JsonFileReader>;
  createText: FileCreatorFactory<TextFileCreator>;
  createYaml: FileCreatorFactory<YamlFileCreator>;
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
                  text: createText({ rootDirectory, workspace }),
                  yaml: createYaml({ rootDirectory, workspace }),
                });

                return Boolean(result);
              } catch {
                return false;
              }
            };

            const isValid = await getIsValid();

            const getMessage = () => {
              if (typeof conformer.message === 'string') {
                return conformer.message;
              } else if (conformer.message) {
                return conformer.message({ workspace });
              } else {
                return conformer.name;
              }
            };
            const message = getMessage();

            return {
              name: conformer.name,
              pattern: matchingPattern,
              workspace,
              message,
              level: conformer.level ?? 'warning',
              fix: conformer.fix,
              isValid,
            };
          }),
      ),
    ),
  );
};