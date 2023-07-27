import { SnapshotData } from '@commonalityco/types';
import { actionHandler } from './publish';
import got, { HTTPError } from 'got';

import { vi, describe, it, afterEach, expect, beforeEach } from 'vitest';
import { Command } from 'commander';
import chalk from 'chalk';

// Mocking external dependencies
//

// Mocking global variables and functions

describe('publish.action', () => {
  const action = new Command();

  beforeEach(() => {
    vi.doMock('ora', () => {
      return {
        default: vi.fn().mockReturnValue({
          start: vi.fn().mockReturnValue({
            succeed: vi.fn(),
            stop: vi.fn(),
          }),
        }),
      };
    });

    vi.spyOn(got, 'post').mockReturnValue({
      json: vi.fn().mockResolvedValue({ url: 'https://example.com' }),
    } as any);

    vi.spyOn(action, 'error').mockImplementation((() => {}) as any);
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when the projectId does not exist', () => {
    it('should call action.error', async () => {
      const snapshot: SnapshotData = {
        packages: [],
        tagsData: [],
        documentsData: [],
        codeownersData: [],
        violations: [],
        projectConfig: {},
      };

      await actionHandler({
        rootDirectory: '/path',
        snapshot,
        key: 'test-key',
        apiOrigin: 'https://app.commonality.co',
        action,
      });

      expect(action.error).toHaveBeenCalledWith(
        expect.stringContaining(chalk.red.bold('No projectId found'))
      );
    });
  });

  describe('when the API key does not exist', () => {
    it('should call action.error', async () => {
      const snapshot: SnapshotData = {
        packages: [],
        tagsData: [],
        documentsData: [],
        codeownersData: [],
        violations: [],
        projectConfig: {
          projectId: '123',
        },
      };

      await actionHandler({
        rootDirectory: '/path',
        snapshot,
        apiOrigin: 'https://app.commonality.co',
        action,
      });

      expect(action.error).toHaveBeenCalledWith(
        expect.stringContaining(chalk.red.bold('Missing API key'))
      );
    });
  });

  describe('when the API call is sucessful', () => {
    it('should handle successful snapshot publishing', async () => {
      const snapshot: SnapshotData = {
        packages: [],
        tagsData: [],
        documentsData: [],
        codeownersData: [],
        violations: [],
        projectConfig: {
          projectId: 'test-id',
        },
      };

      await actionHandler({
        rootDirectory: '/path',
        snapshot,
        key: 'test-key',
        apiOrigin: 'https://app.commonality.co',
        action,
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(
          `View your graph at ${chalk.bold.blue('https://example.com')}`
        )
      );
    });
  });
});
