import { PackageJson } from 'commonality';
import { getExternalVersionMap } from './get-external-version-map';
import { describe, it, expect } from 'vitest';

describe('getExternalVersionMap', () => {
  it('should return an empty map when no workspaces are provided', () => {
    const packageJsons: PackageJson[] = [];
    const versionMap = getExternalVersionMap(packageJsons);
    expect(versionMap.size).toBe(0);
  });

  it('should return a map with the most common package versions when workspaces are provided', async () => {
    const packageJsons = [
      {
        name: 'pkgA',
        dependencies: {
          package1: '^3.0.0',
        },
      },
      {
        name: 'pkgB',
        dependencies: {
          package1: '^2.0.0',
        },
      },
      {
        name: 'pkgC',
        devDependencies: {
          package1: '^2.0.0',
        },
      },
    ];

    const versionMap = getExternalVersionMap(packageJsons);
    expect(versionMap.size).toBe(1);
    expect(versionMap.get('package1')).toBe('^2.0.0');
  });

  it('should return a map with the most common package versions when workspaces are provided', async () => {
    const packageJsons = [
      {
        name: 'pkgA',
        dependencies: {
          package1: '3.0.0',
          package2: '2.0.0',
          package3: '2.0.0',
        },
      },
      {
        name: 'pkgB',
        dependencies: {
          package1: '2.0.0',
          package2: '2.0.0',
          package3: '2.0.0',
        },
      },
      {
        name: 'pkgC',
        devDependencies: {
          package1: '2.0.0',
          package3: '3.0.0',
        },
      },
    ];
    const versionMap = getExternalVersionMap(packageJsons);
    expect(versionMap.size).toBe(3);
    expect(versionMap.get('package1')).toBe('2.0.0');
    expect(versionMap.get('package2')).toBe('2.0.0');
    expect(versionMap.get('package3')).toBe('2.0.0');
  });

  it('should return a map with the highest package versions when occurances of a dependency are equal across workspaces', async () => {
    const workspaces = [
      {
        name: 'pkgA',
        dependencies: {
          package1: '1.0.0',
          package2: '1.0.0',
          package3: '1.0.0',
        },
      },
      {
        name: 'pkgB',
        devDependencies: {
          package1: '2.0.0',
          package2: '2.0.0',
          package3: '2.0.0',
        },
      },
      {
        name: 'pkgC',
        devDependencies: {
          package1: '3.0.0',
          package3: '3.0.0',
        },
      },
    ];
    const versionMap = getExternalVersionMap(workspaces);
    expect(versionMap.size).toBe(3);
    expect(versionMap.get('package1')).toBe('3.0.0');
    expect(versionMap.get('package2')).toBe('2.0.0');
    expect(versionMap.get('package3')).toBe('3.0.0');
  });

  it('should return a map with the highest version when multiple workspaces have the same package', () => {
    const workspaces = [
      {
        name: 'pkgA',
        dependencies: {
          package1: '1.0.0',
        },
      },
      {
        name: 'pkgB',
        devDependencies: {
          package1: '2.0.0',
        },
      },
    ];
    const versionMap = getExternalVersionMap(workspaces);
    expect(versionMap.size).toBe(1);
    expect(versionMap.get('package1')).toBe('2.0.0');
  });

  it('should not include internal packages in the map', () => {
    const workspaceA = {
      name: 'package-a',
      dependencies: {
        'package-b': 'workspace:*',
        package3: '3.0.0',
      },
    };
    const workspaceB = {
      name: 'package-b',
      dependencies: {
        package3: '1.0.0',
      },
    };
    const workspaceC = {
      name: 'package-c',
      devDependencies: {
        package3: '1.0.0',
      },
    };
    const versionMap = getExternalVersionMap([
      workspaceA,
      workspaceB,
      workspaceC,
    ]);

    expect(versionMap.size).toBe(1);
    expect(versionMap.get('package-b')).toEqual(undefined);
    expect(versionMap.get('package3')).toBe('1.0.0');
  });
});
