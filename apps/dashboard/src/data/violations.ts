import { cache } from 'react';
import 'server-only';
import {
  getPackageManager,
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';

import { getViolations } from '@commonalityco/data-violations';
import { getPackagesData } from './packages';

export const getViolationsData = cache(async () => {
  const rootDirectory = await getRootDirectory();
  const packages = await getPackagesData();
  const projectConfig = await getProjectConfig({ rootDirectory });
  console.log({packages})
  const violations = getViolations({ packages, projectConfig });

  return violations
});
