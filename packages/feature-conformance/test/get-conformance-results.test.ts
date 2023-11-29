import { describe, expect, it } from 'vitest';
import { getConformanceResults } from '../src/get-conformance-results';
import { Conformer, Package, TagsData } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';

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
    const packages: Package[] = [
      {
        path: '/path/to/workspace',
        name: 'pkg-a',
        version: '1.0.0',
        type: PackageType.NODE,
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'pkg-a', tags: ['*'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      packages,
      tagsData,
      codeownersData: [],
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(false);
    expect(results[0].message.title).toBe('Invalid workspace');
    expect(results[0].pattern).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
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
    const packages: Package[] = [
      {
        path: '/path/to/workspace',
        name: 'pkg-a',
        version: '1.0.0',
        type: PackageType.NODE,
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'pkg-a', tags: ['*'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      packages,
      tagsData,
      codeownersData: [],
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(true);
    expect(results[0].message.title).toBe('Valid workspace');
    expect(results[0].pattern).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
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
    const packages: Package[] = [
      {
        path: '/path/to/workspace',
        name: 'pkg-a',
        version: '1.0.0',
        type: PackageType.NODE,
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'pkg-a', tags: ['*'] }];
    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      packages,
      tagsData,
      codeownersData: [],
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(false);
    expect(results[0].message.title).toBe('Exception during validation');
    expect(results[0].pattern).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
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
    const packages: Package[] = [
      {
        path: '/path/to/workspace',
        name: 'pkg-a',
        version: '1.0.0',
        type: PackageType.NODE,
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'pkg-a', tags: ['tag1'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      packages,
      tagsData,
      codeownersData: [],
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(true);
    expect(results[0].message.title).toBe('Valid workspace for tag1');
    expect(results[0].pattern).toBe('tag1');
    expect(results[0].package).toEqual(packages[0]);
    expect(results[0].level).toBe('warning');
  });

  it('should return correct result when message property is a function', async () => {
    const conformersByPattern: Record<string, Conformer[]> = {
      '*': [
        {
          name: 'MessageFunctionConformer',
          validate: () => true,
          message: ({ workspace }) => ({
            title: `Valid workspace for ${workspace.relativePath}`,
          }),
        },
      ],
    };
    const rootDirectory = '';
    const packages: Package[] = [
      {
        path: '/path/to/workspace',
        name: 'pkg-a',
        version: '1.0.0',
        type: PackageType.NODE,
      },
    ];
    const tagsData: TagsData[] = [{ packageName: 'pkg-a', tags: ['*'] }];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      packages,
      tagsData,
      codeownersData: [],
    });

    expect(results).toHaveLength(1);
    expect(results[0].isValid).toBe(true);
    expect(results[0].message.title).toBe(
      'Valid workspace for /path/to/workspace',
    );
    expect(results[0].pattern).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
    expect(results[0].level).toBe('warning');
  });
});
