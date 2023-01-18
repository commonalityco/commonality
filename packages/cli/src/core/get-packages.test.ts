/* eslint-disable @typescript-eslint/naming-convention */
import mock from 'mock-fs';
import { describe, expect, beforeEach, afterEach, it } from '@jest/globals';
import { getPackages } from './get-packages.js';

describe('getPackages', () => {
	describe('when all projects have a commonality.json file', () => {
		beforeEach(() => {
			mock({
				'root/packages/foo/package.json': JSON.stringify({
					version: '1.0.0',
					name: '@scope/foo',
					dependencies: {
						foo: '^1.0.0',
						next: '^13.0.0',
					},
					devDependencies: {
						bar: '^1.0.0',
					},
					peerDependencies: {
						baz: '^1.0.0',
					},
				}),
				'root/packages/foo/commonality.json': JSON.stringify({
					tags: ['tag-one'],
				}),
			});
		});

		afterEach(mock.restore);

		it('returns all packages within the monorepo', async () => {
			const packages = await getPackages({
				rootDirectory: 'root',
				packageDirectories: ['packages/foo'],
			});

			expect(packages).toEqual([
				{
					version: '1.0.0',
					owners: [],
					name: '@scope/foo',
					path: 'packages/foo',
					tags: ['tag-one'],
					dependencies: [
						{
							name: 'foo',
							version: '^1.0.0',
						},
						{
							name: 'next',
							version: '^13.0.0',
						},
					],
					devDependencies: [
						{
							name: 'bar',
							version: '^1.0.0',
						},
					],
					peerDependencies: [
						{
							name: 'baz',
							version: '^1.0.0',
						},
					],
				},
			]);
		});
	});

	describe('when all projects do not have a commonality.json file', () => {
		beforeEach(() => {
			mock({
				'root/packages/foo/package.json': JSON.stringify({
					version: '1.0.0',
					name: '@scope/foo',
					dependencies: {
						foo: '^1.0.0',
					},
					devDependencies: {
						bar: '^1.0.0',
					},
					peerDependencies: {
						baz: '^1.0.0',
					},
				}),
			});
		});

		afterEach(mock.restore);

		it('returns all packages within the monorepo', async () => {
			const packages = await getPackages({
				rootDirectory: 'root',
				packageDirectories: ['packages/foo'],
			});

			expect(packages).toEqual([
				{
					version: '1.0.0',
					name: '@scope/foo',
					owners: [],
					path: 'packages/foo',
					tags: [],
					dependencies: [
						{
							name: 'foo',
							version: '^1.0.0',
						},
					],
					devDependencies: [
						{
							name: 'bar',
							version: '^1.0.0',
						},
					],
					peerDependencies: [
						{
							name: 'baz',
							version: '^1.0.0',
						},
					],
				},
			]);
		});
	});
});
