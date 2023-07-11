import execa from 'execa';
import path from 'path';

export const start = async ({
  port,
  rootDirectory,
}: {
  port: number;
  rootDirectory: string;
}): Promise<void> => {
  const pathToServer = path.resolve(__dirname, '../server.js');

  const { stderr, stdout } = await execa('node', [pathToServer], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: {
      NODE_ENV: 'production',
      PORT: port?.toString(),
      COMMONALITY_ROOT_DIRECTORY: rootDirectory,
    },
  });

  if (stderr) {
    console.log(stderr);
    process.exit(1);
  }
};
