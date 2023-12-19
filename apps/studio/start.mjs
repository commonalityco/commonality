import { execa } from 'execa';
import url from 'node:url';
import waitOn from 'wait-on';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const startStudio = async ({ port, rootDirectory, debug, onExit }) => {
  const serverProcess = execa('node', ['server.js'], {
    stdout: debug ? 'inherit' : 'ignore',
    stderr: debug ? 'inherit' : 'ignore',
    cwd: __dirname,
    env: {
      NODE_ENV: 'production',
      PORT: port?.toString(),
      COMMONALITY_ROOT_DIRECTORY: rootDirectory,
    },
  });

  const handleExit = () => {
    if (onExit) {
      onExit();
    }

    serverProcess.kill();
  };

  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
  process.on('exit', handleExit);

  const url = `tcp:${port}`;

  await waitOn({ resources: [url] });

  return { kill: () => serverProcess.kill() };
};
