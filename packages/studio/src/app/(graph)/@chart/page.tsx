import 'server-only';
import { getDependenciesData } from '@/data/dependencies';
import { getPackagesData } from '@/data/packages';
import StudioChart from './studio-chart';
import { getProjectData } from '@/data/project';
import { getConstraintsData } from '@/data/constraints';

async function ChartPage() {
  const [packages, dependencies, results, project] = await Promise.all([
    getPackagesData(),
    getDependenciesData(),
    getConstraintsData(),
    getProjectData(),
  ]);

  return (
    <StudioChart
      dependencies={dependencies}
      results={results}
      packages={packages}
      constraints={project.config?.config.constraints}
    />
  );
}

export default ChartPage;
