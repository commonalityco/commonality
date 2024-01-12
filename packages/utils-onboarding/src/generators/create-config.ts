import url from 'node:url';
import path from 'pathe';
import fs from 'fs-extra';
import { PROJECT_CONFIG_JS, PROJECT_CONFIG_TS } from '../constants/filenames';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const createConfig = async ({
  rootDirectory,
  enableTypeScript,
}: {
  rootDirectory: string;
  enableTypeScript: boolean;
}) => {
  const fixturePath = path.resolve(
    __dirname,
    '../fixtures',
    enableTypeScript ? PROJECT_CONFIG_TS : PROJECT_CONFIG_JS,
  );

  await fs.copy(fixturePath, rootDirectory);
};
