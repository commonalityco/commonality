import fs from 'fs-extra';
import path from 'pathe';

export const getCreateConfig = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<boolean> => {
  const jsConfigExists = await fs.exists(
    path.join(rootDirectory, 'commonality.config.js'),
  );
  const tsConfigExists = await fs.exists(
    path.join(rootDirectory, 'commonality.config.ts'),
  );

  return !jsConfigExists && !tsConfigExists;
};
