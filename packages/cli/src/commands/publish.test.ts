/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Server } from 'node:http';
import {
	describe,
	expect,
	jest,
	it,
	afterAll,
	beforeAll,
	beforeEach,
} from '@jest/globals';
import { execa } from 'execa';
import {
	createMockAuthServer,
	mockAuthServerSpy,
} from '../test/create-mock-auth-server.js';
import { createMockServer } from '../test/create-mock-server.js';
import { config } from '../core/config.js';
import { getCurrentBranch } from '../core/get-current-branch.js';

const oraSucceed = jest.fn();
const oraFail = jest.fn();

jest.unstable_mockModule('ora', () => ({
	default: jest.fn().mockReturnValue({
		start: jest.fn().mockReturnValue({ succeed: oraSucceed, fail: oraFail }),
	}),
}));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const binaryPath = path.resolve(__dirname, `../../dist/index.js`);

describe('publish', () => {
	let server: Server;
	let serverAddress: string;
	let authServer: Server;
	let authServerAddress: string;

	beforeAll(async () => {
		const mockServer = await createMockServer();
		const mockAuthServer = await createMockAuthServer();

		server = mockServer.server;
		serverAddress = mockServer.url;

		authServer = mockAuthServer.server;
		authServerAddress = mockAuthServer.url;
	});

	afterAll(() => {
		server.close();
		authServer.close();
	});

	beforeEach(() => {
		config.clear();
		jest.clearAllMocks();
	});

	describe('when the published data is valid', () => {
		describe('when authenticating with a passed publish key', () => {
			it('should not call the auth API', async () => {
				await execa(binaryPath, ['publish', '--publishKey', '123'], {
					env: {
						COMMONALITY_API_ORIGIN: serverAddress,
						COMMONALITY_AUTH_ORIGIN: authServerAddress,
					},
				});

				expect(mockAuthServerSpy).not.toHaveBeenCalled();
			});
		});

		describe('when authenticating with a env var publish key', () => {
			it('should not call the auth API', async () => {
				await execa(binaryPath, ['publish'], {
					env: {
						COMMONALITY_API_ORIGIN: serverAddress,
						COMMONALITY_AUTH_ORIGIN: authServerAddress,
						COMMONALITY_PUBLISH_KEY: '123',
					},
				});

				expect(mockAuthServerSpy).not.toHaveBeenCalled();
			});
		});

		describe('when authenticating with an access token', () => {
			it('should call the auth API', async () => {
				await execa(binaryPath, ['publish'], {
					env: {
						COMMONALITY_API_ORIGIN: serverAddress,
						COMMONALITY_AUTH_ORIGIN: authServerAddress,
					},
				});

				expect(mockAuthServerSpy).toHaveBeenCalled();
			});
		});

		it('should output the published view url', async () => {
			const { stdout } = await execa(binaryPath, ['publish'], {
				env: {
					COMMONALITY_API_ORIGIN: serverAddress,
					COMMONALITY_AUTH_ORIGIN: authServerAddress,
				},
			});

			const currentBranch = await getCurrentBranch();

			expect(stdout).toEqual(
				expect.stringContaining(
					`https://app.commonality.co/monorepo/root/${currentBranch}`
				)
			);
		});
	});
});
