import { PackageManager } from '@commonalityco/utils-core';
import {
  Constraint,
  Dependency,
  Package,
  Violation,
} from '@commonalityco/types';
import FeatureGraphContent from './feature-graph-content.js';
import { Package as PackageIcon } from 'lucide-react';

interface GraphProperties {
  packageManager?: PackageManager;
  getPackages: () => Promise<Package[]>;
  getViolations: () => Promise<Violation[]>;
  getConstraints: () => Promise<Constraint[]>;
  getDependencies: () => Promise<Dependency[]>;
}

export async function FeatureGraph({
  packageManager,
  getViolations,
  getPackages,
  getConstraints,
  getDependencies,
}: GraphProperties) {
  const packages = await getPackages();
  const dependencies = await getDependencies();
  const violations = await getViolations();
  const constraints = await getConstraints();
  const isZero = !packages?.length;

  if (isZero) {
    return (
      <div className="bg-background absolute bottom-0 left-0 right-0 top-0 z-30 flex h-full w-full items-center justify-center transition-opacity">
        <div className="max-w-sm text-center">
          <PackageIcon className="mx-auto h-8 w-8" />
          <p className="mb-2 mt-4 text-base font-semibold">
            Build your first package
          </p>
          <p className="text-muted-foreground">
            You'll see your dependency graph here after you've created your
            first package.
          </p>
        </div>
      </div>
    );
  }

  return (
    <FeatureGraphContent
      packages={packages}
      dependencies={dependencies}
      violations={violations}
      constraints={constraints}
      packageManager={packageManager}
    />
  );
}

export default FeatureGraph;
