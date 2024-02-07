import { describe, expect, it } from 'vitest';
import { getConformanceResults } from './get-conformance-results';
import { Package, TagsData } from '@commonalityco/types';
import { CheckOutput, PackageType, Status } from '@commonalityco/utils-core';

describe('getConformanceResults', () => {
  it('should return errors when workspace is not valid and have a level set to error', async () => {
    const conformersByPattern: Record<string, CheckOutput[]> = {
      '*': [
        {
          id: '123',
          level: 'error',
          validate: () => ({
            path: 'package.json',
          }),
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
    expect(results[0].status).toBe(Status.Fail);
    expect(results[0].message.message).toBe('Invalid workspace');
    expect(results[0].message.path).toBe('/path/to/workspace/package.json');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return errors when workspace is not valid and do not have a level set', async () => {
    const conformersByPattern: Record<string, CheckOutput[]> = {
      '*': [
        {
          id: '123',
          validate: () => ({
            path: 'package.json',
          }),
          message: 'Invalid workspace',
          level: 'warning',
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
    expect(results[0].status).toBe(Status.Warn);
    expect(results[0].message.message).toBe('Invalid workspace');
    expect(results[0].message.path).toBe('/path/to/workspace/package.json');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return valid results when checkOutputs are valid', async () => {
    const conformersByPattern: Record<string, CheckOutput[]> = {
      '*': [
        {
          id: '123',
          validate: () => true,
          message: 'Valid workspace',
          level: 'warning',
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
    expect(results[0].status).toBe(Status.Pass);
    expect(results[0].message.message).toBe('Valid workspace');
    expect(results[0].message.path).toBe(undefined);
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return valid results when checkOutputs are valid and there are no tags', async () => {
    const conformersByPattern: Record<string, CheckOutput[]> = {
      '*': [
        {
          id: '123',
          validate: () => true,
          message: 'Valid workspace',
          level: 'warning',
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
    const tagsData: TagsData[] = [];

    const results = await getConformanceResults({
      conformersByPattern,
      rootDirectory,
      packages,
      tagsData,
      codeownersData: [],
    });

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe(Status.Pass);
    expect(results[0].message.message).toBe('Valid workspace');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should handle exceptions during validation', async () => {
    const conformersByPattern: Record<string, CheckOutput[]> = {
      '*': [
        {
          id: '123',
          validate: () => {
            throw new Error('Unexpected error');
          },
          message: 'Exception during validation',
          level: 'warning',
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
    expect(results[0].status).toBe(Status.Warn);
    expect(results[0].message.message).toBe('Exception during validation');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should handle conformers that target patterns other than *', async () => {
    const conformersByPattern: Record<string, CheckOutput[]> = {
      tag1: [
        {
          
          id: '123',
          validate: () => true,
          message: 'Valid workspace for tag1',
          level: 'warning',
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
    expect(results[0].status).toBe(Status.Pass);
    expect(results[0].message.message).toBe('Valid workspace for tag1');
    expect(results[0].filter).toBe('tag1');
    expect(results[0].package).toEqual(packages[0]);
  });
});
