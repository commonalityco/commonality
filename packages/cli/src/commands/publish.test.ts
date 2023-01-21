/* eslint-disable max-nested-callbacks */
/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'fs-extra';
import execa from 'execa';
import { MockServer } from 'jest-mock-server';
import { afterEach, beforeEach, expect, jest } from '@jest/globals';
import { store } from '../core/store';
import { getCurrentBranch } from '../core/get-current-branch';

const oraSucceed = jest.fn();
const oraFail = jest.fn();

jest.mock('ora', () => ({
  default: jest.fn().mockReturnValue({
    start: jest.fn().mockReturnValue({ succeed: oraSucceed, fail: oraFail }),
  }),
}));

const binaryPath = path.resolve(__dirname, `../../scripts/start.js`);
const distributionPath = path.resolve(__dirname, '../../dist');
const temporaryDirectory = path.join(tmpdir(), 'commonality-cli-test-publish');
const distributionToTemporary = path.relative(
  distributionPath,
  temporaryDirectory
);
const defaultArguments = ['--cwd', distributionToTemporary];

describe('publish', () => {
  const server = new MockServer();
  const authServer = new MockServer();
  const bodySpy = jest.fn();

  let deviceCodeRoute: globalThis.jest.Mock;
  let tokenRoute: globalThis.jest.Mock;

  beforeAll(async () => {
    await server.start();
    await authServer.start();
  });

  afterEach(() => {
    server.reset();
    authServer.reset();
  });

  afterAll(async () => {
    await server.stop();
    await authServer.stop();
  });

  beforeEach(async () => {
    store.clear();
    fs.removeSync(temporaryDirectory);
    jest.clearAllMocks();

    deviceCodeRoute = authServer
      .post('/oauth/device/code')
      .mockImplementation((context) => {
        context.status = 200;
        context.body = {
          device_code: '123-456',
          user_code: 'ABC-DEF',
          verification_uri: 'verify',
          verification_uri_complete: 'verify-complete',
          expires_in: 100_000,
          interval: 0.5,
        };
      });

    tokenRoute = authServer
      .post('/oauth/token')
      .mockImplementationOnce((context) => {
        context.status = 200;
        context.body = {
          access_token: '123',
          expires_in: 123,
          token_type: 'access_token',
        };
      });

    fs.outputJsonSync(path.join(temporaryDirectory, './package-lock.json'), {});
    fs.outputJsonSync(path.join(temporaryDirectory, './package.json'), {
      workspaces: ['apps/*', 'packages/*'],
    });
    fs.outputJsonSync(
      path.join(temporaryDirectory, './.commonality/config.json'),
      {
        project: '123',
      }
    );
    fs.outputJsonSync(
      path.join(temporaryDirectory, './apps/app-foo/package.json'),
      {
        name: '@scope/app-foo',
        version: '1.0.0',
        dependencies: {
          bar: '^1.0.0',
        },
      }
    );
    fs.outputJsonSync(
      path.join(temporaryDirectory, './apps/app-foo/commonality.json'),
      {
        tags: ['tag-one'],
      }
    );
    fs.outputJsonSync(
      path.join(temporaryDirectory, './packages/pkg-foo/package.json'),
      {
        name: '@scope/pkg-foo',
        version: '2.0.0',
        devDependencies: {
          bar: '^1.0.0',
        },
      }
    );
    fs.outputJsonSync(
      path.join(temporaryDirectory, './packages/pkg-foo/commonality.json'),
      {
        tags: ['tag-two'],
      }
    );
  });

  describe('when the API returns a successful response', () => {
    beforeEach(async () => {
      const currentBranch = await getCurrentBranch();

      server.post('/api/cli/publish').mockImplementation((context) => {
        context.status = 200;

        bodySpy(context.request.body);

        context.body = {
          url: `https://app.commonality.co/monorepo/root/${currentBranch}`,
        };
      });
    });

    describe('when already logged in', () => {
      describe('when the access token has not expired', () => {
        beforeEach(async () => {
          const expires = new Date();
          expires.setDate(expires.getDate() + 1);

          store.set('auth:accessToken', '123');
          store.set('auth:expires', expires.toString());
        });

        it('should not prompt for a login', async () => {
          await execa(binaryPath, ['publish', ...defaultArguments], {
            env: {
              COMMONALITY_API_ORIGIN: server.getURL().origin,
              COMMONALITY_AUTH_ORIGIN: authServer.getURL().origin,
            },
          });

          expect(deviceCodeRoute).not.toHaveBeenCalled();
          expect(tokenRoute).not.toHaveBeenCalled();
        });
      });

      describe('when the access token has expired', () => {
        beforeEach(async () => {
          const expires = new Date();
          expires.setDate(expires.getDate() - 1);

          store.set('auth:accessToken', '123');
          store.set('auth:expires', expires.toString());
        });

        it('should prompt for a login', async () => {
          await execa(binaryPath, ['publish', ...defaultArguments], {
            env: {
              COMMONALITY_API_ORIGIN: server.getURL().origin,
              COMMONALITY_AUTH_ORIGIN: authServer.getURL().origin,
            },
            stdout: 'inherit',
          });

          expect(deviceCodeRoute).toHaveBeenCalled();
          expect(tokenRoute).toHaveBeenCalled();
        });
      });
    });

    describe('when authenticating with a passed publish key', () => {
      it('should not call the auth API', async () => {
        await execa(
          binaryPath,
          ['publish', '--publishKey', '123', ...defaultArguments],
          {
            env: {
              COMMONALITY_API_ORIGIN: server.getURL().origin,
              COMMONALITY_AUTH_ORIGIN: authServer.getURL().origin,
            },
          }
        );

        expect(deviceCodeRoute).not.toHaveBeenCalled();
        expect(tokenRoute).not.toHaveBeenCalled();
      });
    });

    describe('when authenticating with a env var publish key', () => {
      it('should not call the auth API', async () => {
        await execa(binaryPath, ['publish', ...defaultArguments], {
          env: {
            COMMONALITY_API_ORIGIN: server.getURL().origin,
            COMMONALITY_AUTH_ORIGIN: authServer.getURL().origin,
            COMMONALITY_PUBLISH_KEY: '123',
          },
        });

        expect(deviceCodeRoute).not.toHaveBeenCalled();
        expect(tokenRoute).not.toHaveBeenCalled();
      });
    });

    describe('when authenticating with an access token', () => {
      it('should call the auth API', async () => {
        await execa(binaryPath, ['publish', ...defaultArguments], {
          env: {
            COMMONALITY_API_ORIGIN: server.getURL().origin,
            COMMONALITY_AUTH_ORIGIN: authServer.getURL().origin,
          },
        });

        expect(deviceCodeRoute).toHaveBeenCalled();
        expect(tokenRoute).toHaveBeenCalled();
      });
    });

    it('should POST to the URL with the correct data', async () => {
      authServer.post('/oauth/device/code').mockImplementation((context) => {
        context.status = 200;
      });

      authServer.post('/oauth/token').mockImplementationOnce((context) => {
        context.status = 200;
      });

      await execa(binaryPath, ['publish', ...defaultArguments], {
        env: {
          COMMONALITY_API_ORIGIN: server.getURL().origin,
          COMMONALITY_AUTH_ORIGIN: authServer.getURL().origin,
          COMMONALITY_PUBLISH_KEY: '123',
        },
      });

      const currentBranch = await getCurrentBranch();

      expect(bodySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          branch: currentBranch,
          packages: [
            {
              dependencies: [
                {
                  name: 'bar',
                  version: '^1.0.0',
                },
              ],
              devDependencies: [],
              name: '@scope/app-foo',
              owners: [],
              path: 'apps/app-foo',
              peerDependencies: [],
              tags: ['tag-one'],
              version: '1.0.0',
            },
            {
              dependencies: [],
              devDependencies: [
                {
                  name: 'bar',
                  version: '^1.0.0',
                },
              ],
              name: '@scope/pkg-foo',
              owners: [],
              path: 'packages/pkg-foo',
              peerDependencies: [],
              tags: ['tag-two'],
              version: '2.0.0',
            },
          ],
          projectId: '123',
          tags: ['tag-one', 'tag-two'],
        })
      );
    });

    it('should output the published view url', async () => {
      const currentBranch = await getCurrentBranch();

      const { stdout } = await execa(
        binaryPath,
        ['publish', ...defaultArguments],
        {
          env: {
            COMMONALITY_API_ORIGIN: server.getURL().origin,
            COMMONALITY_AUTH_ORIGIN: authServer.getURL().origin,
            COMMONALITY_PUBLISH_KEY: '123',
          },
        }
      );

      expect(stdout).toEqual(
        expect.stringContaining(
          `https://app.commonality.co/monorepo/root/${currentBranch}`
        )
      );
    });
  });

  describe('when the API returns an error', () => {
    beforeEach(async () => {
      server.post('/api/cli/publish').mockImplementation((context) => {
        context.status = 500;

        context.body = {
          message: 'An error occurred',
        };
      });
    });

    it('should output the error message', async () => {
      const { stderr, exitCode } = await execa(
        binaryPath,
        ['publish', ...defaultArguments],
        {
          env: {
            COMMONALITY_API_ORIGIN: server.getURL().origin,
            COMMONALITY_AUTH_ORIGIN: authServer.getURL().origin,
            COMMONALITY_PUBLISH_KEY: '123',
          },
          reject: false,
        }
      );

      expect(exitCode).toEqual(1);
      expect(stderr).toEqual(expect.stringContaining('An error occurred'));
    });
  });
});
