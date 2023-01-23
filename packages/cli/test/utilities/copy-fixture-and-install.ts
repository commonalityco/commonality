import path from 'node:path';
import fs from 'fs-extra';
import execa from 'execa';

const packageRoot = path.join(path.resolve(__dirname, '../../'));

export const copyFixtureAndInstall = async ({
  destination,
  name,
}: {
  destination: string;
  name: string;
}) => {
  await fs.remove(destination);

  const fixturePath = path.join(path.resolve(__dirname, '../fixtures'), name);

  await fs.copy(fixturePath, destination);

  await execa('pnpm', ['link', packageRoot], {
    cwd: destination,
  });
};
