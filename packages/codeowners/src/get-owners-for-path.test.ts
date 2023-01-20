/* eslint-disable @typescript-eslint/naming-convention */
import { getOwnersForPath } from './get-owners-for-path';

jest.mock('./get-code-owners.js', () => ({
	getCodeOwners: jest.fn().mockReturnValue({ 'packages/**': ['@team-one'] }),
}));

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
