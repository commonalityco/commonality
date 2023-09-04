const path = require('node:path');
const http = require('node:http');
const { parse } = require('node:url');
const next = require('next');
const { Server } = require('socket.io');
const chokidar = require('chokidar');

const port = parseInt(process.env.PORT || '8888', 10);
const dev = process.env.NODE_ENV !== 'production';

if (!process.env.COMMONALITY_ROOT_DIRECTORY) {
  throw new Error('COMMONALITY_ROOT_DIRECTORY not set');
}

/** @type {string} */
const rootDirectory = path.resolve(process.env.COMMONALITY_ROOT_DIRECTORY);
const app = next({ dev, port });
const handle = app.getRequestHandler();

/**
 * @async
 * @returns {Promise<InstanceType<typeof http.Server>>} The created server.
 */
const createNextServer = async () => {
  await app.prepare();

  return http
    .createServer((req, res) => {
      const parsedUrl = parse(req.url || '', true);

      handle(req, res, parsedUrl);
    })
    .listen(port);
};

const createWebsocketConnection = async (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    const globsToWatch = [
      `${rootDirectory}/CODEOWNERS`,
      `${rootDirectory}/.github/CODEOWNERS`,
      `${rootDirectory}/.gitlab/CODEOWNERS`,
      `${rootDirectory}/docs/CODEOWNERS`,
      `${rootDirectory}/**/package.json`,
      `${rootDirectory}/**/commonality.json`,
      `${rootDirectory}/.commonality/config.json`,
    ];

    const watcher = chokidar.watch(globsToWatch, {
      ignored: [/node_modules/, /.next/], // ignore both node_modules and .next directories
      persistent: true,
    });

    watcher
      .on('change', async (path) => {
        socket.emit('project-updated', {
          message: `File ${path} has been changed`,
        });
      })
      .on('error', (error) => {});

    socket.on('disconnect', () => {
      watcher.close();
    });
  });
};

const startServer = async () => {
  try {
    const server = await createNextServer();

    await createWebsocketConnection(server);

    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? 'development' : 'production'
      }`,
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
