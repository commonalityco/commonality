import path from 'path';
import { start } from './start';
import getPort from 'get-port';

(async () => {
  const port = await getPort({ port: 3000 });

  const PROJECT_PATH = '../test/fixtures/kitchen-sink';
  // const PROJECT_PATH = '../../../../pnpm';

  start({
    port: port,
    rootDirectory: path.resolve(__dirname, PROJECT_PATH),
    env: 'development',
  });
})();
