import path from 'path';
import { start } from './start';

const PROJECT_PATH = '../test/fixtures/kitchen-sink';
// const PROJECT_PATH = '../test/fixtures/kitchen-sink';

start({
  port: 3000,
  rootDirectory: path.resolve(__dirname, PROJECT_PATH),
});
