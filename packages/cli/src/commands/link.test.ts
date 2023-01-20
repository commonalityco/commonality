import path from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'fs-extra';
import execa from 'execa';

const binaryPath = path.resolve(__dirname, `../../scripts/start.js`);
const distPath = path.resolve(__dirname, '../../dist');
const temporaryDir = path.join(tmpdir(), 'commonality-cli-test-link');
const distToTemporary = path.relative(distPath, temporaryDir);
const configPath = path.join(temporaryDir, '.commonality/config.json');

const defaultArgs = ['--cwd', distToTemporary];

describe('link', () => {
	beforeEach(() => {
		fs.removeSync(temporaryDir);
		fs.removeSync(configPath);

		fs.outputJsonSync(path.join(temporaryDir, './package-lock.json'), {});
	});

	describe('when a configuration does not exist', () => {
		it('creates the configuration file', async () => {
			await execa(binaryPath, ['link', '--project', '123', ...defaultArgs]);

			const exists = await fs.pathExists(
				path.join(temporaryDir, '.commonality/config.json')
			);

			expect(exists).toBe(true);

			const json = fs.readJsonSync(configPath) as { project: string };

			expect(json).toEqual({ project: '123' });
		});
	});

	describe('when a configuration file already exists', () => {
		beforeEach(async () => {
			await fs.outputJSON(configPath, {
				project: 'abc',
				tags: [],
			});
		});

		it('updates the configuration file', async () => {
			await execa(binaryPath, ['link', '--project', '123', ...defaultArgs]);

			const json = fs.readJsonSync(configPath) as { project: string };

			expect(json).toEqual({ project: '123', tags: [] });
		});
	});
});
