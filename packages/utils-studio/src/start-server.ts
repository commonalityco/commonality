import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { Server } from 'socket.io';
import chokidar from 'chokidar';

let io: Server | undefined;

export const startServer = async ({
  dev = false,
  port,
  rootDirectory,
}: {
  dev?: boolean;
  port: string | number;
  rootDirectory: string;
}): Promise<void> => {
  console.log('preparing');
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app
    .prepare()
    .then(() => {
      const server = createServer((req, res) => {
        const parsedUrl = parse(req.url || '', true);

        if (!io) {
          io = new Server(server);

          io.on('connection', (socket) => {
            const watcher = chokidar.watch(
              [
                `${rootDirectory}/CODEOWNERS`,
                `${rootDirectory}/.github/CODEOWNERS`,
                `${rootDirectory}/.gitlab/CODEOWNERS`,
                `${rootDirectory}/docs/CODEOWNERS`,
                `${rootDirectory}/**/package.json`,
                `${rootDirectory}/**/commonality.json`,
                `${rootDirectory}/.commonality/config.json`,
              ],
              {
                ignored: [/node_modules/, /.next/], // ignore both node_modules and .next directories
                persistent: true,
              },
            );

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
        }

        handle(req, res, parsedUrl);
      }).listen(port);

      console.log(
        `> Server listening at http://localhost:${port} as ${
          dev ? 'development' : 'production'
        }`,
      );
    })
    .catch((error) => console.log(error));
};
