import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { action as init } from './init.js';
import mockFs from 'mock-fs';
import console from 'node:console';
import stripAnsi from 'strip-ansi';
import prompts from 'prompts';

const getConsoleCalls = () => {
  return vi
    .mocked(console.log)
    .mock.calls.map((call) =>
      call.map((item) => (typeof item === 'string' ? stripAnsi(item) : item)),
    );
};

vi.mock('node:console', async () => ({
  default: {
    ...(await vi.importActual<Console>('node:console')),
    log: vi.fn().mockImplementation(() => {}),
  },
}));

describe('init', () => {
  afterEach(() => {
    vi.resetAllMocks();
    mockFs.restore();
  });

  it('properly configures a blank project if user selects TypeScript and installation of checks', async () => {
    prompts.inject([
      // Confirm use of TypeScript
      true,
      // Confirm installation of checks
      true,
    ]);

    mockFs({
      'package.json': JSON.stringify({
        name: 'my-project',
      }),
      'yarn.lock': '',
    });

    await init({ rootDirectory: './' });

    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      Here are the changes we'll make to your project:",
        ],
        [
          "- Install commonality",
        ],
        [
          "- Create a commonality.config.ts file",
        ],
        [
          "- Install and set up commonality-checks-recommended",
        ],
      ]
    `);
  });

  it('properly configures a blank project if user selects JavaScript and installation of checks', async () => {
    prompts.inject([
      // Decline use of TypeScript
      false,
      // Confirm installation of checks
      true,
    ]);

    mockFs({
      'package.json': JSON.stringify({
        name: 'my-project',
      }),
      'yarn.lock': '',
    });

    await init({ rootDirectory: './' });

    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      Here are the changes we'll make to your project:",
        ],
        [
          "- Install commonality",
        ],
        [
          "- Create a commonality.config.js file",
        ],
        [
          "- Install and set up commonality-checks-recommended",
        ],
      ]
    `);
  });

  it('properly configures a blank project if user selects JavaScript and declines installation of checks', async () => {
    prompts.inject([
      // Decline use of TypeScript
      false,
      // Decline installation of checks
      false,
    ]);

    mockFs({
      'package.json': JSON.stringify({
        name: 'my-project',
      }),
      'yarn.lock': '',
    });

    await init({ rootDirectory: './' });

    expect(getConsoleCalls()).toMatchInlineSnapshot(`
      [
        [
          "
      Here are the changes we'll make to your project:",
        ],
        [
          "- Install commonality",
        ],
        [
          "- Create a commonality.config.js file",
        ],
      ]
    `);
  });
});
