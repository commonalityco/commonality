/* eslint-disable @typescript-eslint/naming-convention */
import { PackageType } from '@commonalityco/types';
import { describe, expect, jest, it } from '@jest/globals';
import { HTTPError } from 'got';
import { PackageManager } from '../constants/bar.js';

const { getRootDirectory } = await import('../core/get-root-directory.js');
const { getPackageManager } = await import('../core/get-package-manager.js');
const { getWorkspaces } = await import('../core/get-workspaces.js');
const { getPackageDirectories } = await import(
	'../core/get-package-directories.js'
);
const { getSnapshot } = await import('../core/get-snapshot.js');

jest.unstable_mockModule('../core/ensure-auth.js', () => ({
	ensureAuth: jest.fn<typeof ensureAuth>().mockResolvedValue(true),
}));

jest.unstable_mockModule('../core/get-package-manager.js', () => ({
	getPackageManager: jest
		.fn<typeof getPackageManager>()
		.mockResolvedValue(PackageManager.PNPM),
}));

jest.unstable_mockModule('../core/get-root-directory.js', () => ({
	getRootDirectory: jest
		.fn<typeof getRootDirectory>()
		.mockResolvedValue('/root'),
}));

jest.unstable_mockModule('../core/get-workspaces.js', () => ({
	getWorkspaces: jest
		.fn<typeof getWorkspaces>()
		.mockResolvedValue(['packages/**', 'apps/**']),
}));

jest.unstable_mockModule('../core/get-package-directories.js', () => ({
	getPackageDirectories: jest
		.fn<typeof getPackageDirectories>()
		.mockResolvedValue(['packages/foo', 'apps/bar']),
}));

jest.unstable_mockModule('../core/get-snapshot.js', () => ({
	getSnapshot: jest.fn<typeof getSnapshot>().mockResolvedValue({
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
				owners: [],
			},
		],
		tags: ['app', 'library'],
	}),
}));

const oraSucceed = jest.fn();
const oraFail = jest.fn();

jest.unstable_mockModule('ora', () => ({
	default: jest.fn().mockReturnValue({
		start: jest.fn().mockReturnValue({ succeed: oraSucceed, fail: oraFail }),
	}),
}));

const responseUrl = 'https://app.commonality.co/commonality/monorepo/root/main';

jest.unstable_mockModule('got', () => ({
	HTTPError,
	post: jest.fn().mockReturnValue({
		json: jest.fn<any>().mockResolvedValue({ url: responseUrl }),
	} as any),
}));

const { ensureAuth } = await import('../core/ensure-auth.js');
const { actionHandler } = await import('./publish.js');

describe('publish', () => {
	describe('when the published data is valid', () => {
		describe('when authenticating with a publish key', () => {
			it('should not call ensureAuth', async () => {
				await actionHandler(
					{
						error: jest.fn(),
					} as any,
					{ publishKey: '123' }
				);

				expect(ensureAuth).not.toHaveBeenCalled();
			});
		});

		describe('when authenticating with an access token', () => {
			it('should call ensureAuth', async () => {
				await actionHandler({ error: jest.fn() } as any, undefined);

				expect(ensureAuth).toHaveBeenCalled();
			});
		});
	});
});
