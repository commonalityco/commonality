const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('node:path');
const socketIO = require('socket.io');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

if (!process.env.COMMONALITY_ROOT_DIRECTORY) {
  process.env.COMMONALITY_ROOT_DIRECTORY = path.resolve('../../');
}

app.prepare().then(() => {
  let hasInitialized = false;

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    if (!hasInitialized) {
      const io = socketIO(server);

      const chokidar = require('chokidar');
      const COMMONALITY_ROOT_DIRECTORY = process.env.COMMONALITY_ROOT_DIRECTORY;

      io.on('connection', (socket) => {
        const watcher = chokidar.watch(
          [
            `${COMMONALITY_ROOT_DIRECTORY}/**/package.json`,
            `${COMMONALITY_ROOT_DIRECTORY}/**/commonality.json`,
            `${COMMONALITY_ROOT_DIRECTORY}/.commonality/config.json`,
          ],
          {
            ignored: [/node_modules/, /.next/], // ignore both node_modules and .next directories
            persistent: true,
          },
        );

        watcher
          .on('change', (path) => {
            console.log(`File ${path} has been changed`);
            // Emitting "project-updated" event on file change
            socket.emit('project-updated', {
              message: `File ${path} has been changed`,
            });
          })
          .on('error', (error) => {
            console.log(`Watcher error: ${error}`);
          });

        socket.on('disconnect', () => {
          console.log('user disconnected');
          watcher.close();
        });
      });

      res.socket.server.io = io;
      hasInitialized = true;
    }

    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${'development'}`,
  );
});
