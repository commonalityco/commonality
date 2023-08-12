import path from 'path';
import { start } from './start';
import getPort from 'get-port';

(async () => {
  const port = await getPort({ port: 3000 });

  const PROJECT_PATH = '../../../../';

  start({
    port: port,
    rootDirectory: path.resolve(__dirname, PROJECT_PATH),
    env: 'development',
  });
})();
