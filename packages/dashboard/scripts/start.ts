import execa from 'execa';
import path from 'path';

export const start = async (
  port: number
): Promise<void> => {
  const pathToServer = path.resolve(__dirname, '../server.js');

  execa('node', [pathToServer], {
    stdout: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: {
      NODE_ENV: 'production',
      PORT: port?.toString(),
    },
  });
};
