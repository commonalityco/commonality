/* eslint-disable @typescript-eslint/naming-convention */
import { jest } from '@jest/globals';

jest.unstable_mockModule('./get-code-owners.js', () => ({
	getCodeOwners: jest.fn().mockReturnValue({ 'packages/**': ['@team-one'] }),
}));

const { getOwnersForPath } = await import('./get-owners-for-path.js');

describe('get-owners-for-path', () => {
	describe('when the file is at the root of the repo', () => {
		it('returns an object containing the correct owners for each glob', () => {
			const owners = getOwnersForPath({
				path: 'packages/foo',
				rootDirectory: './',
			});

			expect(owners).toEqual(['@team-one']);
		});
	});
});
