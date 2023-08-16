import { validateAction } from '../../src/commands/validate.js';
import { vi, describe, it, expect, beforeEach, test, afterEach } from 'vitest';
import { Command } from 'commander';

vi.mock('@commonalityco/data-violations', () => {
  return {
    getViolations: vi.fn(),
  };
});

vi.mock('@commonalityco/data-tags', () => {
  return {
    getTagsData: vi.fn(),
  };
});

vi.mock('@commonalityco/data-packages', () => {
  return { getPackages: vi.fn() };
});
vi.mock('@commonalityco/data-project', () => {
  return { getRootDirectory: vi.fn(), getProjectConfig: vi.fn() };
});

describe('validateAction', () => {
  const command = new Command();

  beforeEach(() => {
    vi.spyOn(command, 'error').mockImplementation(
      (() => {}) as unknown as typeof command.error,
    );
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when there are no constraints', () => {
    test('does not error', async () => {
      const errorSpy = vi
        .spyOn(command, 'error')
        .mockImplementation((() => {}) as unknown as typeof command.error);

      await validateAction({
        projectConfig: {},
        rootDirectory: '/path',
        violations: [],
        command,
      });

      expect(errorSpy).not.toHaveBeenCalled();
    });

    test('logs that there are no constraints', async () => {
      await validateAction({
        projectConfig: {},
        rootDirectory: '/path',
        violations: [],
        command,
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('No constraints found'),
      );
    });
  });

  describe('when there are violations', () => {
    describe('when applied to all packages', () => {
      beforeEach(async () => {
        await validateAction({
          command,
          rootDirectory: '/path',
          projectConfig: {
            constraints: [
              {
                applyTo: '*',
                allow: ['tag-two'],
              },
            ],
          },
          violations: [
            {
              appliedTo: '*',
              sourcePackageName: 'pkg-one',
              targetPackageName: 'pkg-two',
              allowed: ['tag-two'],
              disallowed: [],
              found: ['bar'],
            },
          ],
        });
      });

      test('when applied to all packages logs violations in the correct format', async () => {
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('All packages'),
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('1 violations'),
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('pkg-one → pkg-two'),
        );
      });
    });

    test('when applied to specific tags logs violations in the correct format', async () => {
      await validateAction({
        rootDirectory: '/path',
        command,
        violations: [
          {
            appliedTo: 'tag-one',
            sourcePackageName: 'pkg-one',
            targetPackageName: 'pkg-two',
            allowed: ['tag-two'],
            disallowed: [],
            found: ['bar'],
          },
        ],
        projectConfig: {
          constraints: [
            {
              applyTo: 'tag-one',
              allow: ['tag-two'],
            },
            {
              applyTo: 'tag-two',
              allow: ['tag-three'],
            },
          ],
        },
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('1 violations'),
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('1 failed'),
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('pkg-one → pkg-two'),
      );
    });

    test('called command.error', async () => {
      await validateAction({
        rootDirectory: '/path',
        command,
        violations: [
          {
            appliedTo: 'tag-one',
            sourcePackageName: 'pkg-one',
            targetPackageName: 'pkg-two',
            allowed: ['tag-two'],
            disallowed: [],
            found: ['bar'],
          },
        ],
        projectConfig: {
          constraints: [
            {
              applyTo: 'tag-one',
              allow: ['tag-two'],
            },
            {
              applyTo: 'tag-two',
              allow: ['tag-three'],
            },
          ],
        },
      });

      expect(command.error).toHaveBeenCalled();
    });
  });

  describe('when there are no violations', () => {
    describe('when applied to all packages', () => {
      beforeEach(async () => {
        await validateAction({
          rootDirectory: '/path',
          command,
          projectConfig: {
            constraints: [
              {
                applyTo: '*',
                allow: ['tag-two'],
              },
            ],
          },
          violations: [],
        });
      });

      it('should not error', () => {
        expect(command.error).not.toHaveBeenCalled();
      });

      it('should display the correct tags', () => {
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('All packages'),
        );
      });
    });

    describe('when applied to specific tags', () => {
      beforeEach(async () => {
        await validateAction({
          rootDirectory: '/path',
          command,
          projectConfig: {
            constraints: [
              {
                applyTo: 'tag-one',
                allow: ['tag-two'],
              },
            ],
          },
          violations: [],
        });
      });

      it('should display the correct tags', () => {
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('#tag-one'),
        );
      });

      it('should not error', () => {
        expect(command.error).not.toHaveBeenCalled();
      });

      it('should display that there were no violations', () => {
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('No violations'),
        );
      });
    });
  });
});
