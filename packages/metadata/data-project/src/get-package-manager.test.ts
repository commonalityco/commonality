import { PackageManager } from '@commonalityco/utils-core';
import path from 'path';
import { getPackageManager } from './get-package-manager';

const log = console.log;

describe('getPackageManager', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = log;
  });

  it(`should return ${PackageManager.NPM} for an NPM workspace`, async () => {
    const rootDirectory = path.join(__dirname, '../fixtures', 'npm-workspace');
    const packageManager = await getPackageManager({ rootDirectory });

    expect(packageManager).toEqual(PackageManager.NPM);
  });

  it(`should return ${PackageManager.YARN} for an Yarn workspace`, async () => {
    const rootDirectory = path.join(__dirname, '../fixtures', 'yarn-workspace');
    const packageManager = await getPackageManager({ rootDirectory });

    expect(packageManager).toEqual(PackageManager.YARN);
  });

  it(`should return ${PackageManager.PNPM} for an pnpm workspace`, async () => {
    const rootDirectory = path.join(__dirname, '../fixtures', 'pnpm-workspace');
    const packageManager = await getPackageManager({ rootDirectory });

    expect(packageManager).toEqual(PackageManager.PNPM);
  });
});
