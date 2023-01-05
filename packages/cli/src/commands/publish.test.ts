import {
  GenericError,
  GenericErrorMessage,
  InvalidSnapshotError,
  InvalidSnapshotErrorMessage,
} from '@commonalityco/errors';
import * as ensureAuth from '../core/ensureAuth';
import * as getRootDirectory from '../core/getRootDirectory';
import { actionHandler } from './publish';
import * as getPackageManager from '../core/getPackageManager';
import * as getWorkspaces from '../core/getWorkspaces';
import * as getPackageDirectories from '../core/getPackageDirectories';
import * as getSnapshot from '../core/getSnapshot';
import { PackageManager } from '../constants/PackageManager';
import { PackageType } from '@commonalityco/types';
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');
import ora from 'ora';

jest.mock('ora');
jest.mock('node-fetch');

describe('publish', () => {
  const mockedFetch = jest.mocked(fetch);
  const mockedOra = jest.mocked(ora);
  const responseUrl =
    'https://app.commonality.co/commonality/monorepo/root/main';

  const oraSucceed = jest.fn();
  const oraStart = jest.fn().mockReturnValue({ succeed: oraSucceed });

  beforeEach(() => {
    jest.clearAllMocks();

    mockedOra.mockReturnValue({
      start: oraStart,
    } as any);

    jest.spyOn(ensureAuth, 'ensureAuth').mockResolvedValue(true);
    jest.spyOn(getRootDirectory, 'getRootDirectory').mockResolvedValue('/root');
    jest
      .spyOn(getPackageManager, 'getPackageManager')
      .mockResolvedValue(PackageManager.YARN);
    jest
      .spyOn(getWorkspaces, 'getWorkspaces')
      .mockResolvedValue(['packages/**', 'apps/**']);
    jest
      .spyOn(getPackageDirectories, 'getPackageDirectories')
      .mockResolvedValue(['packages/foo', 'apps/bar']);
    jest
      .spyOn(getPackageDirectories, 'getPackageDirectories')
      .mockResolvedValue(['packages/foo', 'apps/bar']);
    jest.spyOn(getSnapshot, 'getSnapshot').mockResolvedValue({
      projectId: '123',
      branch: 'feature-branch',
      packages: [
        {
          name: '@scope/foo',
          path: 'packages/foo',
          version: '1.0.0',
          tags: [],
          type: PackageType.NODE,
          dependencies: [],
          devDependencies: [],
          peerDependencies: [],
        },
      ],
      tags: ['app', 'library'],
    });
  });

  describe('actionHandler', () => {
    describe('when the published data is valid', () => {
      beforeEach(() => {
        const response = new Response(JSON.stringify({ url: responseUrl }), {
          status: 200,
          statusText: 'OK',
        });

        mockedFetch.mockResolvedValue(response);
      });

      describe('when authenticating with a publish key', () => {
        it('should not call ensureAuth', async () => {
          await actionHandler({ publishKey: '123' }, {
            error: jest.fn(),
          } as any);

          expect(ensureAuth.ensureAuth).not.toHaveBeenCalled();
        });
      });

      describe('when authenticating with an access token', () => {
        it('should call ensureAuth', async () => {
          await actionHandler(undefined, { error: jest.fn() } as any);

          expect(ensureAuth.ensureAuth).toHaveBeenCalled();
        });
      });
    });

    describe('when the request returns a 400 status', () => {
      beforeEach(() => {
        const response = new Response(JSON.stringify({}), {
          status: 400,
        });

        mockedFetch.mockResolvedValue(response);
      });

      it('stops the spinner', async () => {
        const errorFn = jest.fn();
        await actionHandler(undefined, { error: errorFn } as any);

        expect(oraSucceed).toHaveBeenCalled();
      });

      it(`exits with the message for ${InvalidSnapshotError.name}`, async () => {
        const errorFn = jest.fn();
        await actionHandler(undefined, { error: errorFn } as any);

        expect(errorFn).toHaveBeenCalledWith(InvalidSnapshotErrorMessage);
      });
    });

    describe('when the request returns a 500 status', () => {
      beforeEach(() => {
        const response = new Response(
          {},
          {
            status: 500,
          }
        );

        mockedFetch.mockResolvedValue(response);
      });

      it('stops the spinner', async () => {
        const errorFn = jest.fn();
        await actionHandler(undefined, { error: errorFn } as any);

        expect(oraSucceed).toHaveBeenCalled();
      });

      it(`exits with the message for ${GenericError.name}`, async () => {
        const errorFn = jest.fn();
        await actionHandler(undefined, { error: errorFn } as any);

        expect(errorFn).toHaveBeenCalledWith(GenericErrorMessage);
      });
    });
  });
});
