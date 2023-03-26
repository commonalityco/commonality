import execa from 'execa';
import path, { resolve } from 'path';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

export const start = async ({
  port,
  onReady,
}: {
  port?: number;
  onReady: () => void;
}) => {
  console.log('preparing');

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
