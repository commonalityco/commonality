import { describe, expect, it } from 'vitest';
import { getConformanceResults } from './get-conformance-results';
import { Package, TagsData } from '@commonalityco/types';
import { PackageType, Status } from '@commonalityco/utils-core';
import { ProjectConfig } from '@commonalityco/utils-core';

describe('getConformanceResults', () => {
  it('should return errors when workspace is not valid and have a level set to error', async () => {
    const conformersByPattern: ProjectConfig['checks'] = {
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
    const conformersByPattern: ProjectConfig['checks'] = {
      '*': [
        {
          name: 'InvalidWorkspaceConformer',
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
    expect(results[0].status).toBe(Status.Warn);
    expect(results[0].message.title).toBe('Invalid workspace');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return valid results when tests are valid', async () => {
    const conformersByPattern: ProjectConfig['checks'] = {
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
    expect(results[0].status).toBe(Status.Pass);
    expect(results[0].message.title).toBe('Valid workspace');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should handle exceptions during validation', async () => {
    const conformersByPattern: ProjectConfig['checks'] = {
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
    expect(results[0].status).toBe(Status.Fail);
    expect(results[0].message.title).toBe('Exception during validation');
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should handle conformers that target patterns other than *', async () => {
    const conformersByPattern: ProjectConfig['checks'] = {
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
    expect(results[0].status).toBe(Status.Pass);
    expect(results[0].message.title).toBe('Valid workspace for tag1');
    expect(results[0].filter).toBe('tag1');
    expect(results[0].package).toEqual(packages[0]);
  });

  it('should return correct result when message property is a function', async () => {
    const conformersByPattern: ProjectConfig['checks'] = {
      '*': [
        {
          name: 'MessageFunctionConformer',
          validate: () => true,
          message: (context) => ({
            title: `Valid package for ${context.package.relativePath}`,
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
    expect(results[0].status).toBe(Status.Pass);
    expect(results[0].message.title).toBe(
      'Valid package for /path/to/workspace',
    );
    expect(results[0].filter).toBe('*');
    expect(results[0].package).toEqual(packages[0]);
  });
});
