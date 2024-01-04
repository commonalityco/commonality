import { execa } from 'execa';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/**
 * Starts a studio server process.
 * @param {Object} options - The configuration options for starting the studio.
 * @param {number} options.port - The port on which the server will listen.
 * @param {string} options.rootDirectory - The root directory for the server.
 * @param {boolean} options.debug - Flag to enable debug mode (stdout and stderr).
 * @returns {{ kill: () => void }} An object with a kill function to terminate the server process.
 */
export const startStudio = ({ port, rootDirectory, debug }) => {
  const serverProcess = execa('node', ['server.js'], {
    stdout: debug ? 'pipe' : 'ignore',
    stderr: debug ? 'pipe' : 'ignore',
    cwd: __dirname,
    env: {
      PATH: process.env.PATH,
      NODE_ENV: 'production',
      PORT: port?.toString(),
      COMMONALITY_ROOT_DIRECTORY: rootDirectory,
    },
  });

  return {
    kill: () => {
      serverProcess.kill();
    },
  };
};
