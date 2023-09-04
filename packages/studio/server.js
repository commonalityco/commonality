// @ts-check
const { startServer } = require('@commonalityco/utils-studio');

const port = parseInt(process.env.PORT || '3000', 10);

if (!process.env.COMMONALITY_ROOT_DIRECTORY) {
  throw new Error('COMMONALITY_ROOT_DIRECTORY not set');
}

startServer({
  dev: false,
  port,
  rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
});
