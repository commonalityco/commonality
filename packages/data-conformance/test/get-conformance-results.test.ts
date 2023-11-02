import { describe, expect, it, vi } from 'vitest';
import { getConformanceResults } from '../src/get-conformance-results';
import { Conformer, TagsData, Workspace } from '@commonalityco/types';

describe('getConformanceResults', () => {
  it('should return errors when workspace is not valid', async () => {
    const conformersByPattern: Record<string, Conformer[]> = {
      '*': [
        {
          name: 'InvalidWorkspaceConformer',
          level: 'error',
          validate: () => false,
          message: 'Invalid workspace',
        },
      ],
    };
    const rootDirectory = '';
    const workspaces: Workspace[] = [
      {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['codeowner1', 'codeowner2'],
        packageJson: { name: 'invalid' },
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'invalid', tags: ['*'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      workspaces,
      tagsData,
      createJson: vi.fn(),
      createText: vi.fn(),
      createYaml: vi.fn(),
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(false);
    expect(results[0].message).toBe('Invalid workspace');
    expect(results[0].pattern).toBe('*');
    expect(results[0].workspace).toEqual(workspaces[0]);
    expect(results[0].level).toBe('error');
  });

  it('should return valid results when tests are valid', async () => {
    const conformersByPattern: Record<string, Conformer[]> = {
      '*': [
        {
          name: 'ValidWorkspaceConformer',
          validate: () => true,
          message: 'Valid workspace',
        },
      ],
    };
    const rootDirectory = '';
    const workspaces: Workspace[] = [
      {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['codeowner1', 'codeowner2'],
        packageJson: { name: 'valid' },
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'valid', tags: ['*'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      workspaces,
      tagsData,
      createJson: vi.fn(),
      createText: vi.fn(),
      createYaml: vi.fn(),
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(true);
    expect(results[0].message).toBe('Valid workspace');
    expect(results[0].pattern).toBe('*');
    expect(results[0].workspace).toEqual(workspaces[0]);
    expect(results[0].level).toBe('warning');
  });

  it('should handle exceptions during validation', async () => {
    const conformersByPattern: Record<string, Conformer[]> = {
      '*': [
        {
          name: 'ExceptionConformer',
          validate: () => {
            throw new Error('Unexpected error');
          },
          message: 'Exception during validation',
        },
      ],
    };
    const rootDirectory = '';
    const workspaces: Workspace[] = [
      {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['codeowner1', 'codeowner2'],
        packageJson: { name: 'exception' },
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'exception', tags: ['*'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      workspaces,
      tagsData,
      createJson: vi.fn(),
      createText: vi.fn(),
      createYaml: vi.fn(),
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(false);
    expect(results[0].message).toBe('Exception during validation');
    expect(results[0].pattern).toBe('*');
    expect(results[0].workspace).toEqual(workspaces[0]);
    expect(results[0].level).toBe('warning');
  });

  it('should handle conformers that target patterns other than *', async () => {
    const conformersByPattern: Record<string, Conformer[]> = {
      tag1: [
        {
          name: 'Tag1Conformer',
          validate: () => true,
          message: 'Valid workspace for tag1',
        },
      ],
    };
    const rootDirectory = '';
    const workspaces: Workspace[] = [
      {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['codeowner1', 'codeowner2'],
        packageJson: { name: 'exception' },
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'exception', tags: ['tag1'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      workspaces,
      tagsData,
      createJson: vi.fn(),
      createText: vi.fn(),
      createYaml: vi.fn(),
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(true);
    expect(results[0].message).toBe('Valid workspace for tag1');
    expect(results[0].pattern).toBe('tag1');
    expect(results[0].workspace).toEqual(workspaces[0]);
    expect(results[0].level).toBe('warning');
  });

  it('should return correct result when message property is a function', async () => {
    const conformersByPattern: Record<string, Conformer[]> = {
      '*': [
        {
          name: 'MessageFunctionConformer',
          validate: () => true,
          message: ({ workspace }) =>
            `Valid workspace for ${workspace.packageJson.name}`,
        },
      ],
    };
    const rootDirectory = '';
    const workspaces: Workspace[] = [
      {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['codeowner1', 'codeowner2'],
        packageJson: { name: 'valid' },
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'valid', tags: ['*'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      workspaces,
      tagsData,
      createJson: vi.fn(),
      createText: vi.fn(),
      createYaml: vi.fn(),
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(true);
    expect(results[0].message).toBe('Valid workspace for valid');
    expect(results[0].pattern).toBe('*');
    expect(results[0].workspace).toEqual(workspaces[0]);
    expect(results[0].level).toBe('warning');
  });
});
