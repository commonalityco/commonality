import { getTableData } from './get-table-data';
import { describe, expect, it, vi } from 'vitest';
import { CodeownersData, Package, TagsData } from '@commonalityco/types';
import { PackageType } from '@commonalityco/utils-core';
import fs from 'fs-extra';

describe('getTableData', () => {
  beforeEach(() => {
    vi.spyOn(fs, 'pathExists').mockResolvedValue(true as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle pagination correctly', async () => {
    const packages: Package[] = Array(50)
      .fill(0)
      .map((_, i) => ({
        name: `Package ${i}`,
        path: '',
        type: PackageType.NODE,
        version: '1.0.0',
      }));

    const result = await getTableData({
      packages,
      tagsData: [],
      codeownersData: [],
      filterName: '',
      filterTags: [],
      filterCodeowners: [],
      page: 2,
      pageCount: 20,
      rootDirectory: '/root',
    });

    expect(result).toHaveLength(20);
    expect(result[0].name).toBe('Package 20');
    expect(result[19].name).toBe('Package 39');
    expect(fs.pathExists).toBeCalledTimes(20);
  });

  it('should filter by name correctly', async () => {
    const packages: Package[] = Array(50)
      .fill(0)
      .map((_, i) => ({
        name: `Package ${i}`,
        path: '',
        type: PackageType.NODE,
        version: '1.0.0',
      }));

    const result = await getTableData({
      packages,
      tagsData: [],
      codeownersData: [],
      filterName: 'Package 10',
      filterTags: [],
      filterCodeowners: [],
      page: 1,
      pageCount: 50,
      rootDirectory: '/root',
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Package 10');
  });

  it('should filter by tags correctly', async () => {
    const packages = Array(50)
      .fill(0)
      .map(
        (_, i) =>
          ({
            name: `Package ${i}`,
            path: '',
            type: PackageType.NODE,
            version: '1.0.0',
          }) satisfies Package,
      );
    const tagsData = Array(50)
      .fill(0)
      .map(
        (_, i) =>
          ({
            packageName: `Package ${i}`,
            tags: [`tag${i}`],
          }) satisfies TagsData,
      );

    const result = await getTableData({
      packages,
      tagsData,
      codeownersData: [],
      filterName: '',
      filterTags: ['tag10'],
      filterCodeowners: [],
      page: 1,
      pageCount: 50,
      rootDirectory: '/root',
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Package 10');
  });

  it('should filter by codeowners correctly', async () => {
    const packages: Package[] = Array(50)
      .fill(0)
      .map((_, i) => ({
        name: `Package ${i}`,
        path: '',
        type: PackageType.NODE,
        version: '1.0.0',
        codeowners: [`codeowner${i}`],
      }));

    const codeownersData = Array(50)
      .fill(0)
      .map(
        (_, i) =>
          ({
            packageName: `Package ${i}`,
            codeowners: [`codeowner${i}`],
          }) satisfies CodeownersData,
      );

    const result = await getTableData({
      packages,
      tagsData: [],
      codeownersData,
      filterName: '',
      filterTags: [],
      filterCodeowners: ['codeowner10'],
      page: 1,
      pageCount: 50,
      rootDirectory: '/root',
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Package 10');
  });
});
