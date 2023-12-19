import { execa } from 'execa';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const startStudio = ({ port, rootDirectory, debug }) => {
  const serverProcess = execa('node', ['server.js'], {
    stdout: debug ? 'pipe' : 'ignore',
    stderr: debug ? 'pipe' : 'ignore',
    cwd: __dirname,
    env: {
      NODE_ENV: 'production',
      PORT: port?.toString(),
      COMMONALITY_ROOT_DIRECTORY: rootDirectory,
    },
  });

  const handleExit = () => {
    serverProcess.kill();
  };

  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
  process.on('exit', handleExit);

  return { kill: () => serverProcess.kill() };
};
