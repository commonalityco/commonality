const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('node:path');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

if (!process.env.COMMONALITY_ROOT_DIRECTORY) {
  process.env.COMMONALITY_ROOT_DIRECTORY = path.resolve('../../');
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${'development'}`,
  );
});
