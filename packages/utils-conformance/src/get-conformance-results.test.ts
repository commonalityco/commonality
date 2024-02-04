import { describe, expect, it } from 'vitest';
import { getConformanceResults } from './get-conformance-results';
import { Package, TagsData } from '@commonalityco/types';
import { Check, PackageType, Status } from '@commonalityco/utils-core';

describe('getConformanceResults', () => {
  it('should return errors when workspace is not valid and have a level set to error', async () => {
    const conformersByPattern: Record<string, Check[]> = {
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
    expect(results[0].status).toBe(Status.Fail);
    expect(results[0].message.title).toBe('Invalid workspace');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return errors when workspace is not valid and do not have a level set', async () => {
    const conformersByPattern: Record<string, Check[]> = {
      '*': [
        {
          name: 'InvalidWorkspaceConformer',
          validate: () => false,
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
    expect(results[0].message.title).toBe('Invalid workspace');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return valid results when checks are valid', async () => {
    const conformersByPattern: Record<string, Check[]> = {
      '*': [
        {
          name: 'ValidWorkspaceConformer',
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
    expect(results[0].message.title).toBe('Valid workspace');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return valid results when checks are valid and there are no tags', async () => {
    const conformersByPattern: Record<string, Check[]> = {
      '*': [
        {
          name: 'ValidWorkspaceConformer',
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
    expect(results[0].message.title).toBe('Valid workspace');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should handle exceptions during validation', async () => {
    const conformersByPattern: Record<string, Check[]> = {
      '*': [
        {
          name: 'ExceptionConformer',
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
    expect(results[0].status).toBe(Status.Fail);
    expect(results[0].message.title).toBe('Exception during validation');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should handle conformers that target patterns other than *', async () => {
    const conformersByPattern: Record<string, Check[]> = {
      tag1: [
        {
          name: 'Tag1Conformer',
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
    expect(results[0].message.title).toBe('Valid workspace for tag1');
    expect(results[0].filter).toBe('tag1');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return correct result when message property is a function', async () => {
    const conformersByPattern: Record<string, Check[]> = {
      '*': [
        {
          name: 'MessageFunctionConformer',
          validate: () => true,
          message: (context) => ({
            title: `Valid package for ${context.package.relativePath}`,
          }),
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
    expect(results[0].message.title).toBe(
      'Valid package for /path/to/workspace',
    );
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });
});
