import execa from 'execa';
import path from 'path';

export const start = async ({
  port,
  rootDirectory,
  env = process.env.NODE_ENV,
}: {
  port: number;
  rootDirectory: string;
  env: string;
}): Promise<void> => {
  const pathToServer = path.resolve(__dirname, '../server.js');
  const usedEnv = env !== 'development' ? 'production' : 'development';

  const { stderr, stdout } = await execa('node', [pathToServer], {
    stdout: usedEnv === 'development' ? 'inherit' : 'ignore',
    cwd: path.resolve(__dirname, '..'),
    env: {
      NODE_ENV: usedEnv,
      PORT: port?.toString(),
      COMMONALITY_ROOT_DIRECTORY: rootDirectory,
    },
  });

  if (stderr) {
    console.log(stderr);
  } else {
    console.log(stdout);
  }
};
