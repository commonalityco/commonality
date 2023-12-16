import { execa } from 'execa';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const startStudio = ({ port, rootDirectory, debug }) => {
  return execa('node', ['server.js'], {
    stdout: debug ? 'inherit' : 'ignore',
    stderr: debug ? 'inherit' : 'ignore',
    cwd: __dirname,
    env: {
      NODE_ENV: 'production',
      PORT: port?.toString(),
      COMMONALITY_ROOT_DIRECTORY: rootDirectory,
    },
  });
};
