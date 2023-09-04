import 'server-only';
import { getDependenciesData } from '@/data/dependencies';
import { getViolationsData } from '@/data/violations';
import { getPackagesData } from '@/data/packages';
import { getConstraintsData } from '@/data/constraints';
import StudioChart from './studio-chart';

async function ChartPage() {
  const [packages, dependencies, violations, constraints] = await Promise.all([
    getPackagesData(),
    getDependenciesData(),
    getViolationsData(),
    getConstraintsData(),
  ]);

  return (
    <StudioChart
      dependencies={dependencies}
      violations={violations}
      packages={packages}
      constraints={constraints}
    />
  );
}

export default ChartPage;
