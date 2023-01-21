/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import execa from 'execa';
import { MockServer } from 'jest-mock-server';
import { store } from '../core/store';

const binaryPath = path.resolve(__dirname, `../../scripts/start.js`);

describe('login', () => {
  const server = new MockServer();

  beforeAll(async () => {
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  beforeEach(() => {
    server.reset();

    server.post('/oauth/device/code').mockImplementation((context) => {
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

    server
      .post('/oauth/token')
      .mockImplementationOnce((context) => {
        context.status = 403;
      })
      .mockImplementationOnce((context) => {
        context.status = 200;
        context.body = {
          access_token: '123',
          expires_in: 123,
          token_type: 'access_token',
        };
      });
  });

  describe('when not already logged in', () => {
    beforeEach(async () => {
      store.clear();
    });

    it('should display the verification code', async () => {
      const { stdout } = await execa(binaryPath, ['login'], {
        env: {
          COMMONALITY_AUTH_ORIGIN: server.getURL().origin,
        },
      });

      expect(stdout).toEqual(expect.stringContaining('ABC-DEF'));
    });

    it('should display the verification url', async () => {
      const { stdout } = await execa(binaryPath, ['login'], {
        env: {
          COMMONALITY_AUTH_ORIGIN: server.getURL().origin,
        },
      });

      expect(stdout).toEqual(expect.stringContaining('verify-complete'));
    });
  });
});
