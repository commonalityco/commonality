const path = require('node:path');
const { startServer } = require('@commonalityco/utils-studio');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const rootDirectory = process.env.COMMONALITY_ROOT_DIRECTORY
  ? process.env.COMMONALITY_ROOT_DIRECTORY
  : path.resolve('../../');

startServer({
  dev,
  port,
  rootDirectory,
});
