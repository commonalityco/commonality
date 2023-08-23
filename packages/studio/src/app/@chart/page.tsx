import 'server-only';
import { getDependenciesData } from 'data/dependencies';
import { getViolationsData } from 'data/violations';
import { getPackagesData } from 'data/packages';
import { getConstraintsData } from 'data/constraints';
import { getProject } from 'data/project';
import StudioChart from './studio-chart';

async function ChartPage() {
  const project = await getProject();
  const packages = await getPackagesData();
  const dependencies = await getDependenciesData();
  const violations = await getViolationsData();
  const constraints = await getConstraintsData();

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
