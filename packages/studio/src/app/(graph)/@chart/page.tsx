import 'server-only';
import { getDependenciesData } from '@/data/dependencies';
import { getViolationsData } from '@/data/violations';
import { getPackagesData } from '@/data/packages';
import StudioChart from './studio-chart';
import { getProjectData } from '@/data/project';

async function ChartPage() {
  const [packages, dependencies, violations, project] = await Promise.all([
    getPackagesData(),
    getDependenciesData(),
    getViolationsData(),
    getProjectData(),
  ]);

  return (
    <StudioChart
      dependencies={dependencies}
      violations={violations}
      packages={packages}
      constraints={project.config?.constraints}
    />
  );
}

export default ChartPage;
