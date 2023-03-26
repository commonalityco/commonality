import path from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'fs-extra';
import execa from 'execa';

const binaryPath = path.resolve(__dirname, `../../dist/cli.js`);
const distributionPath = path.resolve(__dirname, '../../dist');
const temporaryDirectory = path.join(tmpdir(), 'commonality-cli-test-link');
const distributionToTemporary = path.relative(
  distributionPath,
  temporaryDirectory
);
const configPath = path.join(temporaryDirectory, '.commonality/config.json');

const defaultArguments = ['--cwd', distributionToTemporary];

describe('link', () => {
  beforeEach(() => {
    fs.removeSync(temporaryDirectory);
    fs.removeSync(configPath);

    fs.outputJsonSync(path.join(temporaryDirectory, './package-lock.json'), {});
  });

  describe('when a configuration does not exist', () => {
    it('creates the configuration file', async () => {
      await execa(binaryPath, [
        'link',
        '--project',
        '123',
        ...defaultArguments,
      ]);

      const exists = await fs.pathExists(
        path.join(temporaryDirectory, '.commonality/config.json')
      );

      expect(exists).toBe(true);

      const json = fs.readJsonSync(configPath) as { project: string };

      expect(json).toEqual({ projectId: '123' });
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
      await execa(binaryPath, [
        'link',
        '--project',
        '123',
        ...defaultArguments,
      ]);

      const json = fs.readJsonSync(configPath) as { project: string };

      expect(json).toEqual({ projectId: '123', tags: [] });
    });
  });
});
