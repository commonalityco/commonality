/* eslint-disable no-irregular-whitespace */
import path from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'fs-extra';
import { beforeEach, jest } from '@jest/globals';
import { execa } from 'execa';
import type { ProjectConfig, PackageConfig } from '@commonalityco/types';

const binaryPath = path.resolve(__dirname, `../../scripts/start.js`);
const distPath = path.resolve(__dirname, '../../dist');
const temporaryDir = path.join(tmpdir(), 'commonality-cli-test-validate');
const distToTemporary = path.relative(distPath, temporaryDir);
const defaultArgs = ['--cwd', distToTemporary];

const writeTestFiles = ({
	config,
	packages,
}: {
	baseDir: string;
	config: ProjectConfig;
	packages: Array<{
		name: string;
		config?: PackageConfig;
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	}>;
}) => {
	fs.outputJsonSync(path.join(temporaryDir, './package-lock.json'), {});
	fs.outputJsonSync(path.join(temporaryDir, './package.json'), {
		workspaces: ['apps/*', 'packages/*'],
	});
	fs.outputJsonSync(
		path.join(temporaryDir, './.commonality/config.json'),
		config
	);

	for (const pkg of packages) {
		fs.outputJsonSync(
			path.join(temporaryDir, `./packages/${pkg.name}/package.json`),
			{
				name: pkg.name,
				version: '1.0.0',
				dependencies: pkg.dependencies,
				devDependencies: pkg.dependencies,
			}
		);

		if (pkg.config) {
			fs.outputJsonSync(
				path.join(temporaryDir, `./packages/${pkg.name}/commonality.json`),
				pkg.config
			);
		}
	}
};

describe('validate', () => {
	beforeEach(async () => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		fs.removeSync(temporaryDir);
	});

	describe('when there are no constraints defined', () => {
		beforeEach(() => {
			writeTestFiles({
				baseDir: temporaryDir,
				packages: [],
				config: { project: '123' },
			});
		});

		it('should log a warning message', async () => {
			const { stdout } = await execa(
				binaryPath,
				['validate', ...defaultArgs],
				{}
			);

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
		describe('when a dependency is missing package configuration', () => {
			beforeEach(() => {
				writeTestFiles({
					baseDir: temporaryDir,
					packages: [
						{
							name: 'pkg-one',
							config: {
								tags: ['tag-one'],
							},
							dependencies: {
								'pkg-two': '*',
							},
						},
						{
							name: 'pkg-two',
							config: {
								tags: ['tag-two'],
							},
							dependencies: {
								'pkg-three': '*',
							},
						},
						{
							name: 'pkg-three',
						},
					],
					config: {
						project: '123',
						constraints: [
							{
								tags: ['tag-one'],
								allow: ['tag-two'],
							},
						],
					},
				});
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
					'/packages/pkg-three/package.json'
				);

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

		describe('when a dependency has package configuration', () => {
			beforeEach(() => {
				writeTestFiles({
					baseDir: temporaryDir,
					packages: [
						{
							name: 'pkg-one',
							config: {
								tags: ['tag-one'],
							},
							dependencies: {
								'pkg-two': '*',
							},
							devDependencies: {
								'pkg-three': '*',
							},
						},
						{
							name: 'pkg-two',
							config: {
								tags: ['tag-two'],
							},
							dependencies: {
								'pkg-three': '*',
							},
						},
						{
							name: 'pkg-three',
							config: {
								tags: [],
							},
							devDependencies: {
								'pkg-one': '*',
							},
						},
					],
					config: {
						project: '123',
						constraints: [
							{
								tags: ['tag-one'],
								allow: ['tag-two'],
							},
						],
					},
				});
			});

			it('should log the total violations to stderr', async () => {
				const { stderr } = await execa(
					binaryPath,
					['validate', ...defaultArgs],
					{
						reject: false,
					}
				);

				expect(stderr).toEqual(expect.stringContaining('1 violation found'));
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
		beforeEach(() => {
			writeTestFiles({
				baseDir: temporaryDir,
				packages: [
					{
						name: 'pkg-one',
						config: {
							tags: ['tag-one'],
						},
						dependencies: {
							'pkg-two': '*',
						},
					},
					{
						name: 'pkg-two',
						config: {
							tags: ['tag-two'],
						},
						dependencies: {
							'pkg-three': '*',
						},
					},
					{
						name: 'pkg-three',
						config: {
							tags: ['tag-three'],
						},
					},
				],
				config: {
					project: '123',
					constraints: [
						{
							tags: ['tag-one'],
							allow: ['tag-two'],
						},
						{
							tags: ['tag-two'],
							allow: ['tag-three'],
						},
					],
				},
			});
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
