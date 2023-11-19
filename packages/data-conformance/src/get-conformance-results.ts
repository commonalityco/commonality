import {
  createTextFileFormatter,
  createTextFileReader,
} from './../../utils-file/src/text';
import {
  createJsonFileFormatter,
  createJsonFileReader,
} from './../../utils-file/src/json';
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
            const getIsValid = async (): Promise<boolean> => {
              try {
                const result = await conformer.validate({
                  workspace,
                  projectWorkspaces: workspaces,
                  text: (filename) =>
                    createTextFileReader(
                      path.join(rootDirectory, workspace.path, filename),
                    ),
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
                text: (filename) =>
                  createTextFileFormatter(
                    path.join(rootDirectory, workspace.path, filename),
                  ),
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
