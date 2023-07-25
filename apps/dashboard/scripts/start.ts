import execa from 'execa';
import path from 'path';

const env =
  process.env.NODE_ENV !== 'development' ? 'production' : 'development';

export const start = async ({
  port,
  rootDirectory,
}: {
  port: number;
  rootDirectory: string;
}): Promise<void> => {
  const pathToServer = path.resolve(__dirname, '../server.js');

  const { stderr, stdout } = await execa('node', [pathToServer], {
    stdio: env === 'development' ? 'pipe' : 'ignore',
    cwd: path.resolve(__dirname, '..'),
    env: {
      NODE_ENV: env,
      PORT: port?.toString(),
      COMMONALITY_ROOT_DIRECTORY: rootDirectory,
    },
  });

  if (stderr) {
    console.log(stderr);
  } else {
    console.log({ stdout });
  }
};
