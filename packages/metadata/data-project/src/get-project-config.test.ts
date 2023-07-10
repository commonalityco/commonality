import path from 'path';
import { getProjectConfig } from './get-project-config';

const log = console.log;

describe('getProjectConfig', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = log;
  });

  it('should return an empty object if the project config file does not exist', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../fixtures',
      'missing-project-config'
    );
    const config = await getProjectConfig({ rootDirectory });

    expect(config).toEqual({});
  });

  it('should return the parsed project config if the file exists and is valid', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../fixtures',
      'valid-project-config'
    );

    const config = await getProjectConfig({ rootDirectory });

    expect(config).toEqual({
      projectId: '123',
      constraints: [
        {
          applyTo: 'feature',
          allow: '*',
        },
        {
          applyTo: 'config',
          allow: ['config'],
        },
        {
          applyTo: 'ui',
          allow: ['ui', 'utility', 'config'],
        },
        {
          applyTo: 'data',
          allow: ['data', 'utility', 'config'],
        },
        {
          applyTo: 'utility',
          allow: ['data', 'utility', 'config'],
        },
      ],
    });
  });

  it('should throw an error if the file exists but is invalid', async () => {
    const rootDirectory = path.join(
      __dirname,
      '../fixtures',
      'invalid-project-config'
    );

    await expect(getProjectConfig({ rootDirectory })).rejects.toThrow();
  });
});
