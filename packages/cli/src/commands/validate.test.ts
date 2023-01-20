/* eslint-disable no-irregular-whitespace */
import path from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'fs-extra';
import { beforeEach, jest } from '@jest/globals';
import execa from 'execa';

const pkgRoot = path.resolve(__dirname, '../../');
const binaryPath = path.join(pkgRoot, `scripts/start.js`);
const distPath = path.join(pkgRoot, 'dist');
const temporaryDir = path.join(tmpdir(), 'commonality-cli-test-validate');
const pkgRootToTemporary = path.relative(temporaryDir, pkgRoot);
const distToTemporary = path.relative(distPath, temporaryDir);
const defaultArgs = ['--cwd', distToTemporary];

const copyFixtureAndInstall = async (name: string) => {
	await fs.remove(temporaryDir);

	const fixturePath = path.join(
		path.resolve(__dirname, '../../test/fixtures'),
		name
	);

	await fs.copy(fixturePath, temporaryDir);

	await execa('pnpm', ['link', pkgRoot], {
		cwd: temporaryDir,
	});
};

describe('validate', () => {
	beforeEach(async () => {
		jest.clearAllMocks();
	});

	describe('when there are no constraints defined', () => {
		beforeEach(async () => {
			await copyFixtureAndInstall('no-constraints');
		});

		it('should log a warning message', async () => {
			const { stdout } = await execa(binaryPath, ['validate', ...defaultArgs]);

			expect(stdout).toEqual(expect.stringContaining('No constraints found'));
		});

		it('exit the process gracefully', async () => {
			const { exitCode } = await execa(
				binaryPath,
				['validate', ...defaultArgs],
				{}
			);

			expect(exitCode).toEqual(0);
		});
	});

	describe('when there are violations', () => {
		describe('and a dependency is missing package configuration', () => {
			beforeEach(async () => {
				await copyFixtureAndInstall('missing-package-configuration');
			});

			it('should log target name and link', async () => {
				const { stdout, stderr } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);
				const pkgViolationPath = path.join(
					temporaryDir,
					'/packages/pkg-three/package.json'
				);
				console.log({ stderr });

				expect(stdout).toEqual(
					expect.stringContaining(`pkg-three (​${pkgViolationPath}​)`)
				);
			});

			it('should log the error to stdout', async () => {
				const { stdout } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{ reject: false }
				);

				expect(stdout).toEqual(
					expect.stringContaining('Missing package configuration')
				);
			});

			it('exit the process with an error code', async () => {
				const { exitCode } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);

				expect(exitCode).toEqual(1);
			});
		});

		describe('and all dependencies have package configuration', () => {
			beforeEach(async () => {
				await copyFixtureAndInstall('constraint-violations');
			});

			it('should log the total violations to stderr', async () => {
				const { stderr } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);

				expect(stderr).toEqual(expect.stringContaining('4 violations found'));
			});

			it('should log source name and link', async () => {
				const { stdout } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);
				const pkgViolationPath = path.join(
					temporaryDir,
					'/packages/pkg-two/commonality.json'
				);

				expect(stdout).toEqual(
					expect.stringContaining(`pkg-two (​${pkgViolationPath}​)`)
				);
			});

			it('should log target name and link', async () => {
				const { stdout } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);
				const pkgViolationPath = path.join(
					temporaryDir,
					'/packages/pkg-three/commonality.json'
				);

				expect(stdout).toEqual(
					expect.stringContaining(`pkg-three (​${pkgViolationPath}​)`)
				);
			});

			it('should log the expected tags', async () => {
				const { stdout } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);

				expect(stdout).toEqual(expect.stringContaining('Expected tags:'));
				expect(stdout).toEqual(expect.stringContaining('["tag-two"]'));
			});

			it('should log the received tags', async () => {
				const { stdout } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);

				expect(stdout).toEqual(expect.stringContaining('Found tags:'));
				expect(stdout).toEqual(expect.stringContaining('[]'));
			});

			it('exit the process with an error code', async () => {
				const { exitCode } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);

				expect(exitCode).toEqual(1);
			});
		});
	});

	describe('when there are no violations', () => {
		beforeEach(async () => {
			await copyFixtureAndInstall('no-violations');
		});

		it('should log a success message', async () => {
			const { stdout } = await execa(binaryPath, ['validate', ...defaultArgs]);

			expect(stdout).toEqual(expect.stringContaining('No violations found'));
		});

		it('exit the process gracefully', async () => {
			const { exitCode } = await execa(binaryPath, [
				'validate',
				...defaultArgs,
			]);

			expect(exitCode).toEqual(0);
		});
	});
});
