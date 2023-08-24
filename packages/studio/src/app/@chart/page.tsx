import 'server-only';
import { getDependenciesData } from 'data/dependencies';
import { getViolationsData } from 'data/violations';
import { getPackagesData } from 'data/packages';
import { getConstraintsData } from 'data/constraints';
import { getProject } from 'data/project';
import StudioChart from './studio-chart';

async function ChartPage() {
  const [project, packages, dependencies, violations, constraints] =
    await Promise.all([
      getProject(),
      getPackagesData(),
      getDependenciesData(),
      getViolationsData(),
      getConstraintsData(),
    ]);

  return (
    <StudioChart
      dependencies={dependencies}
      packageManager={project.packageManager}
      violations={violations}
      packages={packages}
      constraints={constraints}
    />
  );
}

export default ChartPage;
